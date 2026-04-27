#!/usr/bin/env node
/**
 * Build-time animated OG card generator (APNG).
 *
 * Pipeline (mirrors generate-og.mjs but adds frame stepping + APNG encoding):
 *   1. Spin up the same static HTTP server over `dist/`.
 *   2. For each (lang, profile), navigate Puppeteer to /og/{lang}/{profile}/?capture=1
 *      so the OG route mounts NoiseBackground in capture mode (no rAF, time
 *      driven externally via window.__noiseFrame(t)).
 *   3. Step time uniformly from 0 to OG_LOOP_SECONDS in TOTAL_FRAMES steps.
 *      Screenshot after each step (preserveDrawingBuffer is on so the canvas
 *      pixels survive between rAF and capture).
 *   4. Decode each screenshot PNG → raw RGBA via pngjs.
 *   5. Encode the frame stack as APNG via upng-js with palette quantization
 *      (cnum colours) — keeps file size in the ~1 MB range despite 1200×630.
 *   6. Overwrite public/og/og-{lang}-{profile}.png — APNG is a valid PNG so
 *      the static <meta property="og:image"> reference still works for
 *      platforms that ignore animation; Discord/Telegram play the loop.
 *
 * Tunables in one place at the top.
 */

import puppeteer from 'puppeteer';
import http from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import UPNG from 'upng-js';
import { PNG } from 'pngjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'public', 'og');

const PORT = 4331;
const ORIGIN = `http://localhost:${PORT}`;

const LANGS = ['en', 'ru'];
const PROFILES = ['all', 'react', 'vue', 'fullstack'];

// === Animation parameters ===
// Must match OG_LOOP_SECONDS in src/pages/og/[lang]/[profile].astro.
// 4-second loop @ 10 fps gives a calmer, lava-lamp-like pace; 40 frames keeps
// file size around ~300-400 KB after palette quantization.
const OG_LOOP_SECONDS = 4;
const FPS = 10;
const TOTAL_FRAMES = OG_LOOP_SECONDS * FPS;     // 40
const FRAME_DELAY_MS = 1000 / FPS;              // 100ms

const VIEWPORT = { width: 1200, height: 630, deviceScaleFactor: 1 };

// upng-js palette colours per frame batch. 0 = lossless (huge files).
// 64 is the sweet spot — noise gradients stay smooth without banding while
// still keeping each file around 350 KB. Lower (32/16) starts visibly
// posterizing the dark blob edges and the photo skin tones.
const APNG_PALETTE_COLOURS = 64;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

function startStaticServer(distRoot, port) {
  const server = http.createServer(async (req, res) => {
    let url = decodeURIComponent((req.url || '/').split('?')[0]);
    if (url.endsWith('/')) url += 'index.html';
    const filepath = join(distRoot, url);
    try {
      const data = await readFile(filepath);
      const ext = extname(filepath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found: ' + url);
    }
  });
  return new Promise(resolve => server.listen(port, () => resolve(server)));
}

/** Decode a PNG buffer to a raw RGBA ArrayBuffer for upng-js. */
function pngToRGBA(buf) {
  const png = PNG.sync.read(buf);
  // pngjs returns Buffer; upng-js wants ArrayBuffer of RGBA.
  // png.data is RGBA in the same byte order upng expects.
  return png.data.buffer.slice(png.data.byteOffset, png.data.byteOffset + png.data.byteLength);
}

async function captureFramesFor(browser, lang, profile) {
  const url = `${ORIGIN}/og/${lang}/${profile}/?capture=1`;
  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);
  await page.goto(url, { waitUntil: 'networkidle0' });

  // Wait for the React island to hydrate and NoiseBackground to expose
  // window.__noiseFrame. Without this, the first few frames may be blank.
  await page.waitForFunction(() => (window).__noiseReady === true, { timeout: 8000 });

  const frames = [];
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    // t spans [0, OG_LOOP_SECONDS). Last frame at t = (N-1)/N * period — at
    // t = period the noise == frame 0 (loop), so we don't include it twice.
    const t = (i / TOTAL_FRAMES) * OG_LOOP_SECONDS;
    await page.evaluate(t => (window).__noiseFrame(t), t);
    const buf = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, ...VIEWPORT },
    });
    frames.push(pngToRGBA(buf));
  }
  await page.close();
  return frames;
}

async function main() {
  console.log(`Serving ${DIST} on ${ORIGIN}`);
  const server = await startStaticServer(DIST, PORT);
  await mkdir(OUT, { recursive: true });

  console.log('Launching headless Chromium…');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const lang of LANGS) {
      for (const profile of PROFILES) {
        const filename = `og-${lang}-${profile}.png`;
        const outPath = join(OUT, filename);

        process.stdout.write(`  ${filename.padEnd(28)} capturing ${TOTAL_FRAMES} frames…`);
        const t0 = Date.now();
        const frames = await captureFramesFor(browser, lang, profile);
        const captureMs = Date.now() - t0;

        process.stdout.write(' encoding…');
        const dels = Array(TOTAL_FRAMES).fill(FRAME_DELAY_MS);
        const apngBuf = UPNG.encode(frames, VIEWPORT.width, VIEWPORT.height, APNG_PALETTE_COLOURS, dels);
        await writeFile(outPath, Buffer.from(apngBuf));

        const sizeKb = (apngBuf.byteLength / 1024).toFixed(0);
        console.log(` ✓ ${sizeKb} KB (capture ${captureMs}ms)`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\n${LANGS.length * PROFILES.length} animated OG cards → ${OUT}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

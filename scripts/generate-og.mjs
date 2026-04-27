#!/usr/bin/env node
/**
 * Build-time OG card generator.
 *
 * Renders each `/og/{lang}/{profile}/` route via headless Chromium at exactly
 * 1200×630 (Open Graph rectangle spec) and writes a PNG into `public/og/`.
 *
 * The Layout.astro picks `og:image` per (lang, profile) pointing at these files,
 * so every shared URL gets a tailored social preview instead of one generic
 * cover.
 *
 * Run AFTER `pnpm build` so `dist/` exists. The combined `og-gen` script does
 * both steps.
 *
 * Filename pattern: `og-{lang}-{profile}.png`
 */

import puppeteer from 'puppeteer';
import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'public', 'og');

const PORT = 4330;
const ORIGIN = `http://localhost:${PORT}`;

const LANGS = ['en', 'ru'];
const PROFILES = ['all', 'react', 'vue', 'fullstack'];

const VIEWPORT = { width: 1200, height: 630, deviceScaleFactor: 1 };

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
  return new Promise(resolve => {
    server.listen(port, () => resolve(server));
  });
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
        const url = `${ORIGIN}/og/${lang}/${profile}/`;
        const filename = `og-${lang}-${profile}.png`;
        const outPath = join(OUT, filename);

        const page = await browser.newPage();
        await page.setViewport(VIEWPORT);
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Card uses the live <NoiseBackground> WebGL animation as its
        // backdrop — let React hydrate (client:load), the WebGL2 context
        // initialise, and a few rAF frames render before the snapshot.
        // 1500ms reliably catches a settled noise field across cold runs.
        await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));

        await page.screenshot({
          path: outPath,
          type: 'png',
          // Clip to viewport so any accidental overflow doesn't grow the file
          clip: { x: 0, y: 0, ...VIEWPORT },
          omitBackground: false,
        });
        await page.close();

        console.log(`  ✓ ${filename.padEnd(30)} ← ${url}`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\n${LANGS.length * PROFILES.length} OG cards generated → ${OUT}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

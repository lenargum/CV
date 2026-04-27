#!/usr/bin/env node
/**
 * Build-time PDF generator.
 *
 * Renders each `/pdf/{lang}/{profile}/` route via headless Chromium (Puppeteer)
 * and writes a real PDF file into `public/downloads/`. The PDF Modal's
 * Download button links to these files, so users get a one-click download
 * with a clean ATS-parseable filename instead of going through the browser's
 * print dialog.
 *
 * Filename pattern: `LenarGumerov_<Spec>[_<Lang>].pdf`
 *   react     → ReactFrontend
 *   vue       → VueFrontend
 *   fullstack → Fullstack
 *   all       → Resume   (neutral, avoids /fullstack/ filename collision)
 *
 * Workflow:
 *   1. Spawn a tiny static HTTP server over `dist/` on localhost:4329
 *   2. For each (lang, profile), navigate Puppeteer to the route
 *   3. `page.pdf({ format: A4, printBackground: true, margins from CSS @page })`
 *   4. Shut down server + browser
 *
 * Run AFTER `pnpm build` so `dist/` exists. The combined `pdf-gen` script
 * does both steps.
 */

import puppeteer from 'puppeteer';
import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, 'public', 'downloads');

const PORT = 4329;
const ORIGIN = `http://localhost:${PORT}`;

const LANGS = ['en', 'ru'];
const PROFILES = ['all', 'react', 'vue', 'fullstack'];

const SPEC = { all: 'CV', react: 'CV_React', vue: 'CV_Vue', fullstack: 'CV_Fullstack' };
const filenameFor = (lang, profile) => {
  const langSuffix = lang === 'ru' ? '_RU' : '';
  return `LenarGumerov_${SPEC[profile]}${langSuffix}.pdf`;
};

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
        const url = `${ORIGIN}/pdf/${lang}/${profile}/`;
        const filename = filenameFor(lang, profile);
        const outPath = join(OUT, filename);

        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.pdf({
          path: outPath,
          format: 'A4',
          printBackground: true,
          // Margins come from CSS @page rule in the route; keep Puppeteer
          // margins at zero so we don't double-pad.
          margin: { top: '0', right: '0', bottom: '0', left: '0' },
        });
        await page.close();

        console.log(`  ✓ ${filename.padEnd(36)} ← ${url}`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\n${LANGS.length * PROFILES.length} PDFs generated → ${OUT}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

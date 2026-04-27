#!/usr/bin/env node
/**
 * QR generator for the resume site — pure JS, no native deps.
 *
 * Generates one styled SVG per (lang, profile) combo into `public/qr/`:
 *   - extra-rounded corner finder patterns
 *   - round inner dots
 *   - square data modules
 *   - transparent background
 *   - black foreground
 *
 * URL scheme matches `pages/`:
 *   en/all       → https://lenargum.me/
 *   en/{profile} → https://lenargum.me/{profile}/
 *   ru/all       → https://lenargum.me/ru/
 *   ru/{profile} → https://lenargum.me/ru/{profile}/
 *
 * Run:  pnpm qr   (or: node scripts/generate-qrs.mjs)
 */

import QRCode from 'qrcode';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'qr');

const SITE_ORIGIN = 'https://lenargum.me';
const LANGS = ['en', 'ru'];
const PROFILES = ['all', 'react', 'vue', 'fullstack'];

const MODULE_SIZE = 10;        // SVG units per QR module
const MARGIN_MODULES = 1;      // quiet zone (in modules) around the QR
const FOREGROUND = '#000000';

function buildUrl(lang, profile) {
  const langSegment = lang === 'en' ? '' : 'ru/';
  const profileSegment = profile === 'all' ? '' : `${profile}/`;
  return `${SITE_ORIGIN}/${langSegment}${profileSegment}`;
}

function inFinderArea(row, col, size) {
  if (row < 7 && col < 7) return true;                  // top-left
  if (row < 7 && col >= size - 7) return true;          // top-right
  if (row >= size - 7 && col < 7) return true;          // bottom-left
  return false;
}

function roundedRectPath(x, y, w, h, r) {
  // Clockwise rounded rectangle as SVG path (used with fill-rule="evenodd"
  // to subtract one rect from another and form a ring).
  return `M ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} ` +
         `L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} ` +
         `L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} ` +
         `L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`;
}

function renderFinder(rowMod, colMod, mod, color) {
  // 7×7 finder pattern, fully square (no rounding anywhere):
  //   - outer 7×7 sharp-corner ring
  //   - 5×5 inner cutout (sharp)
  //   - 3×3 module square center block
  const x = colMod * mod;
  const y = rowMod * mod;
  const outerSize = 7 * mod;
  const innerSize = 5 * mod;

  const innerX = x + mod;
  const innerY = y + mod;

  const sharpRectPath = (x0, y0, w, h) =>
    `M ${x0} ${y0} L ${x0 + w} ${y0} L ${x0 + w} ${y0 + h} L ${x0} ${y0 + h} Z`;

  const ringPath =
    sharpRectPath(x, y, outerSize, outerSize) +
    ' ' +
    sharpRectPath(innerX, innerY, innerSize, innerSize);

  const centerX = x + 2 * mod;
  const centerY = y + 2 * mod;
  const centerSize = 3 * mod;

  return (
    `<path d="${ringPath}" fill="${color}" fill-rule="evenodd" shape-rendering="crispEdges"/>` +
    `<rect x="${centerX}" y="${centerY}" width="${centerSize}" height="${centerSize}" fill="${color}" shape-rendering="crispEdges"/>`
  );
}

function generateSVG(text) {
  const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
  const size = qr.modules.size;
  const data = qr.modules.data;

  const totalUnits = (size + MARGIN_MODULES * 2) * MODULE_SIZE;
  const m = MODULE_SIZE;
  const mg = MARGIN_MODULES;

  let body = '';

  // Data modules — skip the three finder areas
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (inFinderArea(row, col, size)) continue;
      if (!data[row * size + col]) continue;
      const x = (col + mg) * m;
      const y = (row + mg) * m;
      body += `<rect x="${x}" y="${y}" width="${m}" height="${m}" fill="${FOREGROUND}"/>`;
    }
  }

  // Three finder patterns (extra-rounded ring + dot)
  body += renderFinder(mg, mg, m, FOREGROUND);                          // top-left
  body += renderFinder(mg, mg + (size - 7), m, FOREGROUND);             // top-right
  body += renderFinder(mg + (size - 7), mg, m, FOREGROUND);             // bottom-left

  // crispEdges on the root eliminates sub-pixel anti-aliasing gaps between
  // adjacent module rects. Finder ring path overrides to geometricPrecision
  // for clean rounded corners (per-element shape-rendering attr).
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalUnits} ${totalUnits}" width="${totalUnits}" height="${totalUnits}" shape-rendering="crispEdges">
${body}
</svg>`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const lang of LANGS) {
    for (const profile of PROFILES) {
      const url = buildUrl(lang, profile);
      const filename = `qr-code-${lang}-${profile}.svg`;
      const outPath = join(OUT_DIR, filename);

      const svg = generateSVG(url);
      await writeFile(outPath, svg, 'utf8');

      console.log(`  ${filename.padEnd(28)} → ${url}`);
    }
  }

  console.log(`\n${LANGS.length * PROFILES.length} QR codes generated → ${OUT_DIR}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

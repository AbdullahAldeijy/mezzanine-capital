// Dev-time helper (not run on Netlify): regenerates optimised images in /images.
// Usage: NODE_PATH=<dir with sharp installed> node scripts/build-images.mjs
import { createRequire } from 'node:module';
const require = createRequire(process.env.NODE_PATH ? process.env.NODE_PATH + '/' : import.meta.url);
const sharp = require('sharp');

const src = 'images/src/kafd.webp';
for (const w of [640, 1024, 1600]) {
  const img = () => sharp(src).resize({ width: w });
  await img().avif({ quality: 50, effort: 6 }).toFile(`images/hero-${w}.avif`);
  await img().webp({ quality: 72, effort: 6 }).toFile(`images/hero-${w}.webp`);
}
// Social card (JPEG is the safest format for OG / Twitter scrapers)
await sharp(src).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80, mozjpeg: true }).toFile('images/og-hero.jpg');
// Wordmark: displayed at ~180px wide, so 540px covers 3x screens
await sharp('mezzanine-logo-3x.png').resize({ width: 540 }).webp({ quality: 90 }).toFile('images/logo-wordmark.webp');
console.log('done');

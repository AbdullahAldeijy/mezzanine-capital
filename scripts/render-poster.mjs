// Dev-time: renders the static city poster from the SAME WebGL scene the site runs (v2/scene.js, poster mode).
// Writes images/city-poster-{wide,tall}-{ltr,rtl}.webp. Needs Playwright + a local static server on the repo root:
//   node scripts/render-poster.mjs http://localhost:8099
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const base = process.argv[2] || 'http://localhost:8099';
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
for (const [name, w, h] of [['wide', 1600, 900], ['tall', 800, 1200]]) {
  const page = await (await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 })).newPage();
  await page.goto(`${base}/?poster`, { waitUntil: 'load' });
  await page.waitForFunction(() => typeof window.__cityPoster === 'function', null, { timeout: 15000 });
  // export the frame as WebP; the RTL poster is the same frame mirrored (the live RTL scene is mirrored too)
  const out = await page.evaluate(async () => {
    const img = new Image(); img.src = window.__cityPoster(); await img.decode();
    const make = (flip) => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); if (flip) { x.translate(c.width, 0); x.scale(-1, 1); } x.drawImage(img, 0, 0); return c.toDataURL('image/webp', 0.76); };
    return { ltr: make(false), rtl: make(true), size: [img.width, img.height] };
  });
  for (const dir of ['ltr', 'rtl']) writeFileSync(`images/city-poster-${name}-${dir}.webp`, Buffer.from(out[dir].split(',')[1], 'base64'));
  console.log(name, out.size.join('x'));
}
await browser.close();

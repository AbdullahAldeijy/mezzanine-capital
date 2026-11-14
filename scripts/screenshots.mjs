// Dev-time helper: serves the repo root and takes full-page EN/AR screenshots at 375/768/1440.
// Usage: node scripts/screenshots.mjs [outDir]   (requires Playwright, preinstalled in the cloud env)
import http from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const { PAGES } = await import(new URL('../src/pages.mjs', import.meta.url));
const root = process.cwd();
const out = process.argv[2] || 'screenshots';
mkdirSync(out, { recursive: true });
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.webp': 'image/webp', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = join(root, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch();
let bad = 0;
const targets = PAGES.flatMap((p) => ['en', 'ar'].map((l) => [l, `${l === 'ar' ? '/ar/' : '/'}${p.slug ? p.slug + '/' : ''}`, p.key]));
for (const [lang, path, key] of targets) {
  for (const [w, h] of [[375, 812], [768, 1024], [1440, 900]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('console', (m) => m.type() === 'error' && !/fonts\.g|ERR_|Failed to load resource/.test(m.text()) && console.log('console error', lang, key, w, m.text()));
    await page.goto(base + path, { waitUntil: 'load' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const wide = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1 && !e.closest('.sr-only, .skip-link, .mobile-panel')).slice(0, 5).map((e) => e.tagName + '.' + e.className));
    if (overflow > 0 || wide.length) { bad++; console.log(`OVERFLOW ${lang} ${key} ${w}: +${overflow}px`, wide); }
    // sticky CTA bar must never cover content: scroll to the bottom and compare with the last visible content
    const cover = await page.evaluate(() => {
      const bar = document.getElementById('cta-bar'); if (!bar) return 0;
      window.scrollTo(0, document.documentElement.scrollHeight);
      const r = document.querySelector('.footer-rights').getBoundingClientRect();
      return Math.max(0, r.bottom - bar.getBoundingClientRect().top);
    });
    if (cover > 0) { bad++; console.log(`CTA BAR COVERS CONTENT ${lang} ${key} ${w}: ${cover}px`); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${out}/${lang}-${key}-${w}.png`, fullPage: true });
    await ctx.close();
  }
}
await browser.close();
server.close();
console.log(bad ? `${bad} layout problem(s)` : 'no horizontal overflow');

// Dev-time helper: serves the repo root and takes full-page EN/AR screenshots at 375/768/1440.
// Usage: node scripts/screenshots.mjs [outDir]   (requires Playwright, preinstalled in the cloud env)
import http from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

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
for (const [lang, path] of [['en', '/'], ['ar', '/ar/']]) {
  for (const [w, h] of [[375, 812], [768, 1024], [1440, 900]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    page.on('console', (m) => m.type() === 'error' && !/fonts\.g|ERR_|Failed to load resource/.test(m.text()) && console.log('console error', lang, w, m.text()));
    await page.goto(base + path, { waitUntil: 'load' });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const wide = await page.evaluate(() => [...document.querySelectorAll('body *')].filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1 && !e.closest('.sr-only, .skip-link, .mobile-panel')).slice(0, 5).map((e) => e.tagName + '.' + e.className));
    if (overflow > 0 || wide.length) { bad++; console.log(`OVERFLOW ${lang} ${w}: +${overflow}px`, wide); }
    await page.screenshot({ path: `${out}/${lang}-${w}.png`, fullPage: true });
    await ctx.close();
  }
}
await browser.close();
server.close();
console.log(bad ? `${bad} layout problem(s)` : 'no horizontal overflow');

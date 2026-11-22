// Dev-time helper: serves the repo root and takes full-page EN/AR screenshots of every page at 375/768/1440,
// checking for horizontal overflow, console errors / failed requests, layout shift and the sticky bar covering content.
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
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = http.createServer((req, res) => {
  let f = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' });
  res.end(readFileSync(f));
}).listen(0);
const base = `http://localhost:${server.address().port}`;

// software WebGL so the city renders in headless runs
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
let bad = 0;
const targets = PAGES.flatMap((p) => ['en', 'ar'].map((l) => [l, `${l === 'ar' ? '/ar/' : '/'}${p.slug ? p.slug + '/' : ''}`, p.key]));
for (const [lang, path, key] of targets) {
  for (const [w, h] of [[375, 812], [768, 1024], [1440, 900]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700 });
    const page = await ctx.newPage(); const errs = [];
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    page.on('pageerror', (e) => errs.push(String(e)));
    page.on('response', (r) => r.status() >= 400 && errs.push(`${r.status()} ${r.url()}`));
    await page.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); });
    await page.goto(base + path, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const cls = await page.evaluate(() => window.__cls);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    // scroll through (scroll-driven states, sticky bar entrance), then check the bar never covers the end of the page
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 500) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(60); }
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await page.waitForTimeout(900);
    const cover = await page.evaluate(() => {
      const bar = document.querySelector('.cta-bar-inner'); if (!bar) return 0;
      return Math.max(0, document.querySelector('.footer-rights').getBoundingClientRect().bottom - bar.getBoundingClientRect().top);
    });
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300);
    await page.screenshot({ path: `${out}/${lang}-${key}-${w}.png`, fullPage: true });
    const problems = [overflow > 0 && `overflow +${overflow}px`, cover > 0 && `sticky bar covers ${Math.round(cover)}px`, cls > 0.05 && `CLS ${cls.toFixed(3)}`, errs.length && `errors: ${errs.join(' | ')}`].filter(Boolean);
    if (problems.length) { bad++; console.log(`FAIL ${lang} ${key} ${w}: ${problems.join('; ')}`); }
    await ctx.close();
  }
}
await browser.close();
server.close();
console.log(bad ? `${bad} page/size combination(s) with problems (of ${targets.length * 3})` : `all ${targets.length * 3} page/size combinations clean`);

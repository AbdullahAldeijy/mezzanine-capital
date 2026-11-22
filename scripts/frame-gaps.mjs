// Dev-time frame-gap test for the live city (Home, Contact; EN + AR).
// Serves the repo root, simulates a capable desktop (so the live-scene path runs), waits for the intro, then
// measures 10 s idle + 10 s with mouse moves: frame gaps over 50 ms (passive rAF probe, like ?fps) and GL draws.
// Pass = no gaps over 50 ms, no GL draws while idle, the city redraws while the mouse moves.
// Usage: node scripts/frame-gaps.mjs   (Playwright; headless runs use software GL, so this checks scheduling, not GPU cost)
import http from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const root = process.cwd();
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let f = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const MACHINE = () => {
  const o = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (t, x) { const g = o.call(this, t, x); if (g && /webgl/.test(t)) { const gp = g.getParameter.bind(g); g.getParameter = (k) => (k === 0x9246 ? 'NVIDIA GeForce RTX 4060' : gp(k)); } return g; };
  Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 32 });
  window.__draws = 0;
  const wrap = (P) => { const d = P && P.prototype.drawArrays; if (d) P.prototype.drawArrays = function (...a) { window.__draws++; return d.apply(this, a); }; };
  wrap(window.WebGLRenderingContext); wrap(window.WebGL2RenderingContext);
};
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
let failed = 0;
for (const path of ['/ar/', '/', '/ar/contact/', '/contact/']) {
  const p = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await p.addInitScript(MACHINE);
  await p.goto(base + path, { waitUntil: 'load' });
  await p.waitForTimeout(6000);
  const live = await p.evaluate(() => !!document.querySelector('[data-city].is-live'));
  await p.evaluate(() => { window.__gaps = []; window.__phase = 'idle'; window.__n = { idle: 0, move: 0 }; let last = 0;
    const f = (t) => { if (last) { const d = t - last; window.__n[window.__phase]++; if (d > 50) window.__gaps.push([window.__phase, Math.round(d)]); } last = t; requestAnimationFrame(f); };
    requestAnimationFrame(f); window.__d0 = window.__draws; });
  await p.waitForTimeout(10000);
  const idleDraws = await p.evaluate(() => { const d = window.__draws - window.__d0; window.__phase = 'move'; window.__d1 = window.__draws; return d; });
  for (let i = 0; i < 200; i++) { await p.mouse.move(300 + (i % 40) * 20, 250 + Math.sin(i / 6) * 120); await p.waitForTimeout(50); }
  const r = await p.evaluate(() => ({ moveDraws: window.__draws - window.__d1, gaps: window.__gaps, n: window.__n }));
  const ok = live && r.gaps.length === 0 && idleDraws === 0 && r.moveDraws > 100;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${path.padEnd(13)} live=${live} | idle 10 s: ${r.n.idle} frames, ${idleDraws} GL draws | mouse 10 s: ${r.n.move} frames, ${r.moveDraws} GL draws | gaps > 50 ms: ${r.gaps.length ? JSON.stringify(r.gaps) : 'none'}`);
}
await browser.close();
server.close();
console.log(failed ? `${failed} page(s) failed` : 'zero frame gaps over 50 ms on all pages');
process.exit(failed ? 1 : 0);

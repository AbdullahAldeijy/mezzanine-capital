// Direction C, "Capital Flow": liquid-light hero with an abstract intelligence console, then the value chain as a pipeline.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
// static poster for the flow field: a few luminous streamlines (no WebGL / reduced motion / low power)
{
  const lines = [];
  for (let i = 0; i < 14; i++) {
    const y = 120 + i * 46, a = 40 + (i % 5) * 14, ph = i * 0.7;
    let d = `M-20 ${y}`;
    for (let x = 0; x <= 1640; x += 80) d += ` L${x} ${(y + Math.sin(x / 260 + ph) * a + Math.sin(x / 90 + ph * 2) * 6).toFixed(1)}`;
    lines.push(`<path d="${d}" stroke-opacity="${(0.12 + (i % 4) * 0.08).toFixed(2)}"/>`);
  }
  writeFileSync(`${here}poster.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#12E0CF"/><stop offset="1" stop-color="#7CF7FF"/></linearGradient></defs><g fill="none" stroke="url(#g)" stroke-width="1.6">${lines.join('')}</g></svg>`);
}

// console: three columns of nodes (scattered signals -> intelligence -> capital) joined by curves; purely abstract
const COLS = [[[60, 40], [40, 92], [72, 140], [30, 176], [64, 222]], [[300, 82], [300, 180]], [[540, 130]]];
function consoleSVG() {
  const [a, b, c] = COLS, paths = [];
  a.forEach(([x, y], i) => { const [bx, by] = b[i < 3 ? 0 : 1]; paths.push(`M${x} ${y} C ${x + 120} ${y}, ${bx - 120} ${by}, ${bx} ${by}`); });
  b.forEach(([x, y]) => { const [cx, cy] = c[0]; paths.push(`M${x} ${y} C ${x + 120} ${y}, ${cx - 120} ${cy}, ${cx} ${cy}`); });
  const nodes = [...a.map((p) => [...p, 4]), ...b.map((p) => [...p, 9]), ...c.map((p) => [...p, 16])];
  return `<svg class="c-console-svg" viewBox="0 0 600 260" aria-hidden="true">
      <defs><linearGradient id="cg" x1="0" x2="1"><stop offset="0" stop-color="#12E0CF" stop-opacity=".25"/><stop offset="1" stop-color="#7CF7FF"/></linearGradient></defs>
      ${paths.map((d, i) => `<path id="cp${i}" class="c-wire" d="${d}"/>`).join('')}
      ${paths.map((_, i) => `<circle class="c-pulse" r="2.6"><animateMotion dur="${(2.4 + (i % 3) * 0.55).toFixed(2)}s" begin="${(i * 0.37).toFixed(2)}s" repeatCount="indefinite"><mpath href="#cp${i}"/></animateMotion></circle>`).join('')}
      ${nodes.map(([x, y, r]) => `<circle class="c-node${r > 10 ? ' c-node-core' : ''}" cx="${x}" cy="${y}" r="${r}"/>`).join('')}
    </svg>`;
}

export default function c(t, { lang, rtl, esc, siteUrl }) {
  const h = t.home, w = t.how;
  const body = `
<section class="c-hero" aria-labelledby="c-title">
  <div class="c-flow" aria-hidden="true"></div>
  <div class="c-hero-inner">
    <h1 id="c-title" class="c-title">${esc(h.title)}</h1>
    <p class="c-lede">${esc(h.message)}</p>
    <div class="c-cta">
      <a class="c-btn c-btn-primary" href="${siteUrl(lang, 'contact')}">${esc(h.ctaContact)}</a>
      <a class="c-btn c-btn-glass" href="${siteUrl(lang, 'who-we-serve')}">${esc(h.ctaExplore)}</a>
    </div>
    <div class="c-console glass"${rtl ? ' data-rtl' : ''}>${consoleSVG()}</div>
  </div>
</section>

<section class="c-chain" aria-labelledby="c-chain-title" data-chain>
  <div class="c-chain-pin">
    <header class="c-chain-head">
      <h2 id="c-chain-title" class="c-h2">${esc(w.title)}</h2>
      <p>${esc(w.subtitle)}</p>
    </header>
    <div class="c-track">
      <svg class="c-rail" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true"${rtl ? ' style="transform:scaleX(-1)"' : ''}>
        <path class="c-rail-base" d="M40 150 H1160"/>
        <path class="c-rail-fill" d="M40 150 H1160" pathLength="1"/>
        <path class="c-loop-base" d="M1160 150 C 1160 30, 1100 20, 600 20 S 40 30, 40 150"/>
        <path class="c-loop-fill" d="M1160 150 C 1160 30, 1100 20, 600 20 S 40 30, 40 150" pathLength="1"/>
      </svg>
      <ol class="c-steps" aria-label="${esc(w.flowLabel)}">
        ${w.steps.map((s, i) => `<li class="c-step${i === w.steps.length - 1 ? ' c-step-hold' : ''}" data-i="${i}"><span class="c-step-n">${i + 1}</span><span class="c-step-who">${esc(s.who)}</span><span class="c-step-text">${esc(s.text)}</span></li>`).join('\n        ')}
      </ol>
    </div>
  </div>
</section>`;
  return {
    body,
    fonts: lang === 'ar' ? ['reem-kufi-arabic-wght-normal.woff2', 'ibm-plex-sans-arabic-arabic-400-normal.woff2'] : ['reem-kufi-latin-wght-normal.woff2', 'ibm-plex-sans-arabic-latin-400-normal.woff2'],
    scripts: ['/vendor/ScrollTrigger-3.15.1.min.js'],
    logo: 'light',
  };
}

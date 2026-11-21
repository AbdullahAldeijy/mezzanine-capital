// Direction A, "Signal Field": hero + ecosystem network. All copy from i18n.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { posterSVG } from './skyline.js';

const here = fileURLToPath(new URL('.', import.meta.url));
for (const rtl of [false, true]) writeFileSync(`${here}poster-${rtl ? 'rtl' : 'ltr'}.svg`, posterSVG({ rtl }));

// node positions in the network (percent of a square); mirrored in RTL so the reading order runs clockwise from the start
const POS = [[17, 19], [83, 19], [83, 81], [17, 81]];

export default function a(t, { lang, rtl, esc, siteUrl }) {
  const h = t.home, e = t.ecosystem;
  const pos = POS.map(([x, y]) => [rtl ? 100 - x : x, y]);
  const link = ([x, y]) => `M50 50 Q ${(50 + x) / 2 + (y < 50 ? 6 : -6) * (x < 50 ? 1 : -1)} ${(50 + y) / 2} ${x} ${y}`;
  const body = `
<section class="a-hero" aria-labelledby="a-title">
  <div class="a-field" style="--poster:url('/lab/a/poster-${rtl ? 'rtl' : 'ltr'}.svg')" aria-hidden="true"></div>
  <div class="a-hero-inner">
    <h1 id="a-title" class="a-title">${esc(h.title)}</h1>
    <p class="a-lede">${esc(h.message)}</p>
    <div class="a-cta">
      <a class="a-btn a-btn-primary" href="${siteUrl(lang, 'contact')}">${esc(h.ctaContact)}</a>
      <a class="a-btn a-btn-ghost" href="${siteUrl(lang, 'who-we-serve')}">${esc(h.ctaExplore)}</a>
    </div>
  </div>
</section>

<section class="a-eco" aria-labelledby="a-eco-title">
  <div class="a-eco-inner">
    <div class="a-eco-head">
      <h2 id="a-eco-title" class="a-h2">${esc(e.title)}</h2>
      <p>${esc(e.intro)}</p>
    </div>
    <div class="a-net" data-net>
      <svg class="a-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        ${pos.map((p, i) => `<path class="a-link" data-i="${i}" d="${link(p)}"/><path class="a-flow" data-i="${i}" d="${link(p)}"/>`).join('\n        ')}
      </svg>
      <div class="a-core" aria-hidden="true"><span>${esc(h.title)}</span></div>
      ${e.items.map((it, i) => `<button type="button" class="a-node" data-i="${i}" style="--x:${pos[i][0]}%;--y:${pos[i][1]}%" aria-controls="a-detail" aria-pressed="${i === 0}"><span class="a-node-dot"></span><span class="a-node-name">${esc(it.name)}</span></button>`).join('\n      ')}
    </div>
    <div class="a-detail" id="a-detail" aria-live="polite">
      ${e.items.map((it, i) => `<article class="a-item${i === 0 ? ' is-on' : ''}" data-i="${i}">
        <h3>${esc(it.name)}</h3>
        <p class="a-tag">${esc(it.tagline)}</p>
        <p>${esc(it.text)}</p>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;
  return {
    body,
    fonts: lang === 'ar' ? ['handjet-arabic-full-normal.woff2', 'readex-pro-arabic-wght-normal.woff2'] : ['handjet-latin-full-normal.woff2', 'readex-pro-latin-wght-normal.woff2'],
    logo: 'light',
  };
}

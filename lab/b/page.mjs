// Direction B, "Monolith": monumental type on mineral light, a dark slab with a rising data city, bento ecosystem.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { posterSVG } from './city.js';

const here = fileURLToPath(new URL('.', import.meta.url));
for (const rtl of [false, true]) writeFileSync(`${here}poster-${rtl ? 'rtl' : 'ltr'}.svg`, posterSVG({ rtl }));

// one line motif per activity (decorative, no data): circuit traces, strata, converging arcs, ripples
const MOTIF = {
  technology: '<path d="M0 30h46v-18h40v30h52v-22h62M0 62h28v16h70v-28h44v22h60M20 96h54v-12h50v20h86"/><circle cx="86" cy="12" r="3"/><circle cx="142" cy="50" r="3"/><circle cx="124" cy="84" r="3"/>',
  finance: '<path d="M0 98c40-6 80-6 120 0s80 6 120 0M0 78c40-6 80-6 120 0s80 6 120 0M0 58c40-6 80-6 120 0s80 6 120 0M0 38c40-6 80-6 120 0s80 6 120 0"/>',
  investment: '<path d="M0 110C70 110 150 80 220 14M0 80C80 80 150 60 220 14M0 50C90 50 160 40 220 14M40 120C110 100 170 70 220 14"/><circle cx="220" cy="14" r="4"/>',
  marketing: '<circle cx="190" cy="60" r="12"/><circle cx="190" cy="60" r="30"/><circle cx="190" cy="60" r="52"/><circle cx="190" cy="60" r="76"/><circle cx="190" cy="60" r="102"/>',
};

export default function b(t, { lang, rtl, esc, siteUrl }) {
  const h = t.home, e = t.ecosystem;
  const body = `
<section class="b-hero" aria-labelledby="b-title">
  <div class="b-grid-lines" aria-hidden="true"></div>
  <div class="b-hero-top">
    <h1 id="b-title" class="b-title">${esc(h.title)}</h1>
    <div class="b-hero-side">
      <p class="b-lede">${esc(h.message)}</p>
      <div class="b-cta">
        <a class="b-btn b-btn-primary" href="${siteUrl(lang, 'contact')}">${esc(h.ctaContact)}</a>
        <a class="b-btn b-btn-ghost" href="${siteUrl(lang, 'who-we-serve')}">${esc(h.ctaExplore)}</a>
      </div>
    </div>
  </div>
  <div class="b-slab" style="--poster:url('/lab/b/poster-${rtl ? 'rtl' : 'ltr'}.svg')" aria-hidden="true"><div class="b-city"></div></div>
</section>

<section class="b-eco" aria-labelledby="b-eco-title">
  <div class="b-eco-inner">
    <header class="b-eco-head">
      <h2 id="b-eco-title" class="b-h2">${esc(e.title)}</h2>
      <p>${esc(e.intro)}</p>
    </header>
    <div class="b-bento">
      ${e.items.map((it, i) => `<article class="b-tile b-tile-${i + 1}" data-tilt>
        <svg class="b-motif" viewBox="0 0 240 120" preserveAspectRatio="xMaxYMid meet" aria-hidden="true"${rtl ? ' style="transform:scaleX(-1)"' : ''}>${MOTIF[it.id]}</svg>
        <h3>${esc(it.name)}</h3>
        <p class="b-tag">${esc(it.tagline)}</p>
        <p class="b-text">${esc(it.text)}</p>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;
  return {
    body,
    fonts: lang === 'ar' ? ['alexandria-arabic-wght-normal.woff2'] : ['alexandria-latin-wght-normal.woff2'],
    logo: 'dark',
  };
}

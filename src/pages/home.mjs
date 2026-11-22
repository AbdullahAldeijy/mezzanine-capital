// Home: city hero, Challenge -> Solution signals, activities network, audiences, CTA band.
import { pageUrl } from '../shell.mjs';
import { words } from '../layout.mjs';
import { silhouettePath } from '../../js/city-data.js';
import { signals, network } from './parts.mjs';

export default function home(t, ctx) {
  const { esc, lang, rtl } = ctx;
  const h = t.home, a = t.about, e = t.ecosystem, s = t.serve;
  const dir = rtl ? 'rtl' : 'ltr';
  return `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-city" id="city" data-city aria-hidden="true"
       style="--poster-wide:url('/images/city-poster-wide-${dir}.webp');--poster-tall:url('/images/city-poster-tall-${dir}.webp')"></div>
  <div class="hero-inner">
    <h1 id="hero-title" class="hero-title">${words(esc, h.title)}</h1>
    <p class="hero-lede">${esc(h.message)}</p>
    <div class="hero-cta">
      <a href="${pageUrl(lang, 'contact')}" class="btn btn-primary" data-cta="hero" data-magnetic>${esc(h.ctaContact)}</a>
      <a href="${pageUrl(lang, 'who-we-serve')}" class="btn btn-glass" data-cta="hero">${esc(h.ctaExplore)}</a>
    </div>
  </div>
</section>

${signals(t, ctx)}

<section class="section eco" aria-labelledby="eco-title">
  <div class="wrap eco-grid">
    <header class="eco-head">
      <h2 id="eco-title" class="h2">${esc(e.title)}</h2>
      <p class="lede">${esc(e.intro)}</p>
    </header>
${network(t, ctx)}
  </div>
</section>

<section class="section aud" aria-labelledby="aud-title">
  <div class="wrap">
    <h2 id="aud-title" class="h2">${esc(s.title)}</h2>
    <ul class="aud-list">
      ${s.segments.map((seg) => `<li><a class="aud-row" href="${pageUrl(lang, 'who-we-serve')}#${seg.key}" data-cta="card">
        <span class="aud-name">${esc(seg.name)}</span>
        <span class="aud-text">${esc(seg.text)}</span>
      </a></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="band" aria-labelledby="band-title">
  <svg class="band-city" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true"><path d="${silhouettePath({ height: 200, mirror: rtl })}"/></svg>
  <div class="wrap band-inner">
    <h2 id="band-title" class="h2 band-title">${esc(t.contact.introLead)}</h2>
    <div class="hero-cta">
      <a href="${pageUrl(lang, 'contact')}" class="btn btn-primary" data-cta="final" data-magnetic>${esc(h.ctaContact)}</a>
      <a href="${pageUrl(lang, 'who-we-serve')}" class="btn btn-glass" data-cta="final">${esc(h.ctaExplore)}</a>
    </div>
  </div>
</section>`;
}

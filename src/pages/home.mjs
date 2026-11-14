import { pageUrl, icon, arrow } from '../ui.mjs';

export default function home(t, { esc, lang }) {
  const h = t.home, a = t.about, e = t.ecosystem, s = t.serve;
  const widths = [640, 1024, 1600];
  const set = (ext) => widths.map((w) => `/images/hero-${w}.${ext} ${w}w`).join(', ');
  const sizes = '(min-width: 1280px) 600px, (min-width: 1024px) 46vw, 100vw';
  return `
<section class="hero" aria-labelledby="hero-title">
  <canvas class="hero-bg" aria-hidden="true"></canvas>
  <div class="container">
    <div class="hero-grid">
      <div>
        <h1 id="hero-title" class="h1 hero-title reveal reveal-1">${esc(h.title)}</h1>
        <p class="lede reveal reveal-2">${esc(h.message)}</p>
        <div class="hero-cta reveal reveal-3">
          <a href="${pageUrl(lang, 'contact')}" class="btn btn-primary" data-cta="hero">${esc(h.ctaContact)}</a>
          <a href="${pageUrl(lang, 'who-we-serve')}" class="btn btn-ghost" data-cta="hero">${esc(h.ctaExplore)}</a>
        </div>
      </div>
      <div class="hero-img reveal reveal-4">
        <picture>
          <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
          <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
          <img src="/images/hero-1024.webp" width="1600" height="900" alt="${esc(t.site.imageAlt)}" fetchpriority="high" decoding="async">
        </picture>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-label="${esc(a.title)}">
  <div class="container">
    <div class="duo">
      <article class="card rv"><h2 class="h3">${esc(a.challengeTitle)}</h2><p>${esc(a.challenge)}</p></article>
      <article class="card card-accent rv" style="--d:.08s"><h2 class="h3">${esc(a.solutionTitle)}</h2><p>${esc(a.solution)}</p></article>
    </div>
    <p class="more rv"><a class="link-arrow" href="${pageUrl(lang, 'about')}">${esc(t.site.ui.learnMore)} ${arrow}</a></p>
  </div>
</section>

<section class="section section-navy on-dark" aria-labelledby="home-eco">
  <div class="container">
    <div class="section-head rv"><h2 id="home-eco" class="h2">${esc(e.title)}</h2></div>
    <div class="cards cards-4">
      ${e.items.map((it, i) => `<a class="card card-link rv" style="--d:${(i * 0.06).toFixed(2)}s" href="${pageUrl(lang, 'ecosystem')}#${it.id}" data-cta="card">
        ${icon(it.id)}
        <h3 class="h3">${esc(it.name)}</h3>
        <p>${esc(it.tagline)}</p>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section" aria-labelledby="home-serve">
  <div class="container">
    <div class="section-head rv"><h2 id="home-serve" class="h2">${esc(s.title)}</h2></div>
    <div class="cards cards-5">
      ${s.segments.map((seg, i) => `<a class="card card-link aud rv" style="--d:${(i * 0.05).toFixed(2)}s" href="${pageUrl(lang, 'who-we-serve')}#${seg.key}" data-cta="card">
        <h3 class="h3">${esc(seg.name)}</h3>
        <p>${esc(seg.text)}</p>
      </a>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section final-cta on-dark" aria-labelledby="home-final">
  <div class="container final-inner">
    <h2 id="home-final" class="h2 rv">${esc(t.contact.introLead)}</h2>
    <div class="hero-cta rv">
      <a href="${pageUrl(lang, 'contact')}" class="btn btn-light" data-cta="final">${esc(h.ctaContact)}</a>
      <a href="${pageUrl(lang, 'who-we-serve')}" class="btn btn-outline-light" data-cta="final">${esc(h.ctaExplore)}</a>
    </div>
  </div>
</section>`;
}

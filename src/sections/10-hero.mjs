const arrow = '<svg viewBox="0 0 18 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M1 6h15M11 1l5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export default function hero(t, { esc, lang }) {
  const h = t.hero;
  const widths = [640, 1024, 1600];
  const set = (ext) => widths.map((w) => `/images/hero-${w}.${ext} ${w}w`).join(', ');
  const sizes = '(min-width: 1280px) 600px, (min-width: 1024px) 46vw, 100vw';
  return `
<section id="platform" class="hero" aria-labelledby="hero-title">
  <div class="container">
    <div class="hero-grid">
      <div>
        <p class="eyebrow reveal reveal-1">${esc(h.eyebrow)}</p>
        <h1 id="hero-title" class="h1 reveal reveal-1">${esc(h.title)}</h1>
        <p class="lede reveal reveal-2">${esc(h.sub)}</p>
        <p class="hero-ar reveal reveal-2" lang="ar" dir="rtl">${esc(h.arLine)}</p>
        <div class="hero-cta reveal reveal-3">
          <a href="#contact" class="btn btn-primary">${esc(h.ctaPilot)}</a>
          <a href="#ecosystem" class="btn btn-ghost">${esc(h.ctaEcosystem)}</a>
        </div>
      </div>
      <div class="hero-img reveal reveal-4">
        <picture>
          <source type="image/avif" srcset="${set('avif')}" sizes="${sizes}">
          <source type="image/webp" srcset="${set('webp')}" sizes="${sizes}">
          <img src="/images/hero-1024.webp" width="1600" height="900" alt="${esc(t.site.meta.imageAlt)}" fetchpriority="high" decoding="async">
        </picture>
      </div>
    </div>
    <ol class="flow reveal reveal-4" aria-label="${esc(h.flowLabel)}">
      ${h.flow.map((s) => `<li>${esc(s)}${arrow}</li>`).join('\n      ')}
    </ol>
  </div>
</section>`;
}

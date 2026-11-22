// Redesigned shell ("Capital Flow"): glass nav, sticky CTA bar, footer with a city-line glow.
// Reuses the SEO <head>, cookie banner and URL helpers from shell.mjs. All copy comes from i18n/<lang>/site.mjs.
import { PAGES } from './pages.mjs';
import { head, pageUrl, socials, cookie, MAPS, PHONE_TEL } from './shell.mjs';
import { silhouettePath } from '../v2/city-data.js';

// Lab B typography: Alexandria only, one variable file per script
const FONT_PRELOAD = { en: ['alexandria-latin-wght-normal.woff2'], ar: ['alexandria-arabic-wght-normal.woff2'] };
const ICON_MENU = '<svg class="i-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg><svg class="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

// Headline split into WORD spans at build time (never letters: that would break Arabic joining).
// Words are visible from the first paint and only settle into place with a CSS animation, so nothing waits on JS or fonts.
export const words = (esc, text) => text.split(' ').map((w, i) => `<span class="word" style="--i:${i}">${esc(w)}</span>`).join(' ');

function nav(t, { lang, esc, page }) {
  const n = t.site.nav, items = PAGES.filter((p) => p.nav);
  const link = (p, cls) => `<a href="${pageUrl(lang, p.slug)}" class="${cls}${p.navButton ? ' is-cta' : ''}"${p.key === page.key ? ' aria-current="page"' : ''}${p.navButton ? ' data-cta="nav"' : ''}>${esc(n[p.nav])}</a>`;
  const other = pageUrl(lang === 'en' ? 'ar' : 'en', page.slug), to = lang === 'en' ? 'ar' : 'en';
  return `
<header class="nav" id="nav">
  <div class="nav-bar glass">
    <a href="${pageUrl(lang, '')}" class="nav-brand" aria-label="${esc(t.site.name)}"><img src="/images/logo-wordmark-light.webp" alt="${esc(t.site.name)}" width="540" height="71"></a>
    <nav aria-label="${esc(n.primary)}" class="nav-links">
      ${items.filter((p) => !p.navButton).map((p) => link(p, 'nav-link')).join('\n      ')}
    </nav>
    <div class="nav-end">
      <a href="${other}" class="nav-lang" hreflang="${to}" lang="${to}" data-lang-switch="${to}" aria-label="${esc(t.site.lang.switchLabel)}">${esc(t.site.lang[to])}</a>
      ${items.filter((p) => p.navButton).map((p) => link(p, 'nav-link')).join('')}
      <button type="button" id="menu-btn" class="nav-menu" aria-label="${esc(n.openMenu)}" data-open="${esc(n.openMenu)}" data-close="${esc(n.closeMenu)}" aria-expanded="false" aria-controls="sheet">${ICON_MENU}</button>
    </div>
  </div>
</header>
<div id="sheet" class="sheet" role="dialog" aria-modal="true" aria-label="${esc(n.menu)}">
  <nav aria-label="${esc(n.mobile)}">
    ${items.map((p, i) => link(p, 'sheet-link').replace('<a ', `<a style="--i:${i}" `)).join('\n    ')}
  </nav>
</div>`;
}

function ctaBar(t, { lang, esc }) {
  const c = t.site.cta;
  return `
<aside id="cta-bar" class="cta-bar" aria-label="${esc(c.label)}">
  <div class="cta-bar-inner glass">
    <p>${esc(c.text)}</p>
    <div class="cta-bar-btns">
      <a href="${pageUrl(lang, 'contact')}" class="btn btn-primary btn-sm" data-cta="sticky">${esc(c.contact)}</a>
      <!-- TODO(phase2): repoint to the partnership-opportunities page once it exists -->
      <a href="${pageUrl(lang, 'who-we-serve')}" class="btn btn-glass btn-sm" data-cta="sticky">${esc(c.explore)}</a>
    </div>
  </div>
</aside>`;
}

function footer(t, { lang, esc, rtl }) {
  const f = t.site.footer, c = t.site.contactInfo, n = t.site.nav;
  const links = [...PAGES.filter((p) => p.nav), PAGES.find((p) => p.key === 'privacy')];
  return `
<footer class="footer">
  <svg class="footer-city" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"><path d="${silhouettePath({ height: 120, mirror: rtl })}"/></svg>
  <div class="wrap footer-grid">
    <div>
      <img class="footer-logo" src="/images/logo-wordmark-light.webp" alt="${esc(t.site.name)}" width="540" height="71" loading="lazy">
      <p class="footer-tag">${esc(f.tagline)}</p>
    </div>
    <nav aria-label="${esc(f.quickLinks)}">
      <h2 class="footer-h">${esc(f.quickLinks)}</h2>
      <ul class="footer-links">
        ${links.map((p) => `<li><a href="${pageUrl(lang, p.slug)}"${p.key === 'contact' ? ' data-cta="footer"' : ''}>${esc(p.key === 'privacy' ? f.privacy : n[p.nav])}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    <div>
      <h2 class="footer-h">${esc(f.contact)}</h2>
      <ul class="footer-contact">
        <li><a href="${MAPS}" target="_blank" rel="noopener">${esc(c.address)}</a></li>
        <li><a href="mailto:${c.email}">${c.email}</a></li>
        <li><a href="tel:${PHONE_TEL}" dir="ltr">${c.phone}</a></li>
        ${socials(t).map((x) => `<li><a href="${x.url}" target="_blank" rel="noopener">${esc(x.label)}</a></li>`).join('\n        ')}
      </ul>
    </div>
  </div>
  <p class="wrap footer-rights">${esc(f.rights)}</p>
</footer>`;
}

export function layoutV2(t, ctx, body) {
  const { lang, rtl, esc, page } = ctx;
  const assets = `${FONT_PRELOAD[lang].map((f) => `<link rel="preload" as="font" type="font/woff2" href="/fonts/${f}" crossorigin>`).join('\n  ')}
  <link rel="stylesheet" href="/v2.css">
  <link rel="modulepreload" href="/v2/app.js">`;
  // `motion` = JS is on and the visitor has not asked for reduced motion
  const headJs = "(function(d){d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion')})(document.documentElement);";
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}">
${head(t, ctx, { assets, headJs, theme: '#060E1A' })}
<body class="v2${page.noCta ? '' : ' has-cta'}" data-page="${page.key}">
<a href="#main" class="skip">${esc(t.site.skip)}</a>
${nav(t, ctx)}
<main id="main">
${body}
</main>
${footer(t, ctx)}
${page.noCta ? '' : ctaBar(t, ctx)}
${cookie(t, ctx)}
<button type="button" id="to-top" class="to-top" aria-label="${esc(t.site.nav.backToTop)}"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 15V3M3.5 8.5L9 3l5.5 5.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
<script src="/analytics.js" defer></script>
<script type="module" src="/v2/app.js"></script>
</body>
</html>
`;
}

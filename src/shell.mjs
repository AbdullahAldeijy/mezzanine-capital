// Page shell: <head> (SEO, social, JSON-LD), nav, sticky CTA bar, footer, cookie banner.
// All copy comes from i18n/<lang>/site.mjs (+ each page's own meta).
import { PAGES } from './pages.mjs';
import { SOCIAL, GA4_ID } from '../config/site.mjs';

export const SITE = 'https://mezzanine.sa';
// configured social profiles (config/site.mjs); entries without a URL are skipped
export const socials = (t) => Object.entries(SOCIAL).filter(([, url]) => url).map(([key, url]) => ({ key, url, label: t.site.social[key] }));
export const MAPS = 'https://www.google.com/maps/search/?api=1&query=King+Abdullah+Financial+District+Riyadh';
const PHONE_TEL = '+966544043103';

// Self-hosted, pinned motion libraries (see vendor/README.md). Lenis is loaded on demand by js/50-motion.js.
const VENDOR = { gsap: '/vendor/gsap-3.15.1.min.js', ScrollTrigger: '/vendor/ScrollTrigger-3.15.1.min.js', SplitText: '/vendor/SplitText-3.15.1.min.js' };

export const pageUrl = (lang, slug) => `/${lang === 'ar' ? 'ar/' : ''}${slug ? slug + '/' : ''}`;

const FONTS = {
  en: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap',
  ar: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap',
};
const ICON_OPEN = '<svg class="i-open" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/></svg>';
const ICON_CLOSE = '<svg class="i-close" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg>';
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%2316233F'/%3E%3Cpath d='M16 7l9 18H7z' fill='none' stroke='%23F6F1E3' stroke-width='2.4' stroke-linejoin='round'/%3E%3Cpath d='M12.5 21.5h7L16 14.5z' fill='%234FA8AC'/%3E%3C/svg%3E";

function head(t, { lang, rtl, esc, page, path }) {
  const m = t[page.key].meta;
  const title = page.key === 'home' ? `${m.title} | ${t.site.name}` : `${m.title} | ${t.site.name}`;
  const canonical = SITE + path;
  const image = `${SITE}/images/og-hero.jpg`;
  const alt = t.site.imageAlt;
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t.site.name, // TODO(name-approval): official name not yet approved
    url: `${SITE}/`,
    logo: `${SITE}/images/logo-wordmark.webp`,
    email: 'info@mezzanine.sa',
    telephone: '+966 54 404 3103',
    address: { '@type': 'PostalAddress', streetAddress: 'KAFD 4.07', addressLocality: 'Riyadh', addressCountry: 'SA' },
    sameAs: Object.values(SOCIAL).filter(Boolean),
  };
  const social = page.noindex ? '' : `
  <link rel="alternate" hreflang="en" href="${SITE}${pageUrl('en', page.slug)}">
  <link rel="alternate" hreflang="ar" href="${SITE}${pageUrl('ar', page.slug)}">
  <link rel="alternate" hreflang="x-default" href="${SITE}${pageUrl('en', page.slug)}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(t.site.name)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(m.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="${t.site.locale}">
  <meta property="og:locale:alternate" content="${t.site.otherLocale}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(alt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(m.description)}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${esc(alt)}">`;
  const redirect = lang === 'en' && page.key === 'home' ? "if(/[?&]lang=ar(&|$)/.test(location.search))location.replace('/ar/'+location.hash);" : '';
  return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(m.description)}">
  <meta name="theme-color" content="#F6F1E3">
  ${page.noindex ? '<meta name="robots" content="noindex">' : ''}
  <link rel="canonical" href="${canonical}">${social}
  <link rel="icon" href="${FAVICON}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="${FONTS[lang]}">
  <link rel="stylesheet" href="/styles.css">
  ${GA4_ID ? `<meta name="mz-ga4" content="${esc(GA4_ID)}">` : ''}
  <script>(function(d){d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion')})(document.documentElement);${redirect}</script>
  ${page.key === 'home' ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>`;
}

function nav(t, { lang, esc, page }) {
  const n = t.site.nav;
  const items = PAGES.filter((p) => p.nav);
  const link = (p, cls) => {
    const cur = p.key === page.key ? ' aria-current="page"' : '';
    return `<a href="${pageUrl(lang, p.slug)}" class="${cls}${p.navButton ? ' nav-cta' : ''}"${cur}>${esc(n[p.nav])}</a>`;
  };
  const other = pageUrl(lang === 'en' ? 'ar' : 'en', page.slug);
  const toggle = lang === 'en'
    ? `<span class="is-active tap-44" aria-current="true" lang="en">${esc(t.site.lang.en)}</span><span aria-hidden="true">/</span><a href="${other}" hreflang="ar" lang="ar" class="tap-44" data-lang-switch="ar" aria-label="${esc(t.site.lang.switchLabel)}">${esc(t.site.lang.ar)}</a>`
    : `<a href="${other}" hreflang="en" lang="en" class="tap-44" data-lang-switch="en" aria-label="${esc(t.site.lang.switchLabel)}">${esc(t.site.lang.en)}</a><span aria-hidden="true">/</span><span class="is-active tap-44" aria-current="true" lang="ar">${esc(t.site.lang.ar)}</span>`;
  return `
<header class="site-nav">
  <div class="container bar">
    <a href="${pageUrl(lang, '')}" class="brand" aria-label="${esc(t.site.name)}"><img src="/images/logo-wordmark.webp" alt="${esc(t.site.name)}" width="540" height="71"></a>
    <nav aria-label="${esc(n.primary)}" class="nav-links">
      ${items.map((p) => link(p, 'nav-link')).join('\n      ')}
    </nav>
    <div class="nav-end">
      <div class="lang-toggle">${toggle}</div>
      <button type="button" id="menu-btn" class="menu-btn tap-44" aria-label="${esc(n.openMenu)}" data-open="${esc(n.openMenu)}" data-close="${esc(n.closeMenu)}" aria-expanded="false" aria-controls="mobile-panel">${ICON_OPEN}${ICON_CLOSE}</button>
    </div>
  </div>
</header>
<div id="mobile-overlay" class="mobile-overlay"></div>
<div id="mobile-panel" class="mobile-panel" role="dialog" aria-modal="true" aria-label="${esc(n.menu)}">
  <nav aria-label="${esc(n.mobile)}">
    ${items.map((p) => link(p, 'panel-link')).join('\n    ')}
  </nav>
</div>`;
}

function ctaBar(t, { lang, esc }) {
  const c = t.site.cta;
  return `
<aside id="cta-bar" class="cta-bar on-dark" aria-label="${esc(c.label)}">
  <div class="container cta-inner">
    <p class="cta-text">${esc(c.text)}</p>
    <div class="cta-btns">
      <a href="${pageUrl(lang, 'contact')}" class="btn btn-sm btn-light" data-cta="sticky">${esc(c.contact)}</a>
      <!-- TODO(phase2): repoint to the partnership-opportunities page once it exists -->
      <a href="${pageUrl(lang, 'who-we-serve')}" class="btn btn-sm btn-outline-light" data-cta="sticky">${esc(c.explore)}</a>
    </div>
  </div>
</aside>`;
}

function footer(t, { lang, esc }) {
  const f = t.site.footer, c = t.site.contactInfo, n = t.site.nav;
  const links = [...PAGES.filter((p) => p.nav), PAGES.find((p) => p.key === 'privacy')];
  return `
<footer class="site-footer on-dark">
  <div class="container">
    <svg class="skyline-rule" viewBox="0 0 800 40" preserveAspectRatio="none" fill="none" stroke="var(--teal)" stroke-width="1" aria-hidden="true">
      <path d="M0 38 L40 38 L40 20 L55 20 L55 10 L70 10 L70 38 L110 38 L110 25 L125 25 L125 5 L140 5 L140 25 L155 25 L155 38 L210 38 L210 15 L230 15 L230 38 L280 38 L280 28 L300 28 L300 12 L320 12 L320 28 L340 28 L340 38 L400 38 L400 8 L415 8 L415 22 L430 22 L430 38 L480 38 L480 18 L500 18 L500 38 L560 38 L560 25 L580 25 L580 2 L600 2 L600 25 L620 25 L620 38 L680 38 L680 15 L700 15 L700 30 L720 30 L720 38 L800 38"/>
    </svg>
    <div class="footer-grid">
      <div>
        <p class="h3 footer-brand">${esc(t.site.name)}</p>
        <p class="footer-muted">${esc(f.tagline)}</p>
      </div>
      <nav aria-label="${esc(f.quickLinks)}">
        <h2 class="footer-h">${esc(f.quickLinks)}</h2>
        <ul class="footer-links">
          ${links.map((p) => `<li><a href="${pageUrl(lang, p.slug)}"${p.key === 'contact' ? ' data-cta="footer"' : ''}>${esc(p.key === 'privacy' ? f.privacy : n[p.nav])}</a></li>`).join('\n          ')}
        </ul>
      </nav>
      <div>
        <h2 class="footer-h">${esc(f.contact)}</h2>
        <a href="${MAPS}" target="_blank" rel="noopener" class="footer-muted footer-line">${esc(c.address)}</a>
        <a href="mailto:${c.email}" class="footer-accent footer-line">${c.email}</a>
        <a href="tel:${PHONE_TEL}" class="footer-accent footer-line" dir="ltr">${c.phone}</a>
        ${socials(t).map((x) => `<a href="${x.url}" target="_blank" rel="noopener" class="footer-accent footer-line">${esc(x.label)}</a>`).join('\n        ')}
      </div>
    </div>
    <p class="footer-rights">${esc(f.rights)}</p>
  </div>
</footer>`;
}

function cookie(t, { lang, esc }) {
  if (!GA4_ID) return '';   // no analytics configured -> no consent banner
  const k = t.site.cookie;
  return `
<div id="cookie" class="cookie" role="dialog" aria-label="${esc(k.label)}" hidden>
  <p>${esc(k.text)} <a href="${pageUrl(lang, 'privacy')}">${esc(k.link)}</a></p>
  <div class="cookie-btns">
    <button type="button" class="btn btn-sm btn-primary" data-consent="granted">${esc(k.accept)}</button>
    <button type="button" class="btn btn-sm btn-ghost" data-consent="denied">${esc(k.decline)}</button>
  </div>
</div>`;
}

export function layout(t, ctx, body) {
  const { lang, rtl, esc, page } = ctx;
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}">
${head(t, ctx)}
<body class="${page.noCta ? '' : 'has-cta'}">
<a href="#main" class="skip-link">${esc(t.site.skip)}</a>
${nav(t, ctx)}
<main id="main">
${body}
</main>
${footer(t, ctx)}
${page.noCta ? '' : ctaBar(t, ctx)}
${cookie(t, ctx)}
<button type="button" id="to-top" class="to-top" aria-label="${esc(t.site.nav.backToTop)}"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 15V3M3.5 8.5L9 3l5.5 5.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
${[VENDOR.gsap, ...(page.motion || []).map((m) => VENDOR[m])].map((src) => `<script src="${src}" defer></script>`).join('\n')}
<script src="/analytics.js" defer></script>
<script src="/app.js" defer></script>
</body>
</html>
`;
}

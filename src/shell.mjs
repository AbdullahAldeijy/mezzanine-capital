// Page shell: <head> (SEO, social, JSON-LD), nav, footer. All copy comes from i18n/<lang>/site.mjs.
export const SITE = 'https://mezzanine.sa';
const LINKEDIN = 'https://www.linkedin.com/company/mezzanineai';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=King+Abdullah+Financial+District+Riyadh';
const PHONE_TEL = '+966544043103';

// nav order; `id` is the anchor, `k` the key in site.nav
export const NAV = [
  { id: 'platform', k: 'platform' },
  { id: 'opportunity', k: 'opportunity' },
  { id: 'how-it-works', k: 'how' },
  { id: 'ecosystem', k: 'ecosystem' },
  { id: 'impact', k: 'impact' },
  { id: 'roadmap', k: 'roadmap' },
  { id: 'contact', k: 'contact' },
];
const FOOTER_LINKS = [...NAV.slice(0, 6), { id: 'about', k: 'about' }, NAV[6]];

const FONTS = {
  en: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap',
  ar: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap',
};

const ICON_OPEN = '<svg class="i-open" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/></svg>';
const ICON_CLOSE = '<svg class="i-close" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg>';
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%2316233F'/%3E%3Cpath d='M16 7l9 18H7z' fill='none' stroke='%23F6F1E3' stroke-width='2.4' stroke-linejoin='round'/%3E%3Cpath d='M12.5 21.5h7L16 14.5z' fill='%234FA8AC'/%3E%3C/svg%3E";

function head(t, { lang, rtl, esc, path }, { title, description, canonical, index = true, ld = true }) {
  const m = t.site.meta;
  const image = `${SITE}/images/og-hero.jpg`;
  const jsonld = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Mezzanine AI',
    url: `${SITE}/`,
    logo: `${SITE}/images/logo-wordmark.webp`,
    description: t.site.meta.description,
    email: 'info@mezzanine.sa',
    telephone: '+966 54 404 3103',
    address: { '@type': 'PostalAddress', streetAddress: 'KAFD 4.07', addressLocality: 'Riyadh', addressCountry: 'SA' },
    sameAs: [LINKEDIN],
  };
  return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta name="theme-color" content="#F6F1E3">
  ${index ? '' : '<meta name="robots" content="noindex">'}
  <link rel="canonical" href="${canonical}">
  ${index ? `<link rel="alternate" hreflang="en" href="${SITE}/">
  <link rel="alternate" hreflang="ar" href="${SITE}/ar/">
  <link rel="alternate" hreflang="x-default" href="${SITE}/">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Mezzanine AI">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:locale" content="${m.locale}">
  <meta property="og:locale:alternate" content="${m.otherLocale}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(m.imageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${image}">
  <meta name="twitter:image:alt" content="${esc(m.imageAlt)}">` : ''}
  <link rel="icon" href="${FAVICON}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="${FONTS[lang]}">
  <link rel="stylesheet" href="/styles.css">
  <script>document.documentElement.classList.add('js');${lang === 'en' && index ? "if(/[?&]lang=ar(&|$)/.test(location.search))location.replace('/ar/'+location.hash);" : ''}</script>
  ${ld ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>`;
}

function nav(t, { lang, esc }) {
  const n = t.site.nav;
  const links = (cls) => NAV.map(({ id, k }) => `<a href="#${id}" class="${cls}" data-spy="${id}">${esc(n[k])}</a>`).join('\n          ');
  const other = lang === 'en'
    ? `<span class="is-active tap-44" aria-current="true" lang="en">${esc(t.site.lang.en)}</span><span aria-hidden="true">/</span><a href="/ar/" hreflang="ar" lang="ar" class="tap-44" aria-label="${esc(t.site.lang.switchToAr)}">${esc(t.site.lang.ar)}</a>`
    : `<a href="/" hreflang="en" lang="en" class="tap-44" aria-label="${esc(t.site.lang.switchToAr)}">${esc(t.site.lang.en)}</a><span aria-hidden="true">/</span><span class="is-active tap-44" aria-current="true" lang="ar">${esc(t.site.lang.ar)}</span>`;
  return `
<header class="site-nav">
  <div class="container bar">
    <a href="#platform" class="brand" aria-label="${esc(t.site.brand)}"><img src="/images/logo-wordmark.webp" alt="${esc(t.site.brand)}" width="540" height="71"></a>
    <nav aria-label="${esc(n.primary)}" class="nav-links">
      ${links('nav-link')}
    </nav>
    <div class="nav-end">
      <div class="lang-toggle">${other}</div>
      <button type="button" id="menu-btn" class="menu-btn tap-44" aria-label="${esc(n.openMenu)}" data-open="${esc(n.openMenu)}" data-close="${esc(n.closeMenu)}" aria-expanded="false" aria-controls="mobile-panel">${ICON_OPEN}${ICON_CLOSE}</button>
    </div>
  </div>
</header>
<div id="mobile-overlay" class="mobile-overlay"></div>
<div id="mobile-panel" class="mobile-panel" role="dialog" aria-modal="true" aria-label="${esc(n.menu)}">
  <nav aria-label="${esc(n.mobile)}">
    ${links('panel-link')}
  </nav>
</div>`;
}

function footer(t, { esc }) {
  const f = t.site.footer, c = t.site.contactInfo, n = t.site.nav;
  return `
<footer class="site-footer on-dark">
  <div class="container">
    <svg class="skyline-rule" viewBox="0 0 800 40" preserveAspectRatio="none" fill="none" stroke="var(--teal)" stroke-width="1" aria-hidden="true">
      <path d="M0 38 L40 38 L40 20 L55 20 L55 10 L70 10 L70 38 L110 38 L110 25 L125 25 L125 5 L140 5 L140 25 L155 25 L155 38 L210 38 L210 15 L230 15 L230 38 L280 38 L280 28 L300 28 L300 12 L320 12 L320 28 L340 28 L340 38 L400 38 L400 8 L415 8 L415 22 L430 22 L430 38 L480 38 L480 18 L500 18 L500 38 L560 38 L560 25 L580 25 L580 2 L600 2 L600 25 L620 25 L620 38 L680 38 L680 15 L700 15 L700 30 L720 30 L720 38 L800 38"/>
    </svg>
    <div class="footer-grid">
      <div>
        <p class="h3 footer-brand">${esc(t.site.brand)}</p>
        <p class="footer-muted">${esc(f.tagline)}</p>
      </div>
      <nav aria-label="${esc(f.quickLinks)}">
        <h2 class="footer-h">${esc(f.quickLinks)}</h2>
        <ul class="footer-links">
          ${FOOTER_LINKS.map(({ id, k }) => `<li><a href="#${id}">${esc(n[k])}</a></li>`).join('\n          ')}
        </ul>
      </nav>
      <div>
        <h2 class="footer-h">${esc(f.contact)}</h2>
        <a href="${MAPS}" target="_blank" rel="noopener" class="footer-muted footer-line">${esc(c.address)}</a>
        <a href="mailto:${c.email}" class="footer-accent footer-line">${c.email}</a>
        <a href="tel:${PHONE_TEL}" class="footer-accent footer-line" dir="ltr">${c.phone}</a>
        <a href="${LINKEDIN}" target="_blank" rel="noopener" class="footer-accent footer-line">${esc(c.linkedin)}</a>
      </div>
    </div>
    <p class="footer-rights">${esc(f.rights)}</p>
  </div>
</footer>
<button type="button" id="to-top" class="to-top" aria-label="${esc(n.backToTop)}"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 15V3M3.5 8.5L9 3l5.5 5.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
}

export function layout(t, ctx, body) {
  const { lang, rtl, esc, path } = ctx;
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}">
${head(t, ctx, { title: t.site.meta.title, description: t.site.meta.description, canonical: SITE + path })}
<body>
<a href="#main" class="skip-link">${esc(t.site.skip)}</a>
${nav(t, ctx)}
<main id="main">
${body}
</main>
${footer(t, ctx)}
<script src="/app.js" defer></script>
</body>
</html>
`;
}

export function thankYou(t, ctx) {
  const { lang, rtl, esc, path } = ctx;
  const th = t.site.thanks;
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${rtl ? 'rtl' : 'ltr'}">
${head(t, ctx, { title: th.title, description: th.body, canonical: SITE + path + 'thank-you/', index: false, ld: false })}
<body>
<main class="thanks container">
  <h1 class="h2">${esc(th.heading)}</h1>
  <p class="lede">${esc(th.body)}</p>
  <a href="${path}" class="btn btn-primary">${esc(th.back)}</a>
</main>
</body>
</html>
`;
}

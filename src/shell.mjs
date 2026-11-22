// Shared head (SEO, social, hreflang, JSON-LD), cookie banner and URL helpers. Layout chrome is in src/layout.mjs.
// All copy comes from i18n/<lang>/site.mjs (+ each page's own meta).
import { SOCIAL, GA4_ID } from '../config/site.mjs';

export const SITE = 'https://mezzanine.sa';
// configured social profiles (config/site.mjs); entries without a URL are skipped
export const socials = (t) => Object.entries(SOCIAL).filter(([, url]) => url).map(([key, url]) => ({ key, url, label: t.site.social[key] }));
export const MAPS = 'https://www.google.com/maps/search/?api=1&query=King+Abdullah+Financial+District+Riyadh';
export const PHONE_TEL = '+966544043103';

export const pageUrl = (lang, slug) => `/${lang === 'ar' ? 'ar/' : ''}${slug ? slug + '/' : ''}`;

const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23060E1A'/%3E%3Cpath d='M16 7l9 18H7z' fill='none' stroke='%23E8FBFF' stroke-width='2.4' stroke-linejoin='round'/%3E%3Cpath d='M12.5 21.5h7L16 14.5z' fill='%2312E0CF'/%3E%3C/svg%3E";

// `opts`: { assets (fonts/styles/preloads), theme (theme-color), headJs (inline boot script) } from src/layout.mjs
export function head(t, { lang, rtl, esc, page, path }, opts) {
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
  <meta name="theme-color" content="${opts.theme}">
  ${page.noindex ? '<meta name="robots" content="noindex">' : ''}
  <link rel="canonical" href="${canonical}">${social}
  <link rel="icon" href="${FAVICON}">
  ${opts.assets}
  ${GA4_ID ? `<meta name="mz-ga4" content="${esc(GA4_ID)}">` : ''}
  <script>${opts.headJs}${redirect}</script>
  ${page.key === 'home' ? `<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : ''}
</head>`;
}

export function cookie(t, { lang, esc }) {
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


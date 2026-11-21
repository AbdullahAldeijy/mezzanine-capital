// Design-lab prototypes (temporary): /lab/{a,b,c}/ (EN) and /lab/{a,b,c}/ar/ (AR).
// noindex, not linked from the site, not in the sitemap. Copy comes from i18n/ — nothing new is written here.
// Run: node scripts/build-lab.mjs   (delete lab/ and this script once a direction is chosen)
import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
async function loadLang(lang) {
  const t = {};
  for (const f of readdirSync(join(root, 'i18n', lang)).filter((f) => f.endsWith('.mjs'))) {
    t[f.replace(/\.mjs$/, '')] = (await import(pathToFileURL(join(root, 'i18n', lang, f)))).default;
  }
  return t;
}
const t = { en: await loadLang('en'), ar: await loadLang('ar') };

const DIRECTIONS = {
  a: { name: 'Signal Field', theme: '#050B14' },
  b: { name: 'Monolith', theme: '#E4EBEE' },
  c: { name: 'Capital Flow', theme: '#060E1A' },
};
const NAV = [['home', ''], ['about', 'about'], ['ecosystem', 'ecosystem'], ['how', 'how-we-work'], ['serve', 'who-we-serve'], ['solutions', 'solutions']];
const siteUrl = (lang, slug) => `/${lang === 'ar' ? 'ar/' : ''}${slug ? slug + '/' : ''}`;

function nav(tt, lang, d, logo) {
  const n = tt.site.nav;
  const other = lang === 'en' ? `/lab/${d}/ar/` : `/lab/${d}/`;
  return `<header class="lab-nav">
  <a class="lab-brand" href="${siteUrl(lang, '')}" aria-label="${esc(tt.site.name)}"><img src="/images/${logo === 'dark' ? 'logo-wordmark' : 'logo-wordmark-light'}.webp" alt="${esc(tt.site.name)}" width="540" height="71"></a>
  <nav aria-label="${esc(n.primary)}" class="lab-links">${NAV.map(([k, s]) => `<a href="${siteUrl(lang, s)}"${k === 'home' ? ' aria-current="page"' : ''}>${esc(n[k])}</a>`).join('')}</nav>
  <div class="lab-end">
    <a class="lab-lang" href="${other}" hreflang="${lang === 'en' ? 'ar' : 'en'}" lang="${lang === 'en' ? 'ar' : 'en'}" aria-label="${esc(tt.site.lang.switchLabel)}">${lang === 'en' ? esc(tt.site.lang.ar) : esc(tt.site.lang.en)}</a>
    <a class="lab-contact" href="${siteUrl(lang, 'contact')}">${esc(n.contact)}</a>
  </div>
</header>`;
}

// tiny prototype switcher (internal lab chrome, English only, not site copy)
function switcher(d, lang) {
  return `<nav class="lab-switch" aria-label="Design directions">${Object.entries(DIRECTIONS).map(([k, v]) =>
    `<a href="/lab/${k}/${lang === 'ar' ? 'ar/' : ''}"${k === d ? ' aria-current="page"' : ''}><b>${k.toUpperCase()}</b> ${v.name}</a>`).join('')}</nav>`;
}

function page(d, lang, body, { fonts = [], scripts = [], logo = 'light' }) {
  const tt = t[lang];
  return `<!DOCTYPE html>
<html lang="${lang}" dir="${lang === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Lab ${d.toUpperCase()}: ${DIRECTIONS[d].name} | ${esc(tt.site.name)}</title>
  <meta name="description" content="${esc(tt.home.meta.description)}">
  <meta name="robots" content="noindex, nofollow">
  <meta name="theme-color" content="${DIRECTIONS[d].theme}">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23050B14'/%3E%3Cpath d='M16 7l9 18H7z' fill='none' stroke='%23EAF2F5' stroke-width='2.4' stroke-linejoin='round'/%3E%3Cpath d='M12.5 21.5h7L16 14.5z' fill='%235CE6E0'/%3E%3C/svg%3E">
  ${fonts.map((f) => `<link rel="preload" as="font" type="font/woff2" href="/fonts/${f}" crossorigin>`).join('\n  ')}
  <link rel="stylesheet" href="/lab/${d}/style.css">
  <script>(function(d){d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('motion')})(document.documentElement)</script>
  ${['/vendor/gsap-3.15.1.min.js', '/vendor/SplitText-3.15.1.min.js', ...scripts].map((s) => `<script src="${s}" defer></script>`).join('\n  ')}
  <script type="module" src="/lab/${d}/main.js"></script>
</head>
<body>
${nav(tt, lang, d, logo)}
<main id="main">
${body}
</main>
${switcher(d, lang)}
</body>
</html>
`;
}

for (const d of Object.keys(DIRECTIONS).filter((k) => existsSync(join(root, 'lab', k, 'page.mjs')))) {
  const mod = (await import(pathToFileURL(join(root, 'lab', d, 'page.mjs')))).default;
  for (const lang of ['en', 'ar']) {
    const out = join(root, 'lab', d, lang === 'ar' ? 'ar' : '', 'index.html');
    mkdirSync(join(out, '..'), { recursive: true });
    const { body, ...opts } = mod(t[lang], { lang, rtl: lang === 'ar', esc, siteUrl });
    writeFileSync(out, page(d, lang, body, opts));
  }
}
console.log('lab built:', Object.keys(DIRECTIONS).map((d) => `/lab/${d}/`).join(' '));

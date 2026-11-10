// Static page generator. No dependencies; run with `node scripts/build.mjs`.
// Reads i18n/{en,ar}/*.mjs + src/pages/*.mjs, writes every page for / (EN) and /ar/ (AR),
// styles.css, app.js and sitemap.xml. Output is committed — Netlify just serves it.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { layout, pageUrl, SITE } from '../src/shell.mjs';
import { PAGES } from '../src/pages.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const key = (f) => f.replace(/^\d+-/, '').replace(/\.\w+$/, '');
const list = (dir, ext) => readdirSync(join(root, dir)).filter((f) => f.endsWith(ext)).sort();
const imp = (p) => import(pathToFileURL(join(root, p)));

async function loadLang(lang) {
  const t = {};
  for (const f of list(`i18n/${lang}`, '.mjs')) t[key(f)] = (await imp(`i18n/${lang}/${f}`)).default;
  return t;
}

// Fail the build if EN and AR copy ever drift apart.
const flat = (o, p = '') => Object.entries(o).flatMap(([k, v]) => (v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [`${p}${k}`]));
function checkParity(en, ar) {
  const a = new Set(flat(en)), b = new Set(flat(ar));
  const problems = [...a].filter((k) => !b.has(k)).map((k) => `ar missing ${k}`)
    .concat([...b].filter((k) => !a.has(k)).map((k) => `en missing ${k}`));
  if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
  console.log(`i18n parity OK (${a.size} keys)`);
}

const en = await loadLang('en');
const ar = await loadLang('ar');
checkParity(en, ar);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function write(path, data) {
  mkdirSync(join(root, path, '..'), { recursive: true });
  writeFileSync(join(root, path), data);
}

for (const page of PAGES) {
  const render = (await imp(`src/pages/${page.key}.mjs`)).default;
  for (const [lang, t] of [['en', en], ['ar', ar]]) {
    const ctx = { lang, rtl: lang === 'ar', esc, page, path: pageUrl(lang, page.slug) };
    write(ctx.path.slice(1) + 'index.html', layout(t, ctx, render(t, ctx)));
  }
}

// Concatenate CSS and JS (single request each)
write('styles.css', list('styles', '.css').map((f) => readFileSync(join(root, 'styles', f), 'utf8')).join('\n'));
write('app.js', '(function () {\n"use strict";\n' + list('js', '.js').map((f) => readFileSync(join(root, 'js', f), 'utf8')).join('\n') + '\n})();\n');

// sitemap (thank-you is noindex, so excluded)
const today = new Date().toISOString().slice(0, 10);
const urls = PAGES.filter((p) => !p.noindex).flatMap((p) => ['en', 'ar'].map((lang) => `  <url>
    <loc>${SITE}${pageUrl(lang, p.slug)}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${pageUrl('en', p.slug)}"/>
    <xhtml:link rel="alternate" hreflang="ar" href="${SITE}${pageUrl('ar', p.slug)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${pageUrl('en', p.slug)}"/>
  </url>`));
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
console.log('built', PAGES.map((p) => p.key).join(', '));

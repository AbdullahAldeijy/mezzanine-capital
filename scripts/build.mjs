// Static page generator. No dependencies; run with `node scripts/build.mjs`.
// Reads i18n/{en,ar}/*.mjs + src/sections/*.mjs, writes index.html, ar/index.html,
// thank-you pages, styles.css and app.js. Output is committed — Netlify just serves it.
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { layout, thankYou } from '../src/shell.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const key = (f) => f.replace(/^\d+-/, '').replace(/\.mjs$/, '');
const list = (dir, ext) => readdirSync(join(root, dir)).filter((f) => f.endsWith(ext)).sort();

async function loadLang(lang) {
  const t = {};
  for (const f of list(`i18n/${lang}`, '.mjs')) {
    t[key(f)] = (await import(pathToFileURL(join(root, 'i18n', lang, f)))).default;
  }
  return t;
}

// Fail the build if EN and AR copy ever drift apart.
function flat(o, p = '') {
  return Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flat(v, `${p}${k}.`) : [`${p}${k}`]);
}
function checkParity(en, ar) {
  const a = new Set(flat(en)), b = new Set(flat(ar));
  const missing = [...a].filter((k) => !b.has(k)).map((k) => `ar missing ${k}`)
    .concat([...b].filter((k) => !a.has(k)).map((k) => `en missing ${k}`));
  if (missing.length) { console.error(missing.join('\n')); process.exit(1); }
}

const sections = [];
for (const f of list('src/sections', '.mjs')) {
  sections.push([key(f), (await import(pathToFileURL(join(root, 'src/sections', f)))).default]);
}

const en = await loadLang('en');
const ar = await loadLang('ar');
checkParity(en, ar);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function write(path, data) {
  mkdirSync(join(root, path, '..'), { recursive: true });
  writeFileSync(join(root, path), data);
}

for (const [lang, t, out, tyOut] of [['en', en, 'index.html', 'thank-you/index.html'], ['ar', ar, 'ar/index.html', 'ar/thank-you/index.html']]) {
  const ctx = { lang, rtl: lang === 'ar', esc, path: lang === 'ar' ? '/ar/' : '/' };
  const body = sections.map(([k, render]) => render(t, ctx)).join('\n');
  write(out, layout(t, ctx, body));
  write(tyOut, thankYou(t, ctx));
}

// Concatenate CSS and JS (single request each)
write('styles.css', list('styles', '.css').map((f) => readFileSync(join(root, 'styles', f), 'utf8')).join('\n'));
write('app.js', '(function () {\n"use strict";\n' +
  list('js', '.js').map((f) => readFileSync(join(root, 'js', f), 'utf8')).join('\n') + '\n})();\n');
console.log('built', sections.map(([k]) => k).join(', '));

// Page registry (Phase 1). Phase 2 pages (partnerships, roadmap, team, insights) are intentionally NOT here.
// key  -> src/pages/<key>.mjs and i18n/<lang>/<key>.mjs
// slug -> URL (EN at /<slug>/, AR at /ar/<slug>/)
// nav  -> key in site.nav (omit to keep out of the main nav)
// v2   -> page already uses the redesigned ("Capital Flow") templates in src/pages-v2 + src/shell-v2.mjs
export const PAGES = [
  { key: 'home', slug: '', nav: 'home', v2: true },
  { key: 'about', slug: 'about', nav: 'about', v2: true },
  { key: 'ecosystem', slug: 'ecosystem', nav: 'ecosystem', v2: true },
  { key: 'how', slug: 'how-we-work', nav: 'how', v2: true },
  { key: 'serve', slug: 'who-we-serve', nav: 'serve', v2: true },
  { key: 'solutions', slug: 'solutions', nav: 'solutions', v2: true },
  { key: 'contact', slug: 'contact', nav: 'contact', noCta: true, navButton: true, v2: true },
  { key: 'privacy', slug: 'privacy', v2: true },
];


// Page registry (Phase 1). Phase 2 pages (partnerships, roadmap, team, insights) are intentionally NOT here.
// key  -> src/pages/<key>.mjs and i18n/<lang>/<key>.mjs
// slug -> URL (EN at /<slug>/, AR at /ar/<slug>/)
// nav  -> key in site.nav (omit to keep out of the main nav)
export const PAGES = [
  { key: 'home', slug: '', nav: 'home' },
  { key: 'about', slug: 'about', nav: 'about' },
  { key: 'ecosystem', slug: 'ecosystem', nav: 'ecosystem' },
  { key: 'how', slug: 'how-we-work', nav: 'how' },
  { key: 'serve', slug: 'who-we-serve', nav: 'serve' },
  { key: 'solutions', slug: 'solutions', nav: 'solutions' },
  { key: 'contact', slug: 'contact', nav: 'contact', noCta: true, navButton: true },
  { key: 'privacy', slug: 'privacy' },
  { key: 'thanks', slug: 'thank-you', noCta: true, noindex: true },
];

export const SEGMENTS = ['enterprise', 'funder', 'investor', 'partner', 'government'];

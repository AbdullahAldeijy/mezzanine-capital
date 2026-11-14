import { pageUrl } from './shell.mjs';
export { pageUrl };

export const ICONS = {
  technology: 'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
  finance: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  investment: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  marketing: 'M13 10V3L4 14h7v7l9-11h-7z',
};
export const icon = (id) => `<svg class="act-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="${ICONS[id]}"/></svg>`;
export const arrow = '<svg class="arr" viewBox="0 0 18 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M1 6h15M11 1l5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Standard inner-page header
export const pageHead = (esc, title, sub = '') => `
<header class="page-head">
  <div class="container">
    <h1 class="h1 page-title reveal reveal-1">${esc(title)}</h1>
    ${sub ? `<p class="lede reveal reveal-2">${esc(sub)}</p>` : ''}
  </div>
</header>`;

import { MAPS, socials } from '../shell.mjs';

const P = (d) => `<path stroke-linecap="round" stroke-linejoin="round" d="${d}"/>`;
const ic = (inner) => `<svg class="ci" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" aria-hidden="true">${inner}</svg>`;
const ICON = {
  email: ic(P('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z')),
  phone: ic(P('M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z')),
  address: ic(P('M15 10.5a3 3 0 11-6 0 3 3 0 016 0z') + P('M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z')),
  linkedin: ic(P('M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8 10v7M8 7v.01M12 17v-4a2 2 0 014 0v4M12 10v7')),
  link: ic(P('M13.5 6H18v4.5M18 6l-7.5 7.5M10 7H6.5A1.5 1.5 0 005 8.5v9A1.5 1.5 0 006.5 19h9a1.5 1.5 0 001.5-1.5V14')),
};

export default function contact(t, { esc }) {
  const c = t.contact, i = t.site.contactInfo;
  const EXT = ' target="_blank" rel="noopener"';
  const card = (icon, label, href, text, { ltr = false, ext = false } = {}) =>
    `<a class="card contact-card rv" href="${href}"${ext ? EXT : ''}>${icon}<span class="cc-label">${esc(label)}</span><span class="cc-value"${ltr ? ' dir="ltr"' : ''}>${text}</span></a>`;
  // Core cards, then any social profile with a URL in config/site.mjs (LinkedIn first), then the address
  const cards = [
    card(ICON.email, c.cards.email, `mailto:${i.email}`, i.email, { ltr: true }),
    card(ICON.phone, c.cards.phone, 'tel:+966544043103', i.phone, { ltr: true }),
    ...socials(t).map((s) => card(ICON[s.key] || ICON.link, s.label, s.url, esc(s.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')), { ext: true, ltr: true })),
    card(ICON.address, c.cards.address, MAPS, esc(i.address), { ext: true }),
  ];
  return `
<header class="page-head">
  <div class="container">
    <h1 class="h1 page-title reveal reveal-1">${esc(c.title)}</h1>
    <p class="contact-lead reveal reveal-2">${esc(c.introLead)}</p>
    <p class="lede reveal reveal-2">${esc(c.introBody)}</p>
  </div>
</header>
<section class="section" aria-label="${esc(c.title)}">
  <div class="container">
    <div class="contact-cards">
      ${cards.join('\n      ')}
    </div>
  </div>
</section>`;
}

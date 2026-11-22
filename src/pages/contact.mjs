// Contact: the night city with a beacon at the KAFD landmark, then glass contact cards.
import { MAPS, socials, whatsappUrl } from '../shell.mjs';
import { brand } from '../icons.mjs';
import { words } from '../layout.mjs';

const P = (d) => `<path stroke-linecap="round" stroke-linejoin="round" d="${d}"/>`;
const ic = (inner) => `<svg class="cc-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" aria-hidden="true">${inner}</svg>`;
const ICON = {
  email: ic(P('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z')),
  whatsapp: brand('whatsapp', 'cc-icon'),
  address: ic(P('M15 10.5a3 3 0 11-6 0 3 3 0 016 0z') + P('M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z')),
  linkedin: brand('linkedin', 'cc-icon'),
  link: ic(P('M13.5 6H18v4.5M18 6l-7.5 7.5M10 7H6.5A1.5 1.5 0 005 8.5v9A1.5 1.5 0 006.5 19h9a1.5 1.5 0 001.5-1.5V14')),
};

export default function contact(t, { esc, rtl, lang }) {
  const c = t.contact, i = t.site.contactInfo, dir = rtl ? 'rtl' : 'ltr';
  const card = (icon, label, href, text, { ltr = false, ext = false } = {}) =>
    `<a class="cc glass" href="${href}"${ext ? ' target="_blank" rel="noopener"' : ''}>${icon}<span class="cc-label">${esc(label)}</span><span class="cc-value"${ltr ? ' dir="ltr"' : ''}>${text}</span></a>`;
  // core cards, then any social profile with a URL in config/site.mjs, then the address (which carries the beacon)
  const cards = [
    card(ICON.email, c.cards.email, `mailto:${i.email}`, i.email, { ltr: true }),
    card(ICON.whatsapp, c.cards.whatsapp, whatsappUrl(lang), i.phone, { ltr: true, ext: true }),
    ...socials(t).map((s) => card(ICON[s.key] || ICON.link, s.label, s.url, esc(s.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')), { ext: true, ltr: true })),
    card(ICON.address, c.cards.address, MAPS, esc(i.address), { ext: true }).replace('class="cc glass"', 'class="cc glass cc-kafd"'),
  ];
  return `
<section class="hero hero-contact" aria-labelledby="contact-title">
  <div class="hero-city" id="city" data-city data-beacon aria-hidden="true"
       style="--poster-wide:url('/images/city-poster-wide-${dir}.webp');--poster-tall:url('/images/city-poster-tall-${dir}.webp')"></div>
  <div class="hero-inner">
    <h1 id="contact-title" class="hero-title contact-title">${words(esc, c.title)}</h1>
    <p class="contact-lead">${esc(c.introLead)}</p>
    <p class="hero-lede">${esc(c.introBody)}</p>
  </div>
</section>

<section class="section contact-cards-wrap" aria-label="${esc(c.title)}">
  <div class="wrap contact-cards" data-loop>
    ${cards.join('\n    ')}
  </div>
</section>`;
}

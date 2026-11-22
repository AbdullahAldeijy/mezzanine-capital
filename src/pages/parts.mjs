// Shared building blocks for the pages. All copy is passed in from i18n.
import { pageUrl } from '../shell.mjs';
import { words } from '../layout.mjs';
import { rng } from '../../js/city-data.js';

// Inner-page header: headline (word spans, visible at once) over a faint perspective grid and teal glow.
export function pageHead(esc, title, lede = '') {
  return `
<header class="phead">
  <div class="phead-grid" aria-hidden="true"></div>
  <div class="wrap phead-inner">
    <h1 class="phead-title">${words(esc, title)}</h1>
    ${lede ? `<p class="lede phead-lede">${esc(lede)}</p>` : ''}
  </div>
</header>`;
}

// Challenge -> Solution: nodes start scattered and unlinked, then settle into lanes and connect as you scroll.
// Final positions sit on three lanes that converge into one stream; (dx, dy) is each node's scattered offset.
function signalsSVG(rtl) {
  const r = rng(31337), lanes = [70, 160, 250], xs = [50, 130, 210, 290], nodes = [], links = [];
  lanes.forEach((y) => xs.forEach((x, i) => {
    nodes.push({ x, y, dx: Math.round((r() - 0.5) * 110), dy: Math.round((r() - 0.5) * 120) });
    if (i) links.push(`M${xs[i - 1]} ${y}H${x}`);
  }));
  lanes.forEach((y) => links.push(`M290 ${y}C330 ${y} 330 160 372 160`));
  return `<svg class="sig" viewBox="0 0 400 320" aria-hidden="true"${rtl ? ' data-flip' : ''}>
        ${links.map((d) => `<path class="sig-link" pathLength="1" d="${d}"/>`).join('')}
        ${nodes.map((n, k) => `<circle class="sig-node" cx="${n.x}" cy="${n.y}" r="5" style="--dx:${n.dx};--dy:${n.dy};--k:${k}"/>`).join('')}
        <circle class="sig-core" cx="372" cy="160" r="11"/>
      </svg>`;
}
export function signals(t, { esc, lang, rtl }, { link = true } = {}) {
  const a = t.about;
  return `
<section class="section signals" aria-label="${esc(a.challengeTitle)}, ${esc(a.solutionTitle)}" data-reveal>
  <div class="wrap signals-grid">
    <article class="panel glass signals-from">
      <h2 class="h4">${esc(a.challengeTitle)}</h2>
      <p>${esc(a.challenge)}</p>
    </article>
    <div class="signals-field">${signalsSVG(rtl)}</div>
    <article class="panel glass signals-to">
      <h2 class="h4">${esc(a.solutionTitle)}</h2>
      <p>${esc(a.solution)}</p>
      ${link ? `<a class="text-link" href="${pageUrl(lang, 'about')}">${esc(t.site.ui.learnMore)}</a>` : ''}
    </article>
  </div>
</section>`;
}

// one line motif per activity (decorative, no data): circuit traces, strata, converging arcs, ripples
export const MOTIF = {
  technology: '<path d="M0 30h46v-18h40v30h52v-22h62M0 62h28v16h70v-28h44v22h60M20 96h54v-12h50v20h86"/><circle cx="86" cy="12" r="3"/><circle cx="142" cy="50" r="3"/><circle cx="124" cy="84" r="3"/>',
  finance: '<path d="M0 98c40-6 80-6 120 0s80 6 120 0M0 78c40-6 80-6 120 0s80 6 120 0M0 58c40-6 80-6 120 0s80 6 120 0M0 38c40-6 80-6 120 0s80 6 120 0"/>',
  investment: '<path d="M0 110C70 110 150 80 220 14M0 80C80 80 150 60 220 14M0 50C90 50 160 40 220 14M40 120C110 100 170 70 220 14"/><circle cx="220" cy="14" r="4"/>',
  marketing: '<circle cx="190" cy="60" r="12"/><circle cx="190" cy="60" r="30"/><circle cx="190" cy="60" r="52"/><circle cx="190" cy="60" r="76"/><circle cx="190" cy="60" r="102"/>',
};
export const motif = (id, rtl) => `<svg class="motif motif-${id}" viewBox="0 0 240 120" preserveAspectRatio="xMaxYMid meet" aria-hidden="true"${rtl ? ' data-flip' : ''}>${MOTIF[id]}</svg>`;

// Four activities as nodes wired to the intelligence core. Selecting a node lights its link and shows its details.
// opts.page = true on /ecosystem/: panels carry the activity ids (anchors), a motif, and no link back to the page.
const POS = [[16, 18], [84, 18], [84, 82], [16, 82]];
export function network(t, { esc, lang, rtl }, { page = false, headingLevel = 'h2' } = {}) {
  const e = t.ecosystem, pos = POS.map(([x, y]) => [rtl ? 100 - x : x, y]);
  const wire = ([x, y]) => `M50 50 Q ${(50 + x) / 2 + (y < 50 ? 6 : -6) * (x < 50 ? 1 : -1)} ${(50 + y) / 2} ${x} ${y}`;
  const H = headingLevel === 'h2' ? 'h3' : 'h2';
  return `
    <div class="net" data-net data-loop>
      <svg class="net-wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        ${pos.map((p, i) => `<path class="net-wire" data-i="${i}" d="${wire(p)}"/><path class="net-flow" data-i="${i}" d="${wire(p)}"/>`).join('\n        ')}
      </svg>
      <div class="net-core" aria-hidden="true"><span>${esc(t.home.title)}</span></div>
      ${e.items.map((it, i) => `<button type="button" class="net-node" data-i="${i}" data-id="${it.id}" style="--x:${pos[i][0]}%;--y:${pos[i][1]}%" aria-controls="net-detail" aria-pressed="${i === 0}"><span class="net-dot"></span><span class="net-name">${esc(it.name)}</span></button>`).join('\n      ')}
    </div>
    <div class="net-detail" id="net-detail" aria-live="polite">
      ${e.items.map((it, i) => `<article class="panel glass net-item${i === 0 ? ' is-on' : ''}" data-i="${i}"${page ? ` id="${it.id}"` : ''}>
        ${page ? motif(it.id, rtl) : ''}
        <${H} class="h3">${esc(it.name)}</${H}>
        <p class="tag net-tag">${esc(it.tagline)}</p>
        <p>${esc(it.text)}</p>
        ${page ? '' : `<a class="text-link" href="${pageUrl(lang, 'ecosystem')}#${it.id}" data-cta="card">${esc(t.site.nav.ecosystem)}</a>`}
      </article>`).join('\n      ')}
    </div>`;
}

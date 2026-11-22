// Home (v2, "Capital Flow"): city hero, Challenge -> Solution signals, activities network, audiences, CTA band.
import { pageUrl } from '../shell.mjs';
import { words } from '../shell-v2.mjs';
import { silhouettePath, rng } from '../../v2/city-data.js';

// Challenge -> Solution: nodes start scattered and unlinked, then settle into lanes and connect as you scroll.
// Final positions sit on three lanes that converge into one stream; (dx, dy) is each node's scattered offset.
function signals(rtl) {
  const r = rng(31337), lanes = [70, 160, 250], xs = [50, 130, 210, 290], nodes = [], links = [];
  lanes.forEach((y, l) => xs.forEach((x, i) => {
    nodes.push({ x, y, dx: Math.round((r() - 0.5) * 110), dy: Math.round((r() - 0.5) * 120) });
    if (i) links.push(`M${xs[i - 1]} ${y}H${x}`);
  }));
  lanes.forEach((y) => links.push(`M290 ${y}C330 ${y} 330 160 372 160`));
  return `<svg class="sig" viewBox="0 0 400 320" aria-hidden="true"${rtl ? ' data-flip' : ''}>
        ${links.map((d) => `<path class="sig-link" pathLength="1" d="${d}"/>`).join('')}
        ${nodes.map((n) => `<circle class="sig-node" cx="${n.x}" cy="${n.y}" r="5" style="--dx:${n.dx};--dy:${n.dy}"/>`).join('')}
        <circle class="sig-core" cx="372" cy="160" r="11"/>
      </svg>`;
}

// network node positions (percent of a square); mirrored in RTL so the order runs clockwise from the reading start
const POS = [[16, 18], [84, 18], [84, 82], [16, 82]];

export default function home(t, { esc, lang, rtl }) {
  const h = t.home, a = t.about, e = t.ecosystem, s = t.serve;
  const pos = POS.map(([x, y]) => [rtl ? 100 - x : x, y]);
  const wire = ([x, y]) => `M50 50 Q ${(50 + x) / 2 + (y < 50 ? 6 : -6) * (x < 50 ? 1 : -1)} ${(50 + y) / 2} ${x} ${y}`;
  const dir = rtl ? 'rtl' : 'ltr';
  return `
<section class="hero" aria-labelledby="hero-title">
  <div class="hero-city" id="city" data-city aria-hidden="true"
       style="--poster-wide:url('/images/city-poster-wide-${dir}.webp');--poster-tall:url('/images/city-poster-tall-${dir}.webp')"></div>
  <div class="hero-inner">
    <h1 id="hero-title" class="hero-title">${words(esc, h.title)}</h1>
    <p class="hero-lede">${esc(h.message)}</p>
    <div class="hero-cta">
      <a href="${pageUrl(lang, 'contact')}" class="btn btn-primary" data-cta="hero" data-magnetic>${esc(h.ctaContact)}</a>
      <a href="${pageUrl(lang, 'who-we-serve')}" class="btn btn-glass" data-cta="hero">${esc(h.ctaExplore)}</a>
    </div>
  </div>
</section>

<section class="section signals" aria-label="${esc(a.title)}" data-progress>
  <div class="wrap signals-grid">
    <article class="panel glass signals-from">
      <h2 class="h3">${esc(a.challengeTitle)}</h2>
      <p>${esc(a.challenge)}</p>
    </article>
    <div class="signals-field">${signals(rtl)}</div>
    <article class="panel glass signals-to">
      <h2 class="h3">${esc(a.solutionTitle)}</h2>
      <p>${esc(a.solution)}</p>
      <a class="text-link" href="${pageUrl(lang, 'about')}">${esc(t.site.ui.learnMore)}</a>
    </article>
  </div>
</section>

<section class="section eco" aria-labelledby="eco-title">
  <div class="wrap eco-grid">
    <header class="eco-head">
      <h2 id="eco-title" class="h2">${esc(e.title)}</h2>
      <p class="lede">${esc(e.intro)}</p>
    </header>
    <div class="net" data-net>
      <svg class="net-wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        ${pos.map((p, i) => `<path class="net-wire" data-i="${i}" d="${wire(p)}"/><path class="net-flow" data-i="${i}" d="${wire(p)}"/>`).join('\n        ')}
      </svg>
      <div class="net-core" aria-hidden="true"><span>${esc(h.title)}</span></div>
      ${e.items.map((it, i) => `<button type="button" class="net-node" data-i="${i}" style="--x:${pos[i][0]}%;--y:${pos[i][1]}%" aria-controls="net-detail" aria-pressed="${i === 0}"><span class="net-dot"></span><span class="net-name">${esc(it.name)}</span></button>`).join('\n      ')}
    </div>
    <div class="net-detail" id="net-detail" aria-live="polite">
      ${e.items.map((it, i) => `<article class="panel glass net-item${i === 0 ? ' is-on' : ''}" data-i="${i}">
        <h3 class="h3">${esc(it.name)}</h3>
        <p class="net-tag">${esc(it.tagline)}</p>
        <p>${esc(it.text)}</p>
        <a class="text-link" href="${pageUrl(lang, 'ecosystem')}#${it.id}" data-cta="card">${esc(t.site.nav.ecosystem)}</a>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section aud" aria-labelledby="aud-title">
  <div class="wrap">
    <h2 id="aud-title" class="h2">${esc(s.title)}</h2>
    <ul class="aud-list">
      ${s.segments.map((seg) => `<li><a class="aud-row" href="${pageUrl(lang, 'who-we-serve')}#${seg.key}" data-cta="card">
        <span class="aud-name">${esc(seg.name)}</span>
        <span class="aud-text">${esc(seg.text)}</span>
      </a></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="band" aria-labelledby="band-title">
  <svg class="band-city" viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true"><path d="${silhouettePath({ height: 200, mirror: rtl })}"/></svg>
  <div class="wrap band-inner">
    <h2 id="band-title" class="h2 band-title">${esc(t.contact.introLead)}</h2>
    <div class="hero-cta">
      <a href="${pageUrl(lang, 'contact')}" class="btn btn-primary" data-cta="final" data-magnetic>${esc(h.ctaContact)}</a>
      <a href="${pageUrl(lang, 'who-we-serve')}" class="btn btn-glass" data-cta="final">${esc(h.ctaExplore)}</a>
    </div>
  </div>
</section>`;
}

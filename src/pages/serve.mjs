// Who We Serve: the five audiences orbit the core; hovering, focusing or tapping one reveals its message in the centre.
// On small screens (and without JS) the same messages become a smooth horizontal scroller.
import { pageUrl } from '../shell.mjs';
import { pageHead } from './parts.mjs';

export default function serve(t, { esc, lang, rtl }) {
  const s = t.serve, n = s.segments.length, R = 41;
  // start at the top and run clockwise in LTR, counter-clockwise in RTL (the reading direction)
  const pos = s.segments.map((_, i) => {
    const a = (-90 + (rtl ? -1 : 1) * (360 / n) * i) * Math.PI / 180;
    return [+(50 + R * Math.cos(a)).toFixed(2), +(50 + R * Math.sin(a)).toFixed(2)];
  });
  return `${pageHead(esc, s.title)}

<section class="section serve" aria-label="${esc(s.title)}">
  <div class="wrap serve-wrap">
    <div class="orbit" data-orbit>
      <svg class="orbit-svg" viewBox="0 0 100 100" aria-hidden="true">
        <circle class="orbit-ring" cx="50" cy="50" r="${R}"/>
        <circle class="orbit-ring orbit-ring-2" cx="50" cy="50" r="${R - 9}"/>
        ${pos.map(([x, y], i) => `<line class="orbit-spoke" data-i="${i}" x1="50" y1="50" x2="${x}" y2="${y}"/>`).join('')}
      </svg>
      ${s.segments.map((seg, i) => `<button type="button" class="orbit-node${pos[i][1] < 45 ? ' is-up' : ''}" data-i="${i}" data-id="${seg.key}" style="--x:${pos[i][0]}%;--y:${pos[i][1]}%" aria-controls="seg-${seg.key}" aria-pressed="${i === 0}"><span class="orbit-dot"></span><span class="orbit-name">${esc(seg.name)}</span></button>`).join('\n      ')}
    </div>
    <div class="seg-list" data-segs>
      ${s.segments.map((seg, i) => `<article class="seg glass${i === 0 ? ' is-on' : ''}" id="seg-${seg.key}" data-i="${i}">
        <span class="seg-anchor" id="${seg.key}"></span>
        <h2 class="h4">${esc(seg.name)}</h2>
        <p class="seg-text">${esc(seg.text)}</p>
        <a class="btn btn-primary btn-sm" href="${pageUrl(lang, 'contact')}" data-cta="card">${esc(s.cta)}</a>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

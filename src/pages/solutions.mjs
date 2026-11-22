// Solutions: glass cards, each with its status chip (config/solutions.mjs) and a tiny abstract animated visual.
// The visuals are purely decorative: no numbers, axes or data.
import { pageHead } from './parts.mjs';
import { STATUS } from '../../config/solutions.mjs';

const dots = () => { let d = ''; for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) d += `<circle cx="${24 + c * 24}" cy="${28 + r * 24}" r="2.2" style="--d:${((c * 0.11) + (r * 0.05)).toFixed(2)}s"/>`; return d; };
const VISUAL = {
  // a lens sweeps across scattered signals; the ones it passes light up
  'credit-intelligence': `<g class="v-dots">${dots()}</g><rect class="v-scan" x="0" y="10" width="34" height="100" rx="17"/>`,
  // criteria light up one by one, the gate opens, and a pulse passes through
  'conditional-credit': '<path class="v-track" d="M10 60H230"/><g class="v-crit"><rect x="40" y="30" width="10" height="60" rx="5" style="--d:0s"/><rect x="80" y="30" width="10" height="60" rx="5" style="--d:.5s"/><rect x="120" y="30" width="10" height="60" rx="5" style="--d:1s"/></g><path class="v-gate" d="M170 30V90"/><circle class="v-pulse" cx="10" cy="60" r="5"/>',
  // two interlocking rings: financing and impact, turning together
  'impact-sukuk': '<g class="v-rings"><circle class="v-ring" cx="98" cy="60" r="38"/><circle class="v-ring v-ring-b" cx="142" cy="60" r="38"/></g><circle class="v-orbiter" r="4"/>',
  // flowing lines that redraw (no axes, no values)
  reports: '<path class="v-line" d="M10 90C50 90 60 50 100 56S160 30 230 26" style="--d:0s"/><path class="v-line" d="M10 100C60 98 90 72 130 76S190 58 230 52" style="--d:.4s"/><path class="v-line" d="M10 70C40 66 80 84 120 72S180 82 230 74" style="--d:.8s"/>',
};

export default function solutions(t, { esc, rtl }) {
  const s = t.solutions;
  return `${pageHead(esc, s.title)}

<section class="section sols" aria-label="${esc(s.title)}">
  <div class="wrap sol-grid">
    ${s.items.map((it) => {
      const st = STATUS[it.id] === 'available' ? 'available' : 'development';     // anything else falls back to the safe default
      return `<article class="sol glass">
      <svg class="sol-visual sol-visual-${it.id}" viewBox="0 0 240 120" aria-hidden="true"${rtl ? ' data-flip' : ''}>${VISUAL[it.id] || ''}</svg>
      <p class="chip chip-${st}"><span class="sr-only">${esc(s.statusLabel)}: </span>${esc(s.statuses[st])}</p>
      <h2 class="h4">${esc(it.name)}</h2>
      <p>${esc(it.text)}</p>
    </article>`;
    }).join('\n    ')}
  </div>
</section>`;
}

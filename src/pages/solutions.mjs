import { pageHead } from '../ui.mjs';
import { STATUS } from '../../config/solutions.mjs';

export default function solutions(t, { esc }) {
  const s = t.solutions;
  return `${pageHead(esc, s.title)}
<section class="section">
  <div class="container">
    <div class="cards cards-2">
      ${s.items.map((it, i) => {
        const st = STATUS[it.id] === 'available' ? 'available' : 'development'; // anything else falls back to the safe default
        return `<article class="card sol rv" style="--d:${(i * 0.06).toFixed(2)}s">
        <span class="badge badge-${st}"><span class="sr-only">${esc(s.statusLabel)}: </span>${esc(s.statuses[st])}</span>
        <h2 class="h3">${esc(it.name)}</h2>
        <p>${esc(it.text)}</p>
      </article>`;
      }).join('\n      ')}
    </div>
  </div>
</section>`;
}

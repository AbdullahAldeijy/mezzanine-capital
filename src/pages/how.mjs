import { pageHead, arrow } from '../ui.mjs';

export default function how(t, { esc }) {
  const h = t.how;
  const last = h.steps.length - 1;
  return `${pageHead(esc, h.title, h.subtitle)}
<section class="section">
  <div class="container">
    <ol class="vchain rv" aria-label="${esc(h.flowLabel)}">
      ${h.steps.map((s, i) => `<li class="vstep${i === last ? ' vstep-holding' : ''}">
        <span class="vstep-n num">${i + 1}</span>
        <span class="vstep-who">${esc(s.who)}</span>
        <span class="vstep-text">${esc(s.text)}</span>
        ${i < last ? arrow : ''}
      </li>`).join('\n      ')}
    </ol>
  </div>
</section>`;
}

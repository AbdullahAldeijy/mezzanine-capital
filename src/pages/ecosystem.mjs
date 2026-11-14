import { pageHead, icon } from '../ui.mjs';

export default function ecosystem(t, { esc }) {
  const e = t.ecosystem;
  return `${pageHead(esc, e.title, e.intro)}
<section class="section">
  <div class="container">
    <div class="cards cards-2">
      ${e.items.map((it, i) => `<article class="card act rv" id="${it.id}" style="--d:${(i * 0.06).toFixed(2)}s">
        <div class="act-top"><span class="num act-n">0${i + 1}</span>${icon(it.id)}</div>
        <h2 class="h3">${esc(it.name)}</h2>
        <p class="act-tag">${esc(it.tagline)}</p>
        <p>${esc(it.text)}</p>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

import { pageHead, pageUrl, arrow } from '../ui.mjs';

export default function serve(t, { esc, lang }) {
  const s = t.serve;
  return `${pageHead(esc, s.title)}
<section class="section">
  <div class="container">
    <div class="cards cards-aud">
      ${s.segments.map((seg, i) => `<article class="card aud-card rv" id="${seg.key}" style="--d:${(i * 0.05).toFixed(2)}s">
        <h2 class="h3">${esc(seg.name)}</h2>
        <p>${esc(seg.text)}</p>
        <a class="btn btn-primary" href="${pageUrl(lang, 'contact')}" data-cta="card">${esc(s.cta)}</a>
      </article>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

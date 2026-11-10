export default function impact(t, { esc }) {
  const i = t.impact;
  return `
<section id="impact" class="section" aria-labelledby="impact-title">
  <div class="container">
    <div class="section-head rv">
      <h2 id="impact-title" class="h2">${esc(i.title)}</h2>
    </div>
    <div class="impact-grid">
      ${i.cols.map((c, n) => `<article class="card impact-col rv" style="--d:${(n * 0.08).toFixed(2)}s">
        <p class="eyebrow">${esc(c.who)}</p>
        <p class="impact-metric h3">${esc(c.metric)} <span class="impact-up" aria-hidden="true">↑</span><span class="sr-only">${esc(i.rises)}</span></p>
        <ul class="impact-list">
          ${c.bullets.map((b) => `<li>${esc(b)}</li>`).join('\n          ')}
        </ul>
      </article>`).join('\n      ')}
    </div>
    <p class="fine impact-note rv">${esc(i.footnote)}</p>
  </div>
</section>`;
}

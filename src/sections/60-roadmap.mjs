export default function roadmap(t, { esc }) {
  const r = t.roadmap;
  return `
<section id="roadmap" class="section" aria-labelledby="road-title">
  <div class="container">
    <div class="section-head rv">
      <span class="eyebrow">${esc(r.eyebrow)}</span>
      <h2 id="road-title" class="h2">${esc(r.title)}</h2>
    </div>
    <ol class="road rv">
      ${r.items.map((it, i) => `<li class="road-item${i === 0 ? ' is-now' : ''}"${i === 0 ? ' aria-current="step"' : ''}>
        <span class="road-year num">${esc(it.year)}</span>
        <span class="road-name">${esc(it.name)}</span>
        ${i === 0 ? `<span class="road-badge">${esc(r.here)}</span>` : ''}
      </li>`).join('\n      ')}
    </ol>
    <p class="road-line rv">${esc(r.line)}</p>
  </div>
</section>`;
}

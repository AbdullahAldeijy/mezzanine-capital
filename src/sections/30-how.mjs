const up = '<svg viewBox="0 0 16 100" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" preserveAspectRatio="none"><path d="M8 99V3M2 9l6-6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export default function how(t, { esc }) {
  const h = t.how, s = t.solutions;
  const col = (c, cls) => `
        <div class="split-col ${cls} rv">
          <p class="eyebrow">${esc(c.who)}</p>
          <h3 class="h3">${esc(c.product)}</h3>
          <p class="split-desc">${esc(c.desc)}</p>
          <div class="split-outcome">
            <svg viewBox="0 0 18 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M1 6h15M11 1l5 5-5 5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <div><p class="split-outcome-name">${esc(c.outcome)}</p><p class="split-desc">${esc(c.outcomeDesc)}</p></div>
          </div>
        </div>`;
  return `
<div id="how-it-works">
  <section class="section" aria-labelledby="how-title">
    <div class="container">
      <div class="section-head rv">
        <span class="eyebrow">${esc(h.eyebrow)}</span>
        <h2 id="how-title" class="h2">${esc(h.title)}</h2>
      </div>
      <div class="how-grid">
        <div class="stack-wrap rv" role="group" aria-label="${esc(h.stackLabel)}">
          <div class="stack-rail">
            <span class="stack-cap">${esc(h.decisionsOut)}</span>${up}<span class="stack-cap">${esc(h.dataIn)}</span>
          </div>
          <ol class="stack">
            ${h.layers.map((l, i) => `<li class="layer layer-${i + 1}"><span class="num">0${i + 1}</span><span>${esc(l)}</span></li>`).join('\n            ')}
          </ol>
        </div>
        <p class="how-body rv" style="--d:.1s">${esc(h.body)}</p>
      </div>
    </div>
  </section>

  <section class="section" id="solutions" aria-labelledby="sol-title">
    <div class="container">
      <h2 id="sol-title" class="sr-only">${esc(s.title)}</h2>
      <div class="split">${col(s.enterprises, 'split-light')}${col(s.funders, 'split-dark')}
      </div>
      <p class="fine split-note rv">${esc(s.footnote)}</p>
    </div>
  </section>
</div>`;
}

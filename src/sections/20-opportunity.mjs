import { cycle } from '../svg.mjs';

function stat(esc, { value, unit, label }, extra = '') {
  const dec = value.includes('.') ? value.split('.')[1].length : 0;
  return `<span class="stat-value"><span class="num" data-count="${value}" data-decimals="${dec}">${value}</span><span class="stat-unit">${esc(unit)}</span></span>${label ? `<span class="stat-label">${esc(label)}</span>` : ''}${extra}`;
}

export default function opportunity(t, { esc, rtl }) {
  const o = t.opportunity, s = o.stats, g = t.gap;
  // Meter fill is the ratio of the two published figures (11.3 / 20)
  const pct = ((parseFloat(s.sme.value) / parseFloat(s.target.value)) * 100).toFixed(1);
  return `
<div id="opportunity">
  <section class="section" aria-labelledby="opp-title">
    <div class="container">
      <div class="section-head rv">
        <h2 id="opp-title" class="h2">${esc(o.title)}</h2>
      </div>
      <div class="stats">
        <article class="card stat rv">${stat(esc, s.sme)}</article>
        <article class="card stat rv" style="--d:.08s">
          ${stat(esc, s.target)}
          <span class="stat-gap"><span class="num" data-count="${s.gap.value}" data-decimals="1">${s.gap.value}</span>${esc(s.gap.unit)} <span>${esc(s.gap.label)}</span></span>
          <span class="meter" role="img" aria-label="${esc(s.meter)}"><span class="meter-fill" style="width:${pct}%"></span></span>
        </article>
        <article class="card stat stat-context rv" style="--d:.16s">
          <span class="eyebrow">${esc(s.contextTag)}</span>
          ${stat(esc, s.market)}
        </article>
      </div>
      <p class="fine stat-note rv">${esc(o.footnote)}</p>

      <div class="why-now rv">
        <h3 class="h3">${esc(o.whyNow.title)}</h3>
        <ol class="timeline">
          ${o.whyNow.items.map((it) => `<li><span class="tl-when num">${esc(it.when)}</span><span class="tl-what">${esc(it.what)}</span></li>`).join('\n          ')}
        </ol>
        <p class="why-line">${esc(o.whyNow.line)}</p>
      </div>
      <p class="fine sources rv">${esc(o.sources)}</p>
    </div>
  </section>

  <section class="section" id="gap" aria-labelledby="gap-title">
    <div class="container">
      <div class="section-head rv">
        <span class="eyebrow">${esc(g.eyebrow)}</span>
        <h2 id="gap-title" class="h2">${esc(g.title)}</h2>
      </div>
      <div class="gap-grid">
        <div class="rv">${cycle({ id: 'loop', nodes: g.nodes.map((n) => n.short), center: g.center, rtl, label: g.diagramLabel, tone: 'ink' })}</div>
        <div class="rv" style="--d:.1s">
          <ol class="steps">
            ${g.nodes.map((n, i) => `<li><span class="step-n num">${i + 1}</span><span>${esc(n.text)}</span></li>`).join('\n            ')}
          </ol>
          <p class="steps-back fine">${esc(g.backToStart)}</p>
          <p class="gap-body">${esc(g.body)}</p>
          <p class="callout">${esc(g.callout)}</p>
        </div>
      </div>
    </div>
  </section>
</div>`;
}

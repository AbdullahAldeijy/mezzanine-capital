import { cycle } from '../svg.mjs';

// Arm sites. No live URLs yet — set a string to turn the badge into a link.
// TODO(mezzanine): add each arm's URL here once its site is live.
const URLS = [
  null, // TODO: Mezzanine Tech URL
  null, // TODO: Mezzanine Finance URL
  null, // TODO: Mezzanine Investments URL
  null, // TODO: Mezzanine Marketing URL
];
const ICONS = [
  'M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01',
  'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'M13 10V3L4 14h7v7l9-11h-7z',
];

export default function ecosystem(t, { esc, rtl }) {
  const e = t.ecosystem, f = e.flywheel;
  const rows = e.arms.map((a, i) => {
    const badge = URLS[i]
      ? `<a class="tag-pill tag-link" href="${URLS[i]}" target="_blank" rel="noopener">${esc(a.badge)}</a>`
      : `<span class="tag-pill">${esc(a.badge)}</span>`;
    return `
      <li class="directory-row rv">
        <div class="row-grid">
          <span class="num row-num">0${i + 1}</span>
          <svg class="row-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="${ICONS[i]}"/></svg>
          <div class="row-body">
            <h3 class="h3">${esc(a.domain)}</h3>
            <p>${esc(a.desc)}</p>
            ${a.sub ? `<p class="row-sub">${esc(a.sub)}</p>` : ''}
          </div>
          ${badge}
        </div>
      </li>`;
  }).join('');
  return `
<section id="ecosystem" class="section" aria-labelledby="eco-title">
  <div class="container">
    <div class="section-head rv">
      <span class="eyebrow">${esc(e.eyebrow)}</span>
      <h2 id="eco-title" class="h2">${esc(e.title)}</h2>
      <p>${esc(e.intro)}</p>
    </div>
    <ol class="directory">${rows}
    </ol>

    <div class="flywheel rv">
      <h3 class="h3 flywheel-title">${esc(f.title)}</h3>
      <div class="gap-grid">
        <div class="flywheel-fig">${cycle({ id: 'fly', nodes: f.steps.map((s) => s.short), center: f.center, rtl, label: f.label, tone: 'teal', spin: true })}</div>
        <div>
          <ol class="steps">
            ${f.steps.map((s, i) => `<li><span class="step-n num">${i + 1}</span><span>${esc(s.text)}</span></li>`).join('\n            ')}
          </ol>
          <p class="steps-back fine">${esc(f.loop)}</p>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

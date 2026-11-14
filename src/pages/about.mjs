import { pageHead } from '../ui.mjs';

export default function about(t, { esc }) {
  const a = t.about;
  return `${pageHead(esc, a.title)}
<section class="section" aria-label="${esc(a.challengeTitle)}">
  <div class="container">
    <div class="duo">
      <article class="card rv"><h2 class="h3">${esc(a.challengeTitle)}</h2><p>${esc(a.challenge)}</p></article>
      <article class="card card-accent rv" style="--d:.08s"><h2 class="h3">${esc(a.solutionTitle)}</h2><p>${esc(a.solution)}</p></article>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="who-title">
  <div class="container about-grid">
    <h2 id="who-title" class="h2 rv">${esc(a.whoTitle)}</h2>
    <p class="about-text rv">${esc(a.who)}</p>
  </div>
</section>

<section class="section" aria-label="${esc(a.visionTitle)}">
  <div class="container vm">
    <div class="rv"><h2 class="h3">${esc(a.visionTitle)}</h2><p>${esc(a.vision)}</p></div>
    <div class="rv"><h2 class="h3">${esc(a.missionTitle)}</h2><p>${esc(a.mission)}</p></div>
  </div>
</section>

<section class="section" aria-labelledby="values-title">
  <div class="container">
    <div class="section-head rv"><h2 id="values-title" class="h2">${esc(a.valuesTitle)}</h2></div>
    <div class="cards cards-3">
      ${a.values.map((v, i) => `<article class="card value rv" style="--d:${(i * 0.06).toFixed(2)}s"><h3 class="h3">${esc(v.name)}</h3>${v.text ? `<p>${esc(v.text)}</p>` : ''}</article>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

// About (v2): Challenge -> Solution scroll transition, who we are, Vision & Mission in glass, values as glass monoliths.
import { pageHead, signals } from './parts.mjs';

export default function about(t, ctx) {
  const { esc } = ctx, a = t.about;
  return `${pageHead(esc, a.title)}

${signals(t, ctx, { link: false })}

<section class="section" aria-labelledby="who-title">
  <div class="wrap statement">
    <h2 id="who-title" class="h2">${esc(a.whoTitle)}</h2>
    <p class="statement-text">${esc(a.who)}</p>
  </div>
</section>

<section class="section" aria-label="${esc(a.visionTitle)}, ${esc(a.missionTitle)}">
  <div class="wrap vm">
    <article class="panel glass"><h2 class="h3">${esc(a.visionTitle)}</h2><p class="vm-text">${esc(a.vision)}</p></article>
    <article class="panel glass"><h2 class="h3">${esc(a.missionTitle)}</h2><p class="vm-text">${esc(a.mission)}</p></article>
  </div>
</section>

<section class="section" aria-labelledby="values-title">
  <div class="wrap">
    <h2 id="values-title" class="h2">${esc(a.valuesTitle)}</h2>
    <div class="monoliths">
      ${a.values.map((v) => `<article class="mono glass"><h3 class="h3">${esc(v.name)}</h3>${v.text ? `<p>${esc(v.text)}</p>` : ''}</article>`).join('\n      ')}
    </div>
  </div>
</section>`;
}

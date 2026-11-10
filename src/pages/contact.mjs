import { pageHead, pageUrl } from '../ui.mjs';
import { renderForm } from '../forms.mjs';
import { SEGMENTS } from '../pages.mjs';

export default function contact(t, ctx) {
  const { esc, lang } = ctx;
  const c = t.contact, th = t.thanks;
  const privacy = pageUrl(lang, 'privacy');
  return `
<header class="page-head">
  <div class="container">
    <h1 class="h1 page-title reveal reveal-1">${esc(c.title)}</h1>
    <p class="contact-lead reveal reveal-2">${esc(c.introLead)}</p>
    <p class="lede reveal reveal-2">${esc(c.introBody)}</p>
  </div>
</header>
<section class="section" aria-labelledby="pick-title">
  <div class="container">
    <h2 id="pick-title" class="h3 pick-title">${esc(c.pickTitle)}</h2>
    <div class="seg-picker" role="radiogroup" aria-labelledby="pick-title">
      ${t.serve.segments.map((s) => `<label class="seg-card"><input type="radio" name="seg" value="${s.key}"><span class="seg-name">${esc(s.name)}</span><span class="seg-text">${esc(s.text)}</span></label>`).join('\n      ')}
    </div>

    <div id="seg-panel" class="seg-panel" tabindex="-1">
      ${SEGMENTS.map((s) => renderForm(t, ctx, s, privacy)).join('\n')}
    </div>

    <div id="form-done" class="card form-done" role="status" tabindex="-1" hidden>
      <h2 class="h3">${esc(th.title)}</h2>
      <p>${esc(th.text)}</p>
    </div>
  </div>
</section>`;
}

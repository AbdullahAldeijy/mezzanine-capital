import { pageUrl } from '../ui.mjs';

export default function thanks(t, { esc, lang }) {
  const k = t.thanks;
  return `
<section class="section thanks-wrap">
  <div class="container thanks">
    <h1 class="h1 page-title">${esc(k.title)}</h1>
    <p class="lede">${esc(k.text)}</p>
    <a href="${pageUrl(lang, '')}" class="btn btn-primary">${esc(k.back)}</a>
  </div>
</section>`;
}

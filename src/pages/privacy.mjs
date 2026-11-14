import { pageHead } from '../ui.mjs';

export default function privacy(t, { esc }) {
  const p = t.privacy;
  return `${pageHead(esc, p.title)}
<section class="section">
  <div class="container prose">
    <!-- TODO(legal): placeholder policy. Replace with the approved text and remove the draft notice. -->
    <p class="draft-note" role="note">${esc(p.draft)}</p>
    ${p.sections.map((s, i) => `<h2 class="h3">${esc(s.title)}</h2>
    <p>${esc(s.text)}${i === p.sections.length - 1 ? ` <a href="mailto:${t.site.contactInfo.email}">${t.site.contactInfo.email}</a>` : ''}</p>`).join('\n    ')}
  </div>
</section>`;
}

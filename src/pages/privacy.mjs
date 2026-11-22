// Privacy: clean and readable, minimal motion.
import { pageHead } from './parts.mjs';

export default function privacy(t, { esc }) {
  const p = t.privacy, email = t.site.contactInfo.email;
  return `${pageHead(esc, p.title)}

<section class="section privacy">
  <div class="wrap prose">
    <!-- TODO(legal): placeholder policy. Replace with the approved text and remove the draft notice. -->
    <p class="draft-note" role="note">${esc(p.draft)}</p>
    ${p.sections.map((s, i) => `<h2 class="h4">${esc(s.title)}</h2>
    <p>${esc(s.text)}${i === p.sections.length - 1 ? ` <a href="mailto:${email}">${email}</a>` : ''}</p>`).join('\n    ')}
  </div>
</section>`;
}

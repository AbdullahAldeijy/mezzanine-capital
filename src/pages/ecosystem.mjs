// Ecosystem: the intelligence core and its four activities. Selecting a node lights its link and reveals its details.
import { pageHead, network } from './parts.mjs';

export default function ecosystem(t, ctx) {
  const e = t.ecosystem;
  return `${pageHead(ctx.esc, e.title, e.intro)}

<section class="section eco eco-page" aria-label="${ctx.esc(e.title)}">
  <div class="wrap eco-grid">
${network(t, ctx, { page: true, headingLevel: 'h1' })}
  </div>
</section>`;
}

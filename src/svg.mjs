// Circular loop diagram used by "A loop that keeps SMEs out of bank credit" and the platform flywheel.
// Pure inline SVG; colours come from the site's CSS variables (see styles/20-opportunity.css).
// RTL mirrors the direction of travel (counter-clockwise) so the flow reads right-to-left.
export function cycle({ id, nodes, center, rtl, label, tone = 'ink', spin = false }) {
  const cx = 300, cy = 210, R = 115, nr = 28, gap = 22;
  const dir = rtl ? -1 : 1;
  const rad = (d) => (d * Math.PI) / 180;
  const pt = (deg, r = R) => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))];
  const f = (n) => n.toFixed(1);
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const n = nodes.length, step = 360 / n;
  const ang = (i) => -90 + dir * step * i;

  const arcs = nodes.map((_, i) => {
    const [x1, y1] = pt(ang(i) + dir * gap);
    const [x2, y2] = pt(ang(i + 1) - dir * gap);
    return `<path class="cy-arc" d="M${f(x1)} ${f(y1)} A${R} ${R} 0 0 ${dir === 1 ? 1 : 0} ${f(x2)} ${f(y2)}" marker-end="url(#${id}-ah)"/>`;
  }).join('');

  const items = nodes.map((short, i) => {
    const a = ang(i), [x, y] = pt(a), c = Math.cos(rad(a));
    let lx, ly, anchor;
    if (Math.abs(c) < 0.01) { lx = x; ly = Math.sin(rad(a)) < 0 ? y - nr - 12 : y + nr + 26; anchor = 'middle'; }
    else { lx = x + (c > 0 ? nr + 14 : -(nr + 14)); ly = y + 6; anchor = c > 0 ? 'start' : 'end'; }
    return `<g class="cy-node cy-${tone}"><circle cx="${f(x)}" cy="${f(y)}" r="${nr}"/><text class="cy-num" x="${f(x)}" y="${f(y + 7)}" text-anchor="middle">${i + 1}</text></g>` +
      `<text class="cy-label" x="${f(lx)}" y="${f(ly)}" text-anchor="${anchor}">${esc(short)}</text>`;
  }).join('');

  const ring = spin ? `<g class="cy-spin"><g class="cy-spin-hover">${arcs}</g></g>` : arcs;
  return `<svg class="cycle" viewBox="0 0 600 420" role="img" aria-label="${esc(label)}" focusable="false">
  <defs><marker id="${id}-ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" class="cy-head"/></marker></defs>
  <circle class="cy-guide" cx="${cx}" cy="${cy}" r="${R}"/>
  ${ring}
  ${center.map((l, i) => `<text class="cy-center" x="${cx}" y="${cy + (i - (center.length - 1) / 2) * 24 + 6}" text-anchor="middle">${esc(l)}</text>`).join('')}
  ${items}
</svg>`;
}

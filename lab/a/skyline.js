// Deterministic "KAFD-like" skyline used as the structure the signals settle into.
// Works in the browser (WebGL targets) and in Node (static poster SVG). Coordinates: x,y in [-1, 1], y up.
function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

// towers along the width; the start side (under the headline) stays low, landmarks rise on the end side
export function towers({ rtl = false, scale = 1 } = {}) {
  const r = rng(20261121), list = [];
  let x = -1.02;
  while (x < 1.02) {
    const w = 0.035 + r() * 0.07, gap = r() < 0.3 ? 0.008 + r() * 0.02 : 0.004;
    const side = (x + 1) / 2;                                   // 0 at start, 1 at end
    let h = (0.18 + r() * 0.42) * (0.55 + side * 0.75);
    let crown = 0;
    if (r() < 0.12 && side > 0.45) { h = 0.95 + r() * 0.3; crown = 1; }  // landmark tower with a tapered crown
    list.push({ x0: x, x1: x + w, h: h * scale, crown });
    x += w + gap;
  }
  if (rtl) list.forEach((t) => { const a = -t.x1, b = -t.x0; t.x0 = a; t.x1 = b; });
  return list;
}

// sample points on the skyline: [x, y, kind] where kind 1 = edge, .55 = floor line, .3 = ground grid
export function structurePoints(opts = {}) {
  const base = -0.94, step = opts.step || 0.011, pts = [];
  for (const t of towers(opts)) {
    const top = base + t.h, w = t.x1 - t.x0;
    const crownTop = t.crown ? top + t.h * 0.16 : top;
    for (let y = base; y <= top; y += step) { pts.push([t.x0, y, 1], [t.x1, y, 1]); }
    if (t.crown) {                                           // tapered crown edges up to a point
      const n = Math.max(6, Math.round((crownTop - top) / step));
      for (let i = 0; i <= n; i++) {
        const k = i / n, y = top + (crownTop - top) * k;
        pts.push([t.x0 + (w / 2) * k, y, 1], [t.x1 - (w / 2) * k, y, 1]);
      }
    } else {
      for (let x = t.x0; x <= t.x1; x += step * 0.8) pts.push([x, top, 1]);
    }
    for (let y = base + 0.05; y < top - 0.02; y += 0.05) {     // floors: dotted structure lines
      for (let x = t.x0 + step; x < t.x1 - step * 0.5; x += step * 1.5) pts.push([x, y, 0.55]);
    }
  }
  for (const gy of [-0.965, -0.99]) for (let x = -1; x <= 1; x += step * 1.4) pts.push([x, gy, 0.3]);
  return pts;
}

// static poster (no WebGL / reduced motion / low power): same skyline, fewer dots, as an SVG string
export function posterSVG(opts = {}) {
  const pts = structurePoints({ ...opts, step: 0.019 });
  const d = pts.map(([x, y, k]) => { const s = k === 1 ? 0.0042 : 0.003; return `M${(x).toFixed(3)} ${(-y).toFixed(3)}h${s}v${s * 1.6}h-${s}z`; }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1 -1 2 2" preserveAspectRatio="none"><path fill="#5CE6E0" fill-opacity=".55" d="${d}"/></svg>`;
}

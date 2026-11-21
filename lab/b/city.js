// Deterministic data city for direction B. Shared by the WebGL scene (browser) and the static poster (Node).
function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

export const GX = 15, GZ = 9;
// lots on a grid: x in [-(GX-1)/2, (GX-1)/2], z likewise; h = tower height (0 = empty lot)
export function lots() {
  const r = rng(4242), out = [];
  for (let i = 0; i < GX; i++) for (let k = 0; k < GZ; k++) {
    const x = i - (GX - 1) / 2, z = k - (GZ - 1) / 2;
    const centre = Math.exp(-((x - 2.5) ** 2) / 18 - (z ** 2) / 10);   // a denser, taller cluster off-centre
    if (r() < 0.22) continue;
    const h = 0.4 + r() * 1.6 + centre * (2.2 + r() * 3.2);
    out.push({ x, z, h, w: 0.32 + r() * 0.12, d: r() });
  }
  return out;
}

// the 12 edges of a box, as pairs of corners (unit box: x,z in [-1,1], y in [0,1])
const C = [[-1, 0, -1], [1, 0, -1], [1, 0, 1], [-1, 0, 1], [-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]];
export const EDGES = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]].map(([a, b]) => [C[a], C[b]]);

// static poster: isometric projection of the same city, as an SVG string
export function posterSVG({ rtl = false } = {}) {
  const iso = ([x, y, z]) => { const s = rtl ? -1 : 1; return [((x - z) * 0.866) * s, (x + z) * 0.5 - y]; };
  const paths = [];
  for (const l of lots().sort((a, b) => (a.x + a.z) - (b.x + b.z))) {
    for (const [p, q] of EDGES) {
      const a = iso([l.x + p[0] * l.w, p[1] * l.h, l.z + p[2] * l.w]), b = iso([l.x + q[0] * l.w, q[1] * l.h, l.z + q[2] * l.w]);
      paths.push(`M${a[0].toFixed(2)} ${a[1].toFixed(2)}L${b[0].toFixed(2)} ${b[1].toFixed(2)}`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-12 -9 24 15" preserveAspectRatio="xMidYMax slice"><path fill="none" stroke="#2FE3D6" stroke-opacity=".5" stroke-width=".035" d="${paths.join('')}"/></svg>`;
}

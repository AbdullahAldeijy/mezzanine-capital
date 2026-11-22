// Deterministic city layout shared by the WebGL scene (browser), the poster renderer and the SVG silhouettes (Node).
// Nothing here is data about the real world: it is a generative skyline that only echoes KAFD's tapered towers.
export function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

// Landmark towers (tall, tapered) near the centre: [x, z, height, taper]
const LANDMARKS = [[0.4, -0.6, 11.5, 0.34], [-2.6, 1.3, 8.6, 0.5], [2.9, 1.9, 9.4, 0.42], [-0.9, -3.4, 7.4, 0.55], [4.6, -2.2, 6.8, 0.6]];

// radius: footprint of the city; fewer towers on small screens (radius 7.5) than on desktop (radius 11)
export function buildCity({ radius = 11 } = {}) {
  const r = rng(7919), towers = [], step = 1.3;
  for (let gx = -Math.ceil(radius / step); gx <= radius / step; gx++) {
    for (let gz = -Math.ceil(radius / step); gz <= radius / step; gz++) {
      const jx = (r() - 0.5) * 0.3, jz = (r() - 0.5) * 0.3, keep = r(), hr = r(), wr = r(), sr = r();
      const x = gx * step + jx, z = gz * step + jz, dist = Math.hypot(x, z);
      if (dist > radius) continue;
      if (gx % 4 === 2 || gz % 5 === 3) continue;                         // avenues: gaps that read as city blocks
      if (keep < 0.14 + (dist / radius) * 0.3) continue;                  // sparser toward the edge
      if (LANDMARKS.some(([lx, lz]) => Math.hypot(x - lx, z - lz) < 1.25)) continue;
      const centre = Math.exp(-(dist * dist) / 26);
      towers.push({ x, z, w: 0.34 + wr * 0.16, h: 0.5 + hr * 1.7 + centre * (1.4 + hr * 3.6), taper: 1, landmark: 0, seed: sr });
    }
  }
  LANDMARKS.forEach(([x, z, h, taper], i) => towers.push({ x, z, w: 0.62, h, taper, landmark: 1, seed: (i + 1) / 7 }));

  // data links: arcs between landmarks, and from landmarks out to mid-rise towers
  const links = [], L = towers.length - LANDMARKS.length;
  for (let i = 0; i < LANDMARKS.length; i++) links.push([L + i, L + ((i + 1) % LANDMARKS.length)]);
  const mids = towers.map((t, i) => [t, i]).filter(([t]) => !t.landmark && t.h > 2.6).map(([, i]) => i);
  for (let k = 0; k < Math.min(16, mids.length); k++) links.push([L + (k % LANDMARKS.length), mids[Math.floor(r() * mids.length)]]);
  return { towers, links, radius };
}

// Flat skyline silhouette (SVG path data) for the CTA band and footer: the city seen from the front.
// One clean outline: for each x the tallest tower covering it wins (tapered landmarks narrow toward the top).
// Returns a closed path in a 0..1000 by 0..height box, baseline at the bottom.
export function silhouettePath({ height = 160, mirror = false } = {}) {
  const { towers } = buildCity({ radius: 11 });
  const N = 500, prof = new Array(N + 1).fill(0);
  for (const t of towers) {
    const cx = mirror ? -t.x : t.x, half = t.w * 1.15;
    for (let i = 0; i <= N; i++) {
      const x = (i / N) * 23.2 - 11.6, d = Math.abs(x - cx);
      if (d > half) continue;
      const topHalf = half * t.taper;                                   // width at the top of a tapered tower
      const h = d <= topHalf ? t.h : t.h * (1 - (d - topHalf) / (half - topHalf));
      if (h > prof[i]) prof[i] = h;
    }
  }
  const y = (h) => (height - (h / 12) * (height - 6)).toFixed(1);
  let d = `M0 ${height}`, last = null;
  prof.forEach((h, i) => {                                               // emit both ends of every flat run, so roofs stay level
    const yy = y(h), x = (i / N * 1000).toFixed(0);
    if (yy !== last) { if (last !== null) d += ` L${x} ${last}`; d += ` L${x} ${yy}`; last = yy; }
  });
  d += ` L1000 ${last}`;
  return d + ` L1000 ${height} Z`;
}

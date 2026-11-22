// The data city: one shared WebGL renderer (OGL), loaded lazily after first paint.
// Towers grow in reading direction, then the camera drifts in a slow orbit with subtle cursor parallax.
// Glass faces with lit cells, glowing edges with pulses travelling upward, data arcs between towers,
// a teal ground glow, a fading grid and distance fog. Paused when off-screen or when the tab is hidden.
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from '/vendor/ogl-1.0.11.min.mjs';
import { buildCity } from './city-data.js';

const SHARED = /* glsl */ `
vec3 place(vec3 l, vec4 lot, float taper, float grow) {
  float s = lot.w * mix(1., taper, l.y);
  return vec3(lot.x + l.x * s, l.y * lot.z * grow, lot.y + l.z * s);
}
float growth(float t, float delay) { float g = clamp((t - delay) / 1.3, 0., 1.); return 1. - pow(1. - g, 3.); }`;

const FACE_V = /* glsl */ `
attribute vec3 position; attribute vec4 aLot; attribute vec4 aMeta; attribute float aU;
uniform mat4 modelViewMatrix, projectionMatrix; uniform float uTime; uniform vec2 uFog;
varying float vY, vH, vShade, vSeed, vFog, vU;
${SHARED}
void main() {
  float g = growth(uTime, aMeta.z);
  vec4 mv = modelViewMatrix * vec4(place(position, aLot, aMeta.x, g), 1.);
  vY = position.y; vH = aLot.z * g; vShade = aMeta.w; vSeed = aMeta.y; vU = aU;
  vFog = smoothstep(uFog.y, uFog.x, -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const FACE_F = /* glsl */ `
precision highp float;
uniform float uTime;
varying float vY, vH, vShade, vSeed, vFog, vU;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  float floors = vY * vH * 3.4;
  // the seed is quantised: an interpolated varying is never exactly constant, and the hash would turn that into noise
  vec2 cell = floor(vec2(vU * 2.5 + 2.5, floors)) + floor(vSeed * 64.) * 7.;
  float lit = step(.88, hash(cell));                                                // a few lit cells per face
  float tw = .6 + .4 * sin(uTime * (.5 + hash(cell) * 1.3) + hash(cell.yx) * 6.283);  // they breathe slowly
  vec3 col = vec3(.018, .058, .092) * vShade;
  col += vec3(.07, .78, .74) * lit * tw * .34 * vShade;
  col *= .82 + .18 * smoothstep(.0, .12, fract(floors));                            // faint floor lines
  col += vec3(.04, .42, .48) * smoothstep(.5, 1., vY) * .12;                        // cool rim toward the top
  col += vec3(.0, .3, .3) * (1. - vY) * .12;                                        // ground glow bouncing up
  gl_FragColor = vec4(col, vFog);
}`;

const EDGE_V = /* glsl */ `
attribute vec3 position; attribute vec4 aLot; attribute vec4 aMeta;
uniform mat4 modelViewMatrix, projectionMatrix; uniform float uTime; uniform vec2 uFog;
varying float vY, vVert, vSeed, vFog;
${SHARED}
void main() {
  vec4 mv = modelViewMatrix * vec4(place(position, aLot, aMeta.x, growth(uTime, aMeta.z)), 1.);
  vY = position.y; vVert = aMeta.w; vSeed = aMeta.y;
  vFog = smoothstep(uFog.y, uFog.x, -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const EDGE_F = /* glsl */ `
precision highp float;
uniform float uTime;
varying float vY, vVert, vSeed, vFog;
void main() {
  vec3 teal = vec3(.07, .88, .81), cyan = vec3(.49, .97, 1.);
  // a light pulse climbs each vertical edge
  float pulse = vVert * smoothstep(.075, 0., abs(vY - fract(uTime * (.14 + vSeed * .16) + vSeed * 9.)));
  vec3 c = mix(teal, cyan, vY) * (.34 + vY * .5) + cyan * pulse * 1.7;
  gl_FragColor = vec4(c, (.72 + pulse) * vFog);
}`;

const ARC_V = /* glsl */ `
attribute vec3 position; attribute vec3 aArc;
uniform mat4 modelViewMatrix, projectionMatrix; uniform vec2 uFog;
varying vec3 vArc; varying float vFog;
void main() { vec4 mv = modelViewMatrix * vec4(position, 1.); vArc = aArc; vFog = smoothstep(uFog.y, uFog.x, -mv.z); gl_Position = projectionMatrix * mv; }`;
const ARC_F = /* glsl */ `
precision highp float;
uniform float uTime;
varying vec3 vArc; varying float vFog;
void main() {
  float appear = smoothstep(vArc.z, vArc.z + .9, uTime);
  float pulse = smoothstep(.09, 0., abs(vArc.x - fract(uTime * .17 + vArc.y * 5.)));      // data travelling along the link
  gl_FragColor = vec4(vec3(.49, .97, 1.), (.24 + pulse) * sin(vArc.x * 3.1416) * appear * vFog);
}`;

const GROUND_V = /* glsl */ `
attribute vec3 position; attribute vec2 uv;
uniform mat4 modelViewMatrix, projectionMatrix; varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`;
const GLOW_F = /* glsl */ `
precision highp float; varying vec2 vUv; uniform float uTime;
void main() { float d = length(vUv); float a = pow(1. - smoothstep(0., 1., d), 2.) * smoothstep(0., 1.6, uTime); gl_FragColor = vec4(.04, .62, .6, a * .42); }`;
const GRID_V = /* glsl */ `
attribute vec3 position;
uniform mat4 modelViewMatrix, projectionMatrix; varying float vR;
void main() { vR = length(position.xz); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`;
const GRID_F = /* glsl */ `
precision highp float; varying float vR; uniform float uR;
void main() { gl_FragColor = vec4(.49, .97, 1., .13 * (1. - smoothstep(uR * .35, uR, vR))); }`;
const DOT_V = /* glsl */ `
attribute vec3 position; attribute vec2 aDot;
uniform mat4 modelViewMatrix, projectionMatrix; uniform float uTime, uDpr; varying float vA;
void main() {
  vA = (.45 + .55 * sin(uTime * 1.6 + aDot.x * 20.)) * smoothstep(aDot.y, aDot.y + .6, uTime);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); gl_PointSize = 7. * uDpr;
}`;
const DOT_F = /* glsl */ `
precision highp float; varying float vA;
void main() { float d = length(gl_PointCoord - .5); gl_FragColor = vec4(.75, 1., 1., smoothstep(.5, 0., d) * vA); }`;

// unit box: sides (with a shade per face) and edges
const SIDES = [
  { n: [0, 0, 1], c: [[-1, 0, 1], [1, 0, 1], [1, 1, 1], [-1, 1, 1]], shade: 1.0 },
  { n: [1, 0, 0], c: [[1, 0, 1], [1, 0, -1], [1, 1, -1], [1, 1, 1]], shade: 0.62 },
  { n: [0, 0, -1], c: [[1, 0, -1], [-1, 0, -1], [-1, 1, -1], [1, 1, -1]], shade: 0.8 },
  { n: [-1, 0, 0], c: [[-1, 0, -1], [-1, 0, 1], [-1, 1, 1], [-1, 1, -1]], shade: 0.5 },
  { n: [0, 1, 0], c: [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]], shade: 1.25 },
];
const CORNERS = [[-1, 0, -1], [1, 0, -1], [1, 0, 1], [-1, 0, 1], [-1, 1, -1], [1, 1, -1], [1, 1, 1], [-1, 1, 1]];
const EDGES = [[0, 1, 0], [1, 2, 0], [2, 3, 0], [3, 0, 0], [4, 5, 0], [5, 6, 0], [6, 7, 0], [7, 4, 0], [0, 4, 1], [1, 5, 1], [2, 6, 1], [3, 7, 1]];

let shared = null;   // { renderer, gl } — one WebGL context for the whole page

export function mountCity(host, { rtl = false, poster = false, pointer = null, beacon = false } = {}) {
  if (!shared) {
    const renderer = new Renderer({ dpr: 1, alpha: true, antialias: true, premultipliedAlpha: false, preserveDrawingBuffer: poster });
    shared = { renderer, gl: renderer.gl };
    shared.gl.clearColor(0, 0, 0, 0);
    shared.gl.enable(shared.gl.POLYGON_OFFSET_FILL); shared.gl.polygonOffset(1, 1);   // keeps edge lines crisp on top of faces
  }
  const { renderer, gl } = shared;
  host.appendChild(gl.canvas);

  const mobile = host.clientWidth < 760;
  renderer.dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
  const A0 = 0.62;                                             // starting orbit angle
  const { towers, links, radius } = buildCity({ radius: mobile ? 7.5 : 11 });
  const camera = new Camera(gl, { fov: 30, near: 0.5, far: 160 });
  const scene = new Transform();
  if (rtl) scene.scale.x = -1;                                 // mirrored city for right-to-left pages

  // growth delay: sweep across the screen from the reading-direction start (the mirror above flips it for RTL)
  const right = [Math.cos(A0), -Math.sin(A0)];
  const delayOf = (t) => 0.2 + ((t.x * right[0] + t.z * right[1]) / radius + 1) / 2 * 1.5 + t.seed * 0.35;

  // ---- geometry ----
  const fp = [], fl = [], fm = [], fu = [], ep = [], el = [], em = [];
  towers.forEach((t) => {
    const lot = [t.x, t.z, t.h, t.w], d = delayOf(t);
    SIDES.forEach((s) => {
      [[0, 1, 2], [0, 2, 3]].forEach((tri) => tri.forEach((k) => {
        const c = s.c[k];
        fp.push(...c); fl.push(...lot); fm.push(t.taper, t.seed, d, s.shade);
        fu.push(s.n[1] ? c[0] : (s.n[0] ? c[2] : c[0]));       // coordinate along the face, for the lit cells
      }));
    });
    EDGES.forEach(([a, b, vert]) => { [a, b].forEach((k) => { ep.push(...CORNERS[k]); el.push(...lot); em.push(t.taper, t.seed, d, vert); }); });
  });
  const uFog = { value: [20, 60] }, uTime = { value: 0 };
  const faces = new Mesh(gl, {
    geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array(fp) }, aLot: { size: 4, data: new Float32Array(fl) }, aMeta: { size: 4, data: new Float32Array(fm) }, aU: { size: 1, data: new Float32Array(fu) } }),
    program: new Program(gl, { vertex: FACE_V, fragment: FACE_F, transparent: true, cullFace: false, uniforms: { uTime, uFog } }),
  });
  const edges = new Mesh(gl, {
    mode: gl.LINES,
    geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array(ep) }, aLot: { size: 4, data: new Float32Array(el) }, aMeta: { size: 4, data: new Float32Array(em) } }),
    program: new Program(gl, { vertex: EDGE_V, fragment: EDGE_F, transparent: true, depthWrite: false, uniforms: { uTime, uFog } }),
  });
  edges.program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);

  // data arcs between tower tops
  const ap = [], aa = [], SEG = 22;
  links.forEach(([i, j], n) => {
    const a = towers[i], b = towers[j], lift = 1.6 + Math.hypot(a.x - b.x, a.z - b.z) * 0.32, d = Math.max(delayOf(a), delayOf(b)) + 1.2;
    const pt = (u) => [a.x + (b.x - a.x) * u, a.h + (b.h - a.h) * u + Math.sin(u * Math.PI) * lift, a.z + (b.z - a.z) * u];
    for (let s = 0; s < SEG; s++) { const u0 = s / SEG, u1 = (s + 1) / SEG; ap.push(...pt(u0), ...pt(u1)); aa.push(u0, n * 0.37 % 1, d, u1, n * 0.37 % 1, d); }
  });
  const arcs = new Mesh(gl, {
    mode: gl.LINES,
    geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array(ap) }, aArc: { size: 3, data: new Float32Array(aa) } }),
    program: new Program(gl, { vertex: ARC_V, fragment: ARC_F, transparent: true, depthWrite: false, uniforms: { uTime, uFog } }),
  });
  arcs.program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);

  // beacons on the landmark tops
  const dp = [], dd = [];
  towers.filter((t) => t.landmark).forEach((t) => { dp.push(t.x, t.h + 0.05, t.z); dd.push(t.seed, delayOf(t) + 1.3); });
  const dots = new Mesh(gl, {
    mode: gl.POINTS,
    geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array(dp) }, aDot: { size: 2, data: new Float32Array(dd) } }),
    program: new Program(gl, { vertex: DOT_V, fragment: DOT_F, transparent: true, depthTest: false, uniforms: { uTime, uDpr: { value: renderer.dpr } } }),
  });
  dots.program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);

  // ground: soft teal glow + fading grid
  const G = radius * 2.1;
  const glow = new Mesh(gl, {
    geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array([-G, 0, -G, G, 0, -G, G, 0, G, -G, 0, -G, G, 0, G, -G, 0, G]) }, uv: { size: 2, data: new Float32Array([-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1]) } }),
    program: new Program(gl, { vertex: GROUND_V, fragment: GLOW_F, transparent: true, depthTest: false, depthWrite: false, cullFace: false, uniforms: { uTime } }),
  });
  glow.program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
  const gp = [], GR = radius * 1.7;
  for (let v = -GR; v <= GR; v += 1.3) gp.push(v, 0, -GR, v, 0, GR, -GR, 0, v, GR, 0, v);
  const grid = new Mesh(gl, {
    mode: gl.LINES,
    geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array(gp) } }),
    program: new Program(gl, { vertex: GRID_V, fragment: GRID_F, transparent: true, depthTest: false, depthWrite: false, uniforms: { uR: { value: GR } } }),
  });
  grid.program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
  const layers = [glow, grid, faces, edges, arcs, dots];

  // beacon (Contact page): rings pulse out across the ground from the tallest landmark, and a beam rises from its top
  if (beacon) {
    const kafd = towers.filter((t) => t.landmark).sort((a, b) => b.h - a.h)[0];
    const rp = [], ro = [], SEGS = 72;
    [0, 0.5].forEach((off) => {
      for (let i = 0; i < SEGS; i++) {
        const a0 = (i / SEGS) * Math.PI * 2, a1 = ((i + 1) / SEGS) * Math.PI * 2;
        rp.push(Math.cos(a0), 0.02, Math.sin(a0), Math.cos(a1), 0.02, Math.sin(a1)); ro.push(off, off);
      }
    });
    const rings = new Mesh(gl, {
      mode: gl.LINES,
      geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array(rp) }, aOff: { size: 1, data: new Float32Array(ro) } }),
      program: new Program(gl, {
        vertex: `attribute vec3 position; attribute float aOff; uniform mat4 modelViewMatrix, projectionMatrix; uniform float uTime; uniform vec2 uC; varying float vA;
          void main() { float k = fract(uTime * .32 + aOff); vA = (1. - k) * smoothstep(2.2, 3.2, uTime);
            vec3 p = vec3(uC.x + position.x * (.8 + k * 5.5), position.y, uC.y + position.z * (.8 + k * 5.5)); gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.); }`,
        fragment: `precision highp float; varying float vA; void main() { gl_FragColor = vec4(.49, .97, 1., vA * .9); }`,
        transparent: true, depthTest: false, depthWrite: false, uniforms: { uTime, uC: { value: [kafd.x, kafd.z] } },
      }),
    });
    rings.program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    const beam = new Mesh(gl, {
      mode: gl.LINES,
      geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array([kafd.x, kafd.h, kafd.z, kafd.x, kafd.h + 9, kafd.z]) }, aY: { size: 1, data: new Float32Array([0, 1]) } }),
      program: new Program(gl, {
        vertex: 'attribute vec3 position; attribute float aY; uniform mat4 modelViewMatrix, projectionMatrix; varying float vY; void main() { vY = aY; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }',
        fragment: 'precision highp float; uniform float uTime; varying float vY; void main() { float a = (1. - vY) * (.55 + .45 * sin(uTime * 2.4)) * smoothstep(2.2, 3.2, uTime); gl_FragColor = vec4(.75, 1., 1., a); }',
        transparent: true, depthTest: false, depthWrite: false, uniforms: { uTime },
      }),
    });
    beam.program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    layers.push(rings, beam);
  }
  layers.forEach((m, i) => { m.renderOrder = i; m.setParent(scene); });

  // ---- camera framing: the city sits in the lower part of the frame, below the headline ----
  let dist = 30, targetY = 6;
  function resize() {
    const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h);
    const aspect = w / h;
    camera.perspective({ aspect });
    dist = Math.min(Math.max(radius * 1.25 / (aspect * 0.268), 30), 58);
    targetY = dist * 0.215;
    uFog.value = [dist - radius * 0.9, dist + radius * 2.4];
  }
  resize();
  addEventListener('resize', resize);

  const look = { x: 0, y: 0 };
  function render(e) {
    if (pointer && !poster) { look.x += ((pointer.active ? pointer.x : 0) - look.x) * 0.04; look.y += ((pointer.active ? pointer.y : 0) - look.y) * 0.04; }
    const a = (rtl ? -1 : 1) * (A0 + (poster ? 0 : e * 0.021) + look.x * 0.07);       // slow orbit + cursor parallax
    camera.position.set(Math.sin(a) * dist, targetY + dist * 0.045 + look.y * 0.9, Math.cos(a) * dist);
    camera.lookAt([0, targetY, 0]);
    uTime.value = e;
    renderer.render({ scene, camera });
  }

  if (poster) { render(9); return { canvas: gl.canvas, render }; }

  // rAF loop, paused when the host is off-screen or the tab is hidden
  let vis = true, raf = 0, t0 = null, live = false;
  const tick = (now) => {
    raf = 0; if (!vis || document.hidden) return;
    if (t0 === null) t0 = now;
    render((now - t0) / 1000);
    if (!live) { live = true; host.classList.add('is-live'); }
    raf = requestAnimationFrame(tick);
  };
  const wake = () => { if (!raf && vis && !document.hidden) raf = requestAnimationFrame(tick); };
  new IntersectionObserver((en) => { vis = en[0].isIntersecting; wake(); }, { rootMargin: '60px' }).observe(host);
  document.addEventListener('visibilitychange', wake);
  wake();
  return { canvas: gl.canvas, render };
}

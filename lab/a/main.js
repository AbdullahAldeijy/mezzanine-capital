// Direction A, "Signal Field": scattered signals -> skyline structure -> flowing capital streams.
import { $, $$, rtl, reduce, pointer, afterFirstPaint, runLoop, revealHeadline, magnetic, loadOGL, canAnimate } from '../shared.js';
import { structurePoints } from './skyline.js';

// Headline: characters decode in random order (Arabic: whole words). Only opacity/transform animate, so nothing reflows.
revealHeadline($('.a-title'), (gsap, parts) => gsap.timeline().from(parts, {
  opacity: 0, y: '0.18em', duration: 0.42, ease: 'power3.out', stagger: { amount: 0.3, from: 'random' },
}));
magnetic('.a-btn-primary, .lab-contact');

// ---- ecosystem network: hover / focus / tap selects an activity ----
const net = $('[data-net]');
if (net) {
  const nodes = $$('.a-node', net), items = $$('.a-item');
  const select = (i) => {
    nodes.forEach((n) => n.setAttribute('aria-pressed', String(n.dataset.i === i)));
    $$('.a-link, .a-flow', net).forEach((p) => p.classList.toggle('is-on', p.dataset.i === i));
    items.forEach((it) => it.classList.toggle('is-on', it.dataset.i === i));
  };
  nodes.forEach((n) => {
    n.addEventListener('click', () => select(n.dataset.i));
    n.addEventListener('focus', () => select(n.dataset.i));
    n.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') select(n.dataset.i); });
  });
  select('0');
}

// ---- hero signal field (WebGL, lazy) ----
const VERT = /* glsl */ `
attribute vec3 position;   // chaos position (x, y, depth)
attribute vec3 aGrid;      // structure target (x, y, kind)
attribute vec4 aRand;
uniform float uTime, uMorph, uAspect, uDpr, uDir, uScale;
uniform vec2 uMouse;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float t = uTime;
  vec2 chaos = position.xy + vec2(sin(t * .13 + aRand.x * 6.283), cos(t * .11 + aRand.y * 6.283)) * .06 * (.4 + position.z);
  vec2 grid = aGrid.xy + vec2(sin(t * 1.7 + aRand.z * 20.), cos(t * 1.3 + aRand.w * 20.)) * .0018;
  float lane = floor(aRand.x * 7.);
  float u = fract(aRand.z + t * (.03 + aRand.y * .05));
  float sx = (u * 2.4 - 1.2) * uDir;
  vec2 stream = vec2(sx, -.66 + lane * .1 + sin(sx * 2.6 + lane * 1.7 + t * .5) * .07 + (aRand.w - .5) * .03);
  float m1 = clamp(uMorph * 1.35 - aRand.w * .35, 0., 1.); m1 = m1 * m1 * (3. - 2. * m1);
  float m2 = clamp((uMorph - 1.) * 1.35 - aRand.x * .35, 0., 1.); m2 = m2 * m2 * (3. - 2. * m2);
  vec2 p = mix(mix(chaos, grid, m1), stream, m2);
  vec2 d = (p - uMouse) * vec2(uAspect, 1.);
  p += normalize(d + 1e-5) / vec2(uAspect, 1.) * .085 * exp(-dot(d, d) * 20.);
  gl_Position = vec4(p, 0., 1.);
  float kind = aGrid.z;
  float size = mix(.8 + position.z * 2.2, 1.2 + kind * 2.4, m1);
  gl_PointSize = mix(size, 1.1 + aRand.y * 1.6, m2) * uDpr * uScale;
  vColor = mix(vec3(.247, .816, .788), vec3(.5, .95, 1.), aRand.z);
  vColor = mix(vColor, vec3(.86, .98, 1.), m1 * kind * .45 * (1. - m2));
  vAlpha = mix(mix(.22 + position.z * .42, .34 + kind * .66, m1), .55, m2) * (.78 + .22 * sin(t * 2. + aRand.x * 40.));
}`;
const FRAG = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - .5);
  gl_FragColor = vec4(vColor, smoothstep(.5, .06, d) * vAlpha);
}`;

const field = $('.a-field'), hero = $('.a-hero');
if (field && canAnimate()) afterFirstPaint(async () => {
  const { Renderer, Program, Mesh, Geometry } = await loadOGL();
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio || 1, 2), alpha: true, antialias: false, premultipliedAlpha: false });
  const gl = renderer.gl;
  field.appendChild(gl.canvas);
  gl.clearColor(0, 0, 0, 0);

  const mobile = innerWidth < 760;
  const N = mobile ? 5200 : 13000;
  const chaos = new Float32Array(N * 3), grid = new Float32Array(N * 3), rand = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    chaos.set([Math.random() * 2.3 - 1.15, Math.random() * 2.3 - 1.15, Math.random()], i * 3);
    rand.set([Math.random(), Math.random(), Math.random(), Math.random()], i * 4);
  }
  const fillGrid = () => {
    const pts = structurePoints({ rtl, scale: innerWidth < 760 ? 0.62 : 1 });
    for (let i = 0; i < N; i++) {                         // spread particles over the sampled skyline (cycling, with jitter)
      const p = pts[Math.floor((i / N) * pts.length * 1.0) % pts.length];
      grid.set([p[0] + (Math.random() - .5) * .003, p[1] + (Math.random() - .5) * .003, p[2]], i * 3);
    }
  };
  fillGrid();
  const geometry = new Geometry(gl, { position: { size: 3, data: chaos }, aGrid: { size: 3, data: grid }, aRand: { size: 4, data: rand } });
  const program = new Program(gl, {
    vertex: VERT, fragment: FRAG, transparent: true, depthTest: false, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uMorph: { value: 0 }, uAspect: { value: 1 }, uDpr: { value: renderer.dpr }, uDir: { value: rtl ? -1 : 1 }, uScale: { value: mobile ? .9 : 1 }, uMouse: { value: [9, 9] } },
  });
  program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);               // additive: overlapping signals glow
  const mesh = new Mesh(gl, { mode: gl.POINTS, geometry, program });

  const resize = () => {
    const r = field.getBoundingClientRect();
    renderer.setSize(r.width, r.height);
    program.uniforms.uAspect.value = r.width / r.height;
  };
  resize();
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); fillGrid(); geometry.attributes.aGrid.needsUpdate = true; }, 200); });

  const mouse = [9, 9]; let start = null;
  runLoop(field, (t) => {
    if (start === null) { start = t; field.classList.add('is-live'); }
    const intro = Math.min((t - start) / 2.8, 1), eased = intro < .5 ? 2 * intro * intro : 1 - Math.pow(-2 * intro + 2, 2) / 2;
    const scroll = Math.min(Math.max(scrollY / (hero.offsetHeight * .8), 0), 1);
    program.uniforms.uMorph.value = eased + scroll;      // 0 chaos -> 1 structure (intro) -> 2 streams (scroll)
    // pointer -> canvas clip space (the canvas spans the hero, which scrolls away)
    const clientY = (1 - pointer.y) / 2 * innerHeight, heroTop = hero.getBoundingClientRect().top;
    const tx = pointer.active ? pointer.x : 9, ty = pointer.active ? 1 - 2 * (clientY - heroTop) / hero.offsetHeight : 9;
    mouse[0] += (tx - mouse[0]) * .08; mouse[1] += (ty - mouse[1]) * .08;
    program.uniforms.uMouse.value = mouse;
    program.uniforms.uTime.value = t;
    renderer.render({ scene: mesh });
  });
});

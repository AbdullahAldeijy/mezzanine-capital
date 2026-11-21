// Direction B, "Monolith": headline words rise out of their own baseline; a wireframe data city grows inside the slab.
import { $, $$, rtl, reduce, finePointer, pointer, afterFirstPaint, runLoop, revealHeadline, magnetic, spotlight, loadOGL, canAnimate } from '../shared.js';
import { lots, EDGES } from './city.js';

// each word is clipped at its own baseline and rises into view (both scripts animate whole words here)
revealHeadline($('.b-title'), (gsap, parts, split) => gsap.timeline().from(split.words, {
  yPercent: 105, duration: 0.62, ease: 'power4.out', stagger: 0.07,
}));
magnetic('.b-btn-primary, .lab-contact', 0.18);

// bento tiles: pointer spotlight + a few degrees of tilt (desktop pointers only)
$$('[data-tilt]').forEach((el) => {
  spotlight(el);
  if (!finePointer || reduce) return;
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
});

const VERT = /* glsl */ `
attribute vec3 position;   // unit-box corner (x,z in -1..1, y 0..1)
attribute vec4 aLot;       // lot x, lot z, height, width
attribute float aDelay;
uniform mat4 modelViewMatrix, projectionMatrix, modelMatrix;
uniform float uTime, uScan;
varying float vH, vScan, vFog;
void main() {
  float grow = smoothstep(aDelay, aDelay + 1.4, uTime);
  grow = 1. - pow(1. - grow, 3.);
  vec3 p = vec3(aLot.x + position.x * aLot.w, position.y * aLot.z * grow, aLot.y + position.z * aLot.w);
  vec4 world = modelMatrix * vec4(p, 1.);
  vH = position.y;
  vScan = exp(-pow(world.x - uScan, 2.) * 1.6);
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  vFog = smoothstep(34., 12., -mv.z);
  gl_Position = projectionMatrix * mv;
}`;
const FRAG = /* glsl */ `
precision mediump float;
varying float vH, vScan, vFog;
void main() {
  vec3 teal = vec3(0., .75, .7), ion = vec3(.34, .95, 1.);
  vec3 c = mix(teal, ion, vH) + vScan * vec3(.5, .6, .6);
  gl_FragColor = vec4(c, (.42 + vH * .5 + vScan * .55) * vFog);
}`;
const GRID_VERT = /* glsl */ `
attribute vec3 position;
uniform mat4 modelViewMatrix, projectionMatrix;
varying float vFog;
void main() { vec4 mv = modelViewMatrix * vec4(position, 1.); vFog = smoothstep(30., 8., -mv.z); gl_Position = projectionMatrix * mv; }`;
const GRID_FRAG = /* glsl */ `precision mediump float; varying float vFog; void main() { gl_FragColor = vec4(.34, .95, 1., .08 * vFog); }`;

const slab = $('.b-slab'), host = $('.b-city');
if (slab && canAnimate()) afterFirstPaint(async () => {
  const { Renderer, Camera, Transform, Program, Mesh, Geometry } = await loadOGL();
  const renderer = new Renderer({ dpr: Math.min(devicePixelRatio || 1, 2), alpha: true, antialias: true });
  const gl = renderer.gl;
  host.appendChild(gl.canvas);
  gl.clearColor(0, 0, 0, 0);
  const camera = new Camera(gl, { fov: 32, near: 0.1, far: 80 });
  const scene = new Transform();

  const L = lots(), pos = [], lot = [], delay = [];
  L.forEach((l) => {
    const dl = 0.15 + (l.x + 8) * 0.06 + l.d * 0.35;   // grows from the start side (the scene is mirrored in RTL)
    EDGES.forEach(([a, b]) => { pos.push(...a, ...b); lot.push(l.x, l.z, l.h, l.w, l.x, l.z, l.h, l.w); delay.push(dl, dl); });
  });
  const city = new Mesh(gl, {
    mode: gl.LINES,
    geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array(pos) }, aLot: { size: 4, data: new Float32Array(lot) }, aDelay: { size: 1, data: new Float32Array(delay) } }),
    program: new Program(gl, { vertex: VERT, fragment: FRAG, transparent: true, depthTest: false, uniforms: { uTime: { value: 0 }, uScan: { value: -20 } } }),
  });
  city.program.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
  const g = [];
  for (let i = -12; i <= 12; i++) { g.push(i, 0, -9, i, 0, 9); }
  for (let k = -9; k <= 9; k++) { g.push(-12, 0, k, 12, 0, k); }
  const grid = new Mesh(gl, { mode: gl.LINES, geometry: new Geometry(gl, { position: { size: 3, data: new Float32Array(g) } }),
    program: new Program(gl, { vertex: GRID_VERT, fragment: GRID_FRAG, transparent: true, depthTest: false }) });
  grid.setParent(scene); city.setParent(scene);
  if (rtl) scene.scale.x = -1;

  const resize = () => { const r = host.getBoundingClientRect(); renderer.setSize(r.width, r.height); camera.perspective({ aspect: r.width / r.height }); };
  resize(); addEventListener('resize', resize);

  let start = null; const look = { x: 0, y: 0 };
  runLoop(slab, (t) => {
    if (start === null) { start = t; slab.classList.add('is-live'); }
    const e = t - start;
    look.x += ((pointer.active ? pointer.x : 0) - look.x) * .05; look.y += ((pointer.active ? pointer.y : 0) - look.y) * .05;
    const a = (rtl ? -1 : 1) * (0.78 + Math.sin(e * 0.06) * 0.12 + look.x * 0.18), el = 9.5 + look.y * 2;
    camera.position.set(Math.sin(a) * 22, el, Math.cos(a) * 22);
    camera.lookAt([1.2 * (rtl ? -1 : 1), 1.6, 0]);
    city.program.uniforms.uTime.value = e;
    city.program.uniforms.uScan.value = ((e * 2.2) % 34) - 17;                      // an intelligence scan sweeps the city
    renderer.render({ scene, camera });
  });
});

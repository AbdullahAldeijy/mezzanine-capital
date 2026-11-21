// Direction C, "Capital Flow": a liquid-light flow field (fragment shader) + pinned value-chain pipeline.
import { $, $$, rtl, reduce, finePointer, pointer, afterFirstPaint, runLoop, revealHeadline, magnetic, spotlight, loadOGL, canAnimate } from '../shared.js';

revealHeadline($('.c-title'), (gsap, parts) => gsap.timeline().from(parts, {
  opacity: 0, filter: 'blur(12px)', y: 14, duration: 0.6, ease: 'power3.out', stagger: { amount: 0.18 },
}));
magnetic('.c-btn-primary, .lab-contact', 0.22);
const consoleSvg = $('.c-console-svg');
if (consoleSvg && reduce) consoleSvg.pauseAnimations();     // static console under reduced motion

// ---- value chain: scroll fills the rail step by step, then the loop returns from the Holding to the start ----
const chain = $('[data-chain]');
if (chain) {
  spotlight(chain);
  const track = $('.c-track', chain), steps = $$('.c-step', chain);
  const set = (p) => {
    track.style.setProperty('--p', p.toFixed(3));
    const lit = Math.min(steps.length, Math.floor((p / 0.82) * steps.length + 0.15));
    steps.forEach((s, i) => s.classList.toggle('is-on', i < lit || p > 0.98));
  };
  const gsap = window.gsap, ST = window.ScrollTrigger;
  if (reduce || !gsap || !ST) { set(1); }
  else {
    gsap.registerPlugin(ST);
    const desktop = matchMedia('(min-width: 901px)').matches;
    ST.create({
      trigger: chain, start: desktop ? 'top top' : 'top 70%', end: desktop ? '+=170%' : 'bottom 75%',
      pin: desktop ? '.c-chain-pin' : false, scrub: 0.6, onUpdate: (self) => set(self.progress),
    });
    set(0);
  }
}

// ---- hero flow field ----
const VERT = /* glsl */ `
attribute vec2 uv; attribute vec2 position; varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0., 1.); }`;
const FRAG = /* glsl */ `
precision highp float;
uniform float uTime, uDir; uniform vec2 uRes, uMouse; varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p), u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p) { float v = 0., a = .5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= .5; } return v; }
void main() {
  float asp = uRes.x / uRes.y;
  vec2 p = (vUv - .5) * vec2(asp, 1.) * 2.;
  float t = uTime * .07;
  vec2 q = vec2(fbm(p * 1.05 + vec2(-t * uDir * 2., 0.)), fbm(p * 1.05 + vec2(3.1, t)));
  vec2 m = uMouse * vec2(asp, 1.); vec2 dm = p - m;
  q += .45 * exp(-dot(dm, dm) * 1.8) * vec2(-dm.y, dm.x);          // the cursor bends the flow
  float f = fbm(p * vec2(.85, 2.1) + q * 1.7 + vec2(-t * uDir * 3., 0.));
  float l = abs(fract(f * 7.) - .5);
  float ridge = smoothstep(.055, 0., l), glow = smoothstep(.22, 0., l);
  float band = smoothstep(.25, .85, fbm(p * .55 + vec2(t, -t * .5)));
  vec3 night = vec3(.024, .055, .102), lagoon = vec3(.043, .165, .212), teal = vec3(.07, .88, .81), cyan = vec3(.49, .97, 1.);
  vec3 col = mix(night, lagoon, smoothstep(.25, .95, f) * .8);
  col += (ridge * mix(teal, cyan, band) * .95 + glow * teal * .22) * band;
  float centre = smoothstep(1.3, .1, length((vUv - vec2(.5, .48)) * vec2(asp * .9, 1.6)));
  col = mix(col, night, centre * .6);                               // keep the headline area calm
  gl_FragColor = vec4(col, 1.);
}`;

const flow = $('.c-flow'), hero = $('.c-hero');
if (flow && canAnimate()) afterFirstPaint(async () => {
  const { Renderer, Program, Mesh, Triangle } = await loadOGL();
  const dpr = Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1.25 : 1.5);   // full-screen shader: a lower DPR keeps it cheap
  const renderer = new Renderer({ dpr, alpha: false, antialias: false });
  const gl = renderer.gl;
  flow.appendChild(gl.canvas);
  const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms: { uTime: { value: 0 }, uDir: { value: rtl ? -1 : 1 }, uRes: { value: [1, 1] }, uMouse: { value: [9, 9] } } });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
  const resize = () => { const r = flow.getBoundingClientRect(); renderer.setSize(r.width, r.height); program.uniforms.uRes.value = [r.width, r.height]; };
  resize(); addEventListener('resize', resize);
  const m = [9, 9]; let last = -1, started = false;
  runLoop(flow, (t) => {
    if (t - last < 1 / 40) return;                                   // ~40fps is plenty for a slow flow
    last = t;
    if (!started) { started = true; flow.classList.add('is-live'); }
    const r = hero.getBoundingClientRect(), clientY = (1 - pointer.y) / 2 * innerHeight;
    const tx = pointer.active && finePointer ? pointer.x : 9, ty = pointer.active && finePointer ? 1 - 2 * (clientY - r.top) / r.height : 9;
    m[0] += (tx - m[0]) * .05; m[1] += (ty - m[1]) * .05;
    program.uniforms.uMouse.value = m;
    program.uniforms.uTime.value = t;
    renderer.render({ scene: mesh });
  });
});

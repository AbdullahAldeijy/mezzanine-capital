// Shared runtime for the lab prototypes (ES module). Everything degrades to a static page.
export const root = document.documentElement;
export const rtl = root.dir === 'rtl';
export const isAr = root.lang === 'ar';
export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
export const lowPower = (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 2 ||
  !!(navigator.connection && navigator.connection.saveData);
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

export function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}
// Run fn once the page has painted and the main thread is idle (keeps WebGL out of the critical path).
export function afterFirstPaint(fn) {
  const go = () => (window.requestIdleCallback ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 250));
  if (document.readyState === 'complete') go(); else addEventListener('load', go, { once: true });
}
// rAF loop that pauses when `el` is off-screen or the tab is hidden.
export function runLoop(el, frame) {
  let vis = true, raf = 0; const t0 = performance.now();
  const tick = (now) => { raf = 0; if (!vis || document.hidden) return; frame((now - t0) / 1000); raf = requestAnimationFrame(tick); };
  const wake = () => { if (!raf && vis && !document.hidden) raf = requestAnimationFrame(tick); };
  new IntersectionObserver((e) => { vis = e[0].isIntersecting; wake(); }, { rootMargin: '80px' }).observe(el);
  document.addEventListener('visibilitychange', wake);
  wake();
  return { wake };
}
// Pointer in normalized device coords (-1..1, y up); callers ease toward it.
export const pointer = { x: 0, y: 0, active: false };
addEventListener('pointermove', (e) => {
  pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = -((e.clientY / innerHeight) * 2 - 1); pointer.active = true;
}, { passive: true });

// Headline reveal. Arabic splits by WORDS ONLY (per-letter spans break Arabic letter joining).
// The h1 is hidden only while `.motion` is set; a CSS failsafe shows it at 1.2s whatever happens.
export function revealHeadline(el, build) {
  const show = () => { el.style.animation = 'none'; el.style.opacity = '1'; };
  const gsap = window.gsap, Split = window.SplitText;
  if (!el) return;
  if (reduce || !gsap || !Split) { show(); return; }
  gsap.registerPlugin(Split);
  let done = false;
  const play = () => {
    if (done) return; done = true; show();
    const split = Split.create(el, { type: isAr ? 'words' : 'words,chars', aria: 'auto', wordsClass: 'w', charsClass: 'c' });
    const tl = build(gsap, isAr ? split.words : split.chars, split);
    tl.eventCallback('onComplete', () => split.revert());
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
  setTimeout(play, 220);
}
export function magnetic(sel, k = 0.25) {
  const gsap = window.gsap;
  if (!finePointer || reduce || !gsap) return;
  $$(sel).forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * k); y((e.clientY - r.top - r.height / 2) * k * 1.3); });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}
// Writes --mx / --my (px) on el, for CSS spotlights.
export function spotlight(el) {
  if (!el || !finePointer || reduce) return;
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });
}
export function loadOGL() { return import('/vendor/ogl-1.0.11.min.mjs'); }
// Should the hero run its live scene? (motion allowed, WebGL present, not a low-power / data-saver device)
export const canAnimate = () => !reduce && !lowPower && webglOK();

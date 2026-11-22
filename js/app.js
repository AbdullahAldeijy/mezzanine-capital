// Mezzanine v2 runtime (ES module). Progressive: every page is complete and readable without it.
const root = document.documentElement;
const rtl = root.dir === 'rtl';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const lowPower = (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory || 8) <= 2 || !!(navigator.connection && navigator.connection.saveData);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// ---- mobile sheet menu ----
const menuBtn = $('#menu-btn'), sheet = $('#sheet');
if (menuBtn && sheet) {
  const setMenu = (open) => {
    sheet.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', menuBtn.dataset[open ? 'close' : 'open']);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  $$('a', sheet).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });
  addEventListener('resize', () => { if (innerWidth >= 1100) setMenu(false); });
}

// ---- sticky CTA bar: expose its height (so nothing is covered) and slide it in after the first scroll ----
const bar = $('#cta-bar'), toTop = $('#to-top');
const setBarH = () => root.style.setProperty('--cta-h', bar && bar.classList.contains('is-in') ? `${bar.offsetHeight}px` : '0px');
if (bar && 'ResizeObserver' in window) new ResizeObserver(setBarH).observe(bar);
if (toTop) toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

function onScroll() {
  const y = scrollY;
  if (bar && !bar.classList.contains('is-in') && (y > 80 || reduce)) { bar.classList.add('is-in'); setBarH(); }
  if (toTop) toTop.classList.toggle('is-visible', y > 700);
}

let ticking = false;
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; onScroll(); }); } }, { passive: true });
addEventListener('resize', onScroll);
onScroll();

// ---- dev only: ?fps shows a small frame meter (median fps and frame time over the last second) ----
if (new URLSearchParams(location.search).has('fps')) {
  const meter = document.createElement('div');
  meter.setAttribute('aria-hidden', 'true');
  meter.style.cssText = 'position:fixed;z-index:99;left:8px;bottom:8px;padding:6px 10px;border-radius:8px;background:#000c;color:#7CF7FF;font:12px/1.3 ui-monospace,monospace;direction:ltr;pointer-events:none';
  document.body.appendChild(meter);
  const d = new Float32Array(240); let n = 0, last = 0, shown = 0;
  const f = (t) => {
    if (last) { d[n % 240] = t - last; n++; }
    last = t;
    if (t - shown > 1000 && n > 10) {
      shown = t;
      const s = Array.from(d.subarray(0, Math.min(n, 240))).sort((a, b) => a - b), med = s[s.length >> 1], p95 = s[Math.floor(s.length * 0.95)];
      meter.textContent = `${(1000 / med).toFixed(0)} fps · median ${med.toFixed(1)} ms · p95 ${p95.toFixed(1)} ms`;
    }
    requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

// ---- entrance effects play ONCE; decorative loops play only briefly ----
// [data-reveal]: gets .is-in the first time it enters view (CSS transitions, transform/opacity only), never removed.
// [data-loop]:   gets .is-playing for a few seconds after it enters view (and again on hover / focus, in CSS); then
//                the loops inside it stop. Nothing animates while the page is idle.
const PLAY_MS = 4000;
if ('IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    const el = en.target;
    if (en.isIntersecting) {
      if (el.hasAttribute('data-reveal')) el.classList.add('is-in');
      if (el.hasAttribute('data-loop')) { el.classList.add('is-playing'); clearTimeout(el.__stop); el.__stop = setTimeout(() => el.classList.remove('is-playing'), PLAY_MS); }
    } else if (el.hasAttribute('data-loop')) { clearTimeout(el.__stop); el.classList.remove('is-playing'); }
  }), { threshold: 0.25 });
  $$('[data-reveal], [data-loop]').forEach((el) => io.observe(el));
} else {
  $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
}

// ---- magnetic primary buttons (desktop pointers only) ----
if (finePointer && !reduce) $$('[data-magnetic]').forEach((el) => {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px)`;
  });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
});

// ---- activities network: hover / focus / tap selects a node, lights its link and shows its details ----
$$('[data-net]').forEach((net) => {
  const scope = net.parentElement, nodes = $$('.net-node', net), items = $$('.net-item', scope);
  const select = (i) => {
    nodes.forEach((n) => n.setAttribute('aria-pressed', String(n.dataset.i === i)));
    $$('.net-wire, .net-flow', net).forEach((p) => p.classList.toggle('is-on', p.dataset.i === i));
    items.forEach((it) => it.classList.toggle('is-on', it.dataset.i === i));
  };
  nodes.forEach((n) => {
    n.addEventListener('click', () => select(n.dataset.i));
    n.addEventListener('focus', () => select(n.dataset.i));
    n.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') select(n.dataset.i); });
  });
  // /ecosystem/#finance etc.: open the activity named in the URL (links from Home point here)
  const fromHash = () => {
    const n = nodes.find((x) => x.dataset.id && `#${x.dataset.id}` === location.hash);
    if (!n) return false;
    select(n.dataset.i);
    net.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    return true;
  };
  if (!fromHash()) select('0');
  addEventListener('hashchange', fromHash);
});

// ---- Who We Serve orbit: hover / focus / tap reveals an audience's message in the centre ----
$$('[data-orbit]').forEach((orbit) => {
  const nodes = $$('.orbit-node', orbit), segs = $$('.seg', orbit.parentElement);
  const select = (i) => {
    nodes.forEach((n) => n.setAttribute('aria-pressed', String(n.dataset.i === i)));
    $$('.orbit-spoke', orbit).forEach((l) => l.classList.toggle('is-on', l.dataset.i === i));
    segs.forEach((s) => s.classList.toggle('is-on', s.dataset.i === i));
  };
  nodes.forEach((n) => {
    n.addEventListener('click', () => select(n.dataset.i));
    n.addEventListener('focus', () => select(n.dataset.i));
    n.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') select(n.dataset.i); });
  });
  // /who-we-serve/#investor etc. (links from Home): select it, or bring its card into view in the scroller
  const fromHash = () => {
    const n = nodes.find((x) => `#${x.dataset.id}` === location.hash);
    if (!n) return false;
    select(n.dataset.i);
    const seg = segs[+n.dataset.i];
    if (getComputedStyle(orbit).display === 'none') seg.scrollIntoView({ block: 'center', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
    else orbit.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
    return true;
  };
  if (!fromHash()) select('0');
  addEventListener('hashchange', fromHash);
});

// ---- the data city (WebGL): lazy, after first paint; static poster when it cannot or should not run ----
const pointer = { x: 0, y: 0, active: false };
if (finePointer) addEventListener('pointermove', (e) => { pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = -((e.clientY / innerHeight) * 2 - 1); pointer.active = true; }, { passive: true });
// WebGL present AND backed by a GPU: software renderers (SwiftShader, llvmpipe...) draw the city on the CPU,
// which would block the page for seconds, so they get the static poster instead.
// The live city is for desktop-class machines only: a fine pointer, a viewport at least 1024 px wide and 8+ cores.
// Phones, tablets, small screens and lighter laptops get the static poster (and never download the 3D code).
function desktopClass() {
  return matchMedia('(hover: hover) and (pointer: fine)').matches && !matchMedia('(any-pointer: coarse)').matches
    && innerWidth >= 1024 && (navigator.hardwareConcurrency || 0) >= 8;
}
function webglOK() {
  try {
    const c = document.createElement('canvas'), gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return false;
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const name = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    const lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
    // software renderers, and integrated / mobile GPUs, get the poster by default
    return !/swiftshader|llvmpipe|softpipe|software|basic render|intel|uhd|iris|mali|adreno|powervr|apple|vega|radeon\(tm\) graphics/i.test(name);
  } catch (e) { return false; }
}

const city = $('[data-city]');
if (city) {
  const q = new URLSearchParams(location.search);
  const posterMode = q.has('poster');                     // dev only: scripts/render-poster.mjs
  const forceLive = q.get('city') === 'live';             // dev only: run the live scene on software GL (headless tests)
  if (posterMode) {
    import('./scene.js').then(({ mountCity }) => {
      const { canvas } = mountCity(city, { rtl: false, poster: true });
      window.__cityPoster = () => canvas.toDataURL('image/png');
    });
  } else if (reduce || (!forceLive && (lowPower || !desktopClass() || !webglOK()))) {
    city.classList.add('is-static');
  } else {
    const toPoster = () => { city.classList.remove('is-live'); city.classList.add('is-static'); };
    const start = () => import('./scene.js').then(({ mountCity }) => mountCity(city, { rtl, pointer, beacon: city.hasAttribute('data-beacon'), onSlow: forceLive ? null : toPoster })).catch(toPoster);
    const idle = () => (window.requestIdleCallback ? requestIdleCallback(start, { timeout: 1200 }) : setTimeout(start, 200));
    if (document.readyState === 'complete') idle(); else addEventListener('load', idle, { once: true });
  }
}

(function () {
"use strict";
/* Core: mobile menu, scroll reveal, back-to-top, sticky-bar height */
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

// Mobile menu
var menuBtn = $('#menu-btn'), panel = $('#mobile-panel'), overlay = $('#mobile-overlay');
function setMenu(open) {
  panel.classList.toggle('is-open', open);
  overlay.classList.toggle('is-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (window.__lenis) window.__lenis[open ? 'stop' : 'start']();
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', menuBtn.getAttribute(open ? 'data-close' : 'data-open'));
}
menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
overlay.addEventListener('click', function () { setMenu(false); });
$$('a', panel).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && panel.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
});
window.addEventListener('resize', function () { if (window.innerWidth >= 1120) setMenu(false); });
document.documentElement.style.setProperty('--nav-h', ($('.site-nav .bar').offsetHeight || 68) + 'px');

// Scroll reveal (CSS does the animation; JS only toggles .in)
if ('IntersectionObserver' in window && !reduceMotion) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  $$('.rv').forEach(function (el) { io.observe(el); });
} else {
  $$('.rv').forEach(function (el) { el.classList.add('in'); });
}

// Back to top
var toTop = $('#to-top');
toTop.addEventListener('click', function () {
  if (window.__lenis) window.__lenis.scrollTo(0);            // smooth-scroll instance (desktop only), see 50-motion.js
  else window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

var ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(function () {
    toTop.classList.toggle('is-visible', window.scrollY > 700);
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);

// Keep content clear of the sticky CTA bar: expose its real height as --cta-h
var bar = $('#cta-bar');
if (bar) {
  var setH = function () { document.documentElement.style.setProperty('--cta-h', bar.offsetHeight + 'px'); };
  setH();
  window.addEventListener('resize', setH);
  if ('ResizeObserver' in window) new ResizeObserver(setH).observe(bar);
}

/* Motion layer: GSAP (+ ScrollTrigger / SplitText where the page loads them) and Lenis.
   Progressive: if GSAP is missing or the visitor prefers reduced motion, nothing here hides or moves content. */
(function () {
  var root = document.documentElement;
  var gsap = window.gsap, ST = window.ScrollTrigger, Split = window.SplitText;
  var isAr = root.lang === 'ar';
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Sticky CTA bar: slide up after the first scroll (CSS does the motion)
  var bar = $('#cta-bar');
  if (bar) {
    var showBar = function () { if (window.scrollY > 80) { bar.classList.add('is-in'); window.removeEventListener('scroll', showBar); } };
    window.addEventListener('scroll', showBar, { passive: true });
    showBar();
  }

  var title = $('.hero-title');
  function showTitle() { if (title) { title.style.animation = 'none'; title.style.opacity = '1'; } }

  if (reduceMotion || !gsap) { showTitle(); return; }

  if (ST) gsap.registerPlugin(ST);
  if (Split) gsap.registerPlugin(Split);
  gsap.defaults({ ease: 'power3.out' });

  // ---- Smooth scroll: desktop pointers only (native scrolling feels better on touch) ----
  if (finePointer) {
    var s = document.createElement('script');
    s.src = '/vendor/lenis-1.3.27.min.js';
    s.onload = function () {
      if (!window.Lenis) return;
      var lenis = new window.Lenis({ autoRaf: false, anchors: true, lerp: 0.11 });
      window.__lenis = lenis;                                   // used by back-to-top and the mobile menu
      if (ST) lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    };
    document.head.appendChild(s);
  }

  // ---- Hero headline: SplitText reveal, finished in < 800ms ----
  // English splits into words + chars. Arabic splits into WORDS ONLY: per-letter spans break Arabic letter joining.
  if (title && Split) {
    var played = false;
    var play = function () {
      if (played) return;
      played = true;
      showTitle();
      var split = Split.create(title, { type: isAr ? 'words' : 'words,chars', wordsClass: 'mz-w', charsClass: 'mz-c', aria: 'auto' });
      gsap.from(isAr ? split.words : split.chars, {
        y: '0.45em', opacity: 0, duration: 0.5, stagger: { amount: 0.26 },
        onComplete: function () { split.revert(); }             // restore the plain <h1> text once it has settled
      });
    };
    // wait for web fonts so the split measures the final glyphs, but never longer than 250ms
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
    setTimeout(play, 250);
  } else {
    showTitle();
  }

  // ---- KAFD image: gentle parallax inside its fixed frame ----
  var heroImg = $('.hero-img img');
  if (heroImg && ST) {
    gsap.set(heroImg, { scale: 1.12 });
    gsap.fromTo(heroImg, { yPercent: -4 }, { yPercent: 4, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  // ---- Magnetic primary buttons (desktop pointers only) ----
  if (finePointer) {
    $$('.btn-primary, .btn-light, .nav-cta').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      var yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.22);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
      });
      el.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
    });
  }
})();

/* Hero background: the footer's skyline line-art, drawn large in fine teal lines over a faint grid.
   It draws in once (in reading direction), then drifts very slowly. 2D canvas only, capped at ~30fps,
   paused when the hero is off-screen or the tab is hidden. Reduced motion: one static frame. */
(function () {
  var canvas = $('.hero-bg');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var rtl = document.documentElement.dir === 'rtl';
  var css = getComputedStyle(document.documentElement);
  var TEAL = (css.getPropertyValue('--teal-deep') || '#2C7478').trim();
  var INK = (css.getPropertyValue('--ink') || '#16233F').trim();
  var w = 0, h = 0, dpr = 1, layers = [], start = 0, visible = true, raf = 0, last = 0;

  // deterministic pseudo-random so the skyline is the same on every visit
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

  // one skyline = a polyline of flat-roofed blocks with the odd stepped tower, like the footer rule
  function skyline(seed, maxH, minW, maxW) {
    var r = rng(seed), pts = [], x = -60, base = h - 1;
    pts.push([x, base]);
    while (x < w + 60) {
      var bw = minW + r() * (maxW - minW), bh = (0.25 + r() * 0.75) * maxH, gap = r() < 0.35 ? 10 + r() * 26 : 0;
      pts.push([x, base - bh]);
      if (r() < 0.3) {                                   // stepped crown
        var inset = bw * 0.28, up = bh * 0.22;
        pts.push([x + inset, base - bh], [x + inset, base - bh - up], [x + bw - inset, base - bh - up], [x + bw - inset, base - bh]);
      }
      pts.push([x + bw, base - bh], [x + bw, base]);
      x += bw;
      if (gap) { pts.push([x + gap, base]); x += gap; }
    }
    var len = 0;
    for (var i = 1; i < pts.length; i++) len += Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]);
    return { pts: pts, len: len };
  }

  function resize() {
    var r = canvas.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = Math.round(r.width); h = Math.round(r.height);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    var tall = Math.min(h * 0.3, 210);
    layers = [
      { s: skyline(7, tall, 46, 120), alpha: 0.2, width: 1, drift: 9, speed: 0.045 },        // far
      { s: skyline(23, tall * 0.62, 28, 84), alpha: 0.42, width: 1.25, drift: 16, speed: 0.07 } // near
    ];
  }

  function draw(t) {
    var el = (t - start) / 1000;
    var p = reduceMotion ? 1 : Math.min(el / 1.9, 1);
    p = 1 - Math.pow(1 - p, 3);                           // ease-out
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (rtl) { ctx.translate(w, 0); ctx.scale(-1, 1); }   // mirror: draw-in and drift run right-to-left

    // faint drifting grid
    var step = 56, off = reduceMotion ? 0 : (el * 3) % step;
    ctx.strokeStyle = INK; ctx.globalAlpha = 0.045 * p; ctx.lineWidth = 1; ctx.beginPath();
    for (var x = -step + off; x < w + step; x += step) { ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, h); }
    for (var y = h - 0.5; y > 0; y -= step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();

    // skylines
    ctx.strokeStyle = TEAL; ctx.lineJoin = 'miter';
    layers.forEach(function (L) {
      var dx = reduceMotion ? 0 : Math.sin(el * L.speed) * L.drift;
      ctx.globalAlpha = L.alpha; ctx.lineWidth = L.width;
      ctx.setLineDash(p < 1 ? [L.s.len * p, L.s.len] : []);
      ctx.beginPath();
      L.s.pts.forEach(function (pt, i) { if (i) ctx.lineTo(pt[0] + dx, pt[1]); else ctx.moveTo(pt[0] + dx, pt[1]); });
      ctx.stroke();
    });
    ctx.setLineDash([]); ctx.globalAlpha = 1;
  }

  function loop(t) {
    raf = 0;
    if (!visible || document.hidden) return;              // paused: restarted by the observers below
    if (t - last > 32) { last = t; draw(t); }             // ~30fps is plenty for a slow drift
    raf = requestAnimationFrame(loop);
  }
  function wake() { if (!raf && visible && !document.hidden && !reduceMotion) raf = requestAnimationFrame(loop); }

  resize();
  start = performance.now();
  draw(start);
  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { resize(); draw(performance.now()); }, 150); });
  if (reduceMotion) return;                               // static frame only
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; wake(); }).observe(canvas);
  }
  document.addEventListener('visibilitychange', wake);
  wake();
})();

})();

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

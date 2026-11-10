/* Count-up for [data-count] when scrolled into view. Final value is already in the HTML,
   so no-JS and reduced-motion users see the real figures immediately. */
(function () {
  var els = $$('[data-count]');
  if (!els.length || reduceMotion || !('IntersectionObserver' in window)) return;
  function run(el) {
    var end = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var t0 = null, dur = 1300;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(frame);
    }
    el.textContent = (0).toFixed(dec);
    requestAnimationFrame(frame);
  }
  var io2 = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io2.unobserve(en.target); } });
  }, { threshold: 0.6 });
  els.forEach(function (el) { io2.observe(el); });
})();

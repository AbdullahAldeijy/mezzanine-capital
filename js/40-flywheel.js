/* Flywheel: gentle rotation tied to scroll position (CSS handles hover spin). */
(function () {
  var wheel = $('.flywheel-fig');
  if (!wheel || reduceMotion) return;
  var ring = $('.cy-spin', wheel);
  function turn() {
    var r = wheel.getBoundingClientRect(), vh = window.innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    var p = (vh - r.top) / (vh + r.height);           // 0 → 1 as it crosses the viewport
    ring.style.setProperty('--spin', (p * 120).toFixed(1) + 'deg');
  }
  window.addEventListener('scroll', function () { requestAnimationFrame(turn); }, { passive: true });
  turn();
})();

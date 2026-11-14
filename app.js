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
toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

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

})();

(function () {
"use strict";
/* Core: mobile menu, scroll reveal, scroll-spy, back-to-top */
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

// Scroll-spy: highlight the nav link of the section crossing the upper third of the viewport
var spyLinks = $$('[data-spy]');
var spyTargets = [];
spyLinks.forEach(function (a) {
  var el = document.getElementById(a.getAttribute('data-spy'));
  if (el && spyTargets.indexOf(el) < 0) spyTargets.push(el);
});
function updateSpy() {
  var line = window.innerHeight * 0.35, current = null;
  spyTargets.forEach(function (el) { if (el.getBoundingClientRect().top <= line) current = el.id; });
  spyLinks.forEach(function (a) {
    if (a.getAttribute('data-spy') === current) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  });
}

// Back to top
var toTop = $('#to-top');
toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

var ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(function () {
    updateSpy();
    toTop.classList.toggle('is-visible', window.scrollY > 700);
    ticking = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll);
updateSpy();

})();

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

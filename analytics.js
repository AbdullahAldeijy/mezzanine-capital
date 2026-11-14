/* Mezzanine — first-touch attribution, consent, optional GA4. Static-only, no dependencies.
   Exposes window.MZ = { track, attribution, fillForm }. */
(function () {
  'use strict';

  // GA4 ID comes from config/site.mjs (GA4_ID), which the build writes into <meta name="mz-ga4">.
  // While it is empty there is no meta tag: nothing loads and no consent banner is rendered.
  var meta = document.querySelector('meta[name="mz-ga4"]');
  var GA4_ID = meta ? meta.getAttribute('content') : '';

  var CONSENT_KEY = 'mz_consent', FIRST_KEY = 'mz_first_touch';
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } }
  };

  // ---- Source classification ----------------------------------------------
  var SEARCH = /(^|\.)(google|bing|duckduckgo|yahoo|yandex|baidu|ecosia|brave)\./i;
  var SOCIAL = /(^|\.)(facebook|instagram|twitter|x|t|youtube|youtu|tiktok|snapchat|whatsapp|telegram|reddit|pinterest)\.(com|co|be|me|org)$/i;
  var LINKEDIN = /(^|\.)(linkedin\.com|lnkd\.in)$/i;
  function hostOf(url) { try { return new URL(url).hostname; } catch (e) { return ''; } }
  function classify(utm, ref) {
    var m = (utm.utm_medium || '').toLowerCase(), s = (utm.utm_source || '').toLowerCase(), h = hostOf(ref);
    if (/^(cpc|ppc|paid|paidsearch|paid_social|paidsocial|display|cpm)$/.test(m)) return 'paid';
    if (s === 'linkedin' || LINKEDIN.test(h)) return 'linkedin';
    if (m === 'email' || s === 'email' || s === 'newsletter') return 'email';
    if (m === 'social' || SOCIAL.test(h) || /^(facebook|instagram|twitter|x|youtube|tiktok|snapchat|whatsapp|telegram)$/.test(s)) return 'social';
    if (m === 'organic' || SEARCH.test(h)) return 'search';
    if (h && h !== location.hostname) return 'referral';
    return 'direct';
  }

  // ---- First-touch capture --------------------------------------------------
  function capture() {
    var q = new URLSearchParams(location.search), utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) { utm[k] = (q.get(k) || '').slice(0, 200); });
    var ref = document.referrer && hostOf(document.referrer) !== location.hostname ? document.referrer : '';
    var ft = {
      landing_page: location.pathname, referrer: ref.slice(0, 300), source_type: classify(utm, ref), ts: new Date().toISOString()
    };
    for (var k in utm) ft[k] = utm[k];
    return ft;
  }
  // Lazy and currently UNUSED: nothing calls these while the site has no forms, so nothing is captured or stored.
  // Kept for the cloud-forms phase (call MZ.attribution() / MZ.fillForm(form) to start first-touch capture).
  var first = null;
  function attribution() {
    if (first) return first;
    try { first = JSON.parse(store.get(FIRST_KEY) || 'null'); } catch (e) { first = null; }
    if (!first) { first = capture(); store.set(FIRST_KEY, JSON.stringify(first)); }
    return first;
  }
  function fillForm(form) {
    var first = attribution();
    var data = {
      landing_page: first.landing_page, page_path: location.pathname, referrer: first.referrer, source_type: first.source_type,
      utm_source: first.utm_source, utm_medium: first.utm_medium, utm_campaign: first.utm_campaign,
      utm_content: first.utm_content, utm_term: first.utm_term, submitted_at: new Date().toISOString()
    };
    Object.keys(data).forEach(function (k) { var el = form.elements[k]; if (el) el.value = data[k] || ''; });
  }

  // ---- GA4 (only after consent) ---------------------------------------------
  var queue = [], gaReady = false;
  function loadGA() {
    if (!GA4_ID || gaReady) return;
    gaReady = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA4_ID);
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID);
    document.head.appendChild(s);
    queue.splice(0).forEach(function (e) { window.gtag('event', e[0], e[1]); });
  }
  function track(name, params) {
    params = params || {};
    if (gaReady) window.gtag('event', name, params);
    else if (GA4_ID && queue.length < 50) queue.push([name, params]);   // flushed if consent is granted later
  }

  // ---- Consent banner ---------------------------------------------------------
  function initConsent() {
    var box = document.getElementById('cookie'), c = store.get(CONSENT_KEY);
    if (c === 'granted') loadGA();
    if (!box || c) return;
    box.hidden = false;
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-consent]');
      if (!b) return;
      var v = b.getAttribute('data-consent');
      store.set(CONSENT_KEY, v);
      box.hidden = true;
      if (v === 'granted') loadGA(); else queue.length = 0;
    });
  }

  // ---- Declarative events ---------------------------------------------------------
  document.addEventListener('click', function (e) {
    var cta = e.target.closest('[data-cta]');
    if (cta) track('cta_click', { location: cta.getAttribute('data-cta'), label: (cta.textContent || '').trim().slice(0, 60) });
    var lang = e.target.closest('[data-lang-switch]');
    if (lang) track('lang_switch', { to: lang.getAttribute('data-lang-switch') });
  });

  window.MZ = { track: track, attribution: attribution, fillForm: fillForm };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initConsent); else initConsent();
})();

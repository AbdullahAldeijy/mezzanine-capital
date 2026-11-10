/* Contact: segment picker + per-segment Netlify forms (progressive enhancement).
   Without JS every form is visible and posts normally, landing on /thank-you/. */
(function () {
  var picker = $('.seg-picker');
  if (!picker) return;
  var MZ = window.MZ || { track: function () {}, fillForm: function () {} };
  var forms = $$('.seg-form'), radios = $$('input[name="seg"]', picker), done = $('#form-done');
  var MOBILE = /^(05\d{8}|\+9665\d{8})$/, MAX = 5 * 1024 * 1024;

  function show(key, opts) {
    var active = null;
    forms.forEach(function (f) { var on = f.getAttribute('data-segment') === key; f.classList.toggle('is-active', on); if (on) active = f; });
    radios.forEach(function (r) { r.checked = r.value === key; });
    if (!active) return;
    MZ.fillForm(active);
    if (opts && opts.track) MZ.track('segment_select', { segment: key });
    try { history.replaceState(null, '', location.pathname + '?segment=' + key); } catch (e) { /* ignore */ }
    if (opts && opts.scroll) active.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }
  radios.forEach(function (r) { r.addEventListener('change', function () { show(r.value, { track: true, scroll: true }); }); });
  var wanted = new URLSearchParams(location.search).get('segment');
  if (wanted && radios.some(function (r) { return r.value === wanted; })) show(wanted, { track: true });

  forms.forEach(function (form) {
    var seg = form.getAttribute('data-segment'), started = false, mobile = form.elements.mobile;

    form.addEventListener('focusin', function () { if (!started) { started = true; MZ.track('form_start', { segment: seg }); } });

    // Saudi mobile: 05XXXXXXXX or +9665XXXXXXXX (spaces / dashes are ignored)
    function checkMobile() {
      var v = mobile.value.replace(/[\s\-()]/g, '');
      mobile.setCustomValidity(v === '' || MOBILE.test(v) ? '' : form.getAttribute('data-bad-mobile'));
    }
    mobile.addEventListener('input', checkMobile);

    var file = form.elements.profile;
    if (file) file.addEventListener('change', function () {
      var f = file.files && file.files[0];
      file.setCustomValidity('');
      if (!f) return;
      if (!/\.(pdf|docx?)$/i.test(f.name)) file.setCustomValidity(form.getAttribute('data-bad-type'));
      else if (f.size > MAX) file.setCustomValidity(form.getAttribute('data-bad-size'));
      else MZ.track('file_attach', { segment: seg });
      if (!file.validity.valid) { file.reportValidity(); }
    });

    form.addEventListener('submit', function (e) {
      checkMobile();
      if (!window.fetch || !window.FormData) return;            // fall back to the normal POST
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      MZ.fillForm(form);
      mobile.value = mobile.value.replace(/[\s\-()]/g, '');
      var btn = $('.form-submit', form), err = $('.form-error', form), label = btn.textContent;
      err.hidden = true; btn.disabled = true; btn.textContent = form.getAttribute('data-sending');
      // multipart body (no Content-Type header: the browser sets the boundary) — Netlify accepts this for every form
      fetch('/', { method: 'POST', body: new FormData(form) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); })
        .then(function () {
          MZ.track('form_submit', { segment: seg });
          picker.hidden = true; $('#pick-title').hidden = true; $('#seg-panel').hidden = true; done.hidden = false; done.focus();
          done.scrollIntoView({ block: 'center' });
        })
        .catch(function () { err.textContent = form.getAttribute('data-error'); err.hidden = false; btn.disabled = false; btn.textContent = label; });
    });
  });
})();

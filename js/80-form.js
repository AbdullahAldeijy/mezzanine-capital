/* Contact form: progressive enhancement over Netlify Forms.
   Without JS the form posts normally and lands on /thank-you/ (or /ar/thank-you/). */
(function () {
  var form = $('#contact-form'), done = $('#form-done');
  if (!form) return;
  function showDone() {
    form.hidden = true; $('.form-title').hidden = true; done.hidden = false; done.focus();
  }
  if (/[?&]submitted=true/.test(location.search)) showDone();       // static thank-you state
  form.addEventListener('submit', function (e) {
    if (!window.fetch) return;                                       // fall back to normal POST
    e.preventDefault();
    var btn = $('.form-submit', form), err = $('.form-error', form), label = btn.textContent;
    err.hidden = true; btn.disabled = true; btn.textContent = form.getAttribute('data-sending');
    var body = new URLSearchParams(new FormData(form)).toString();
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
      .then(function (r) { if (!r.ok) throw new Error(r.status); showDone(); })
      .catch(function () { err.textContent = form.getAttribute('data-error'); err.hidden = false; btn.disabled = false; btn.textContent = label; });
  });
})();

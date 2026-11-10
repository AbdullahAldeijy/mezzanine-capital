const LINKEDIN = 'https://www.linkedin.com/company/mezzanineai';
const MAPS = 'https://www.google.com/maps/search/?api=1&query=King+Abdullah+Financial+District+Riyadh';
const ROLE_VALUES = ['Enterprise', 'Funder', 'Investor', 'Partner', 'Other']; // stable values sent to Netlify (labels are translated)

const ic = (d) => `<svg class="ci" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" aria-hidden="true">${d}</svg>`;
const P = (d) => `<path stroke-linecap="round" stroke-linejoin="round" d="${d}"/>`;

export default function contact(t, { esc, lang, path }) {
  const c = t.contact, f = c.form, i = t.site.contactInfo;
  const field = (id, label, input) => `<div class="field"><label for="${id}">${esc(label)}</label>${input}</div>`;
  return `
<section id="contact" class="section contact" aria-labelledby="contact-title">
  <div class="container">
    <div class="contact-grid">
      <div class="rv">
        <h2 id="contact-title" class="h2">${esc(c.title)}</h2>
        <p class="contact-ar" lang="ar" dir="rtl">${esc(c.arLine)}</p>
        <a href="#contact-form" class="btn btn-primary">${esc(c.cta)}</a>
        <ul class="contact-list">
          <li><a href="${LINKEDIN}" target="_blank" rel="noopener">${ic(P('M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8 10v7M8 7v.01M12 17v-4a2 2 0 014 0v4M12 10v7'))}<span>${esc(i.linkedin)}</span></a></li>
          <li><a href="mailto:${i.email}">${ic(P('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'))}<span>${i.email}</span></a></li>
          <li><a href="tel:+966544043103">${ic(P('M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'))}<span dir="ltr">${i.phone}</span></a></li>
          <li><a href="${MAPS}" target="_blank" rel="noopener">${ic(P('M15 10.5a3 3 0 11-6 0 3 3 0 016 0z') + P('M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'))}<span>${esc(i.address)}</span></a></li>
        </ul>
      </div>

      <div class="card form-card rv" style="--d:.1s">
        <h3 class="h3 form-title">${esc(f.heading)}</h3>
        <!-- Netlify Forms: detected at deploy time from this static markup (data-netlify). The hidden
             form-name and language inputs must stay in both / and /ar/ so submissions are recorded. -->
        <form id="contact-form" name="contact" method="POST" action="${path}thank-you/" data-netlify="true" data-netlify-honeypot="bot-field"
              data-sending="${esc(f.sending)}" data-error="${esc(f.error)}">
          <input type="hidden" name="form-name" value="contact">
          <input type="hidden" name="language" value="${lang}">
          <p class="hp" aria-hidden="true"><label>${esc(f.honeypot)} <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
          ${field('f-name', f.name, '<input id="f-name" name="name" type="text" autocomplete="name" required>')}
          ${field('f-company', f.company, '<input id="f-company" name="company" type="text" autocomplete="organization">')}
          ${field('f-email', f.email, '<input id="f-email" name="email" type="email" autocomplete="email" required dir="ltr">')}
          ${field('f-role', f.role, `<select id="f-role" name="role"><option value="">${esc(f.rolePlaceholder)}</option>${ROLE_VALUES.map((v, n) => `<option value="${v}">${esc(f.roles[n])}</option>`).join('')}</select>`)}
          ${field('f-message', f.message, '<textarea id="f-message" name="message" rows="5" required></textarea>')}
          <p class="form-error" role="alert" hidden></p>
          <button type="submit" class="btn btn-primary form-submit">${esc(f.submit)}</button>
        </form>
        <div class="form-done" id="form-done" role="status" tabindex="-1" hidden>
          <h3 class="h3">${esc(f.doneTitle)}</h3>
          <p>${esc(f.doneBody)}</p>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

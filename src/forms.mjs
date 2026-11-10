// Contact form schema: one Netlify form per segment (contact-<segment>).
// Labels live in i18n/<lang>/contact.mjs (fields.<segment>.<name>); option labels in options.<list>.
// Option VALUES below are stable English codes, so submissions sort cleanly regardless of site language.
const OPTIONS = {
  size: ['micro', 'small', 'medium'],
  entityType: ['bank', 'finance_company', 'fund', 'other'],
  cooperation: ['credit_assessment_data', 'financing_solutions', 'sukuk_investment', 'technology_integration', 'other'],
  investorType: ['individual', 'family_office', 'investment_institution', 'investment_fund', 'strategic_investor'],
  interestEnterprise: ['financing_solutions', 'conditional_credit', 'credit_assessment', 'working_capital', 'reports_analytics', 'other'],
  interestInvestor: ['impact_linked_sukuk', 'credit_portfolios', 'technology', 'other'],
  integration: ['api', 'data', 'commercial', 'marketing', 'other'],
};

// [name, kind, opts]  kind: text|number|url|select|textarea|file;  opts: { opt:true (optional), list, wide }
const person = [['contact_name', 'text'], ['job_title', 'text'], ['email', 'email'], ['mobile', 'tel']];
export const SCHEMA = {
  enterprise: [
    ['company_name', 'text'], ['cr_number', 'text'], ['activity', 'text'], ['city', 'text'],
    ['company_size', 'select', { list: 'size' }], ['years_operating', 'number'], ['website', 'url', { opt: true }],
    ...person, ['interest_area', 'select', { list: 'interestEnterprise' }], ['needs', 'textarea'],
  ],
  funder: [
    ['entity_name', 'text'], ['entity_type', 'select', { list: 'entityType' }], ['hq', 'text'], ['website', 'url'],
    ...person, ['cooperation_area', 'select', { list: 'cooperation' }], ['opportunity', 'textarea'], ['profile', 'file', { opt: true }],
  ],
  investor: [
    ['investor_name', 'text'], ['investor_type', 'select', { list: 'investorType' }], ['country', 'text'], ['website', 'url'],
    ...person, ['interest_area', 'select', { list: 'interestInvestor' }], ['investment_range', 'text', { opt: true }],
    ['about', 'textarea'], ['profile', 'file', { opt: true }],
  ],
  partner: [
    ['company_name', 'text'], ['contact_name', 'text'], ['job_title', 'text'], ['activity_type', 'text'], ['website', 'url'],
    ['email', 'email'], ['mobile', 'tel'], ['integration_type', 'select', { list: 'integration' }],
    ['description', 'textarea'], ['profile', 'file', { opt: true }],
  ],
  government: [
    ['entity_name', 'text'], ['sector', 'text'], ['department', 'text'],
    ...person, ['cooperation_area', 'select', { list: 'cooperation' }], ['initiative', 'textarea'], ['profile', 'file', { opt: true }],
  ],
};

// hidden tracking fields filled by analytics.js (segment/language/landing_page... are set at runtime or build time)
export const HIDDEN = ['landing_page', 'page_path', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'source_type', 'submitted_at'];

export function renderForm(t, { lang, esc, path }, segment, privacyHref) {
  const c = t.contact, u = c.ui, labels = c.fields[segment];
  const fields = SCHEMA[segment];
  const hasFile = fields.some(([, k]) => k === 'file');
  const id = (n) => `${segment}-${n}`;
  const lab = (n, opt) => `${esc(labels[n])}${opt ? ` <span class="opt">(${esc(u.optional)})</span>` : ' <span class="req" aria-hidden="true">*</span>'}`;
  const rows = fields.map(([n, kind, o = {}]) => {
    const req = o.opt ? '' : ' required';
    let input;
    if (kind === 'select') {
      input = `<select id="${id(n)}" name="${n}"${req}><option value="">${esc(u.select)}</option>${OPTIONS[o.list].map((v, i) => `<option value="${v}">${esc(c.options[o.list][i])}</option>`).join('')}</select>`;
    } else if (kind === 'textarea') {
      input = `<textarea id="${id(n)}" name="${n}" rows="4"${req}></textarea>`;
    } else if (kind === 'file') {
      input = `<input id="${id(n)}" name="${n}" type="file" accept=".pdf,.doc,.docx,application/pdf"><span class="hint">${esc(u.fileHint)}</span>`;
    } else if (kind === 'tel') {
      input = `<input id="${id(n)}" name="${n}" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="05XXXXXXXX" data-mobile${req}>`;
    } else if (kind === 'email') {
      input = `<input id="${id(n)}" name="${n}" type="email" autocomplete="email" dir="ltr"${req}>`;
    } else if (kind === 'url') {
      input = `<input id="${id(n)}" name="${n}" type="url" inputmode="url" dir="ltr" placeholder="https://"${req}>`;
    } else if (kind === 'number') {
      input = `<input id="${id(n)}" name="${n}" type="number" min="0" max="200" inputmode="numeric"${req}>`;
    } else {
      input = `<input id="${id(n)}" name="${n}" type="text"${req}>`;
    }
    const wide = kind === 'textarea' || kind === 'file' ? ' wide' : '';
    return `<div class="field${wide}"><label for="${id(n)}">${lab(n, o.opt)}</label>${input}</div>`;
  }).join('\n          ');
  const name = `contact-${segment}`;
  return `
    <form class="seg-form" id="form-${segment}" data-segment="${segment}" name="${name}" method="POST" action="${lang === 'ar' ? '/ar/thank-you/' : '/thank-you/'}"${hasFile ? ' enctype="multipart/form-data"' : ''}
          data-netlify="true" data-netlify-honeypot="bot-field" data-sending="${esc(u.sending)}" data-error="${esc(u.error)}"
          data-bad-mobile="${esc(u.badMobile)}" data-bad-size="${esc(u.badFileSize)}" data-bad-type="${esc(u.badFileType)}">
      <input type="hidden" name="form-name" value="${name}">
      <input type="hidden" name="segment" value="${segment}">
      <input type="hidden" name="language" value="${lang}">
      ${HIDDEN.map((h) => `<input type="hidden" name="${h}" value="">`).join('\n      ')}
      <p class="hp" aria-hidden="true"><label>${esc(u.honeypot)} <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
      <h3 class="h3 form-title">${esc(t.serve.segments.find((s) => s.key === segment).name)}</h3>
      <div class="fields">
          ${rows}
      </div>
      <label class="consent"><input type="checkbox" name="consent" value="yes" required> <span>${esc(u.consentPrefix)} <a href="${privacyHref}" target="_blank" rel="noopener">${esc(u.consentLink)}</a> <span class="req" aria-hidden="true">*</span></span></label>
      <p class="form-error" role="alert" hidden></p>
      <button type="submit" class="btn btn-primary form-submit">${esc(u.submit)}</button>
    </form>`;
}

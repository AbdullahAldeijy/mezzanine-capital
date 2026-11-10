# Approvals needed before launch

Tick each item once approved. Everything below is currently a **placeholder or default**.

## Brand / legal
- [ ] **Official company name.** The site uses "Mezzanine / ميزانين" everywhere (logo alt, titles, footer ©, JSON-LD).
      Search for `TODO(name-approval)` (i18n/*/site.mjs, src/shell.mjs). The logo image is the existing wordmark.
- [ ] **Privacy policy text.** `/privacy/` is a clearly marked DRAFT. Replace `i18n/*/privacy.mjs` and remove the draft note
      (`TODO(legal)`). Also confirm retention period, data sharing and who the data controller is.
- [ ] **Cookie banner wording** (i18n/*/site.mjs → `cookie`).

## Solutions
- [ ] **Solution statuses** — all four are "In development". Flip individually in `config/solutions.mjs`
      (`'available'` only after approval):
      credit-intelligence · conditional-credit · impact-sukuk · reports.
- [ ] Wording of the four solution cards (verbatim from the brief in Arabic; English is a translation).

## Forms
- [ ] **Select-option lists** (i18n/*/contact.mjs → `options`) — my proposals, not from the brief:
      enterprise size · institution type · investor type · area of cooperation · enterprise interest ·
      investor interest · integration type.
- [ ] **Which fields are required** (src/forms.mjs) — anything not marked "optional" in the brief is required.
- [ ] **Recipients** for each form's email notification (docs/LEADS_SETUP.md).
- [ ] The English labels of every form field.

## Copy and terms
- [ ] **English translations** of the whole site (Arabic is verbatim from the brief) — see TRANSLATION_NOTES.md,
      especially: «القابضة» → "The Holding", «الجدارة» → "Merit", «الصكوك» → "sukuk", «الأنشطة» → "activities".
- [ ] Text I wrote that is **not** in the brief: the ecosystem intro sentence («أربعة أنشطة تعمل معًا كمنظومة واحدة مترابطة»),
      the picker heading «اختر مسارك» (taken from the contact intro), button labels «اعرف المزيد عن ميزانين» /
      «تواصل معنا» on audience cards, form field/validation messages, cookie banner, privacy draft.
- [ ] **Value descriptions** for المعرفة / الذكاء / الجدارة — cards show names only; fill `values[].text` in
      i18n/*/about.mjs when ready.
- [ ] Footer/contact details kept from the previous site: info@mezzanine.sa · +966 54 404 3103 · KAFD 4.07 · LinkedIn.

## Analytics
- [ ] **GA4 Measurement ID** — set `GA4_ID` at the top of `analytics.js`. While empty nothing is loaded
      (the consent banner still appears; hide it if you prefer until GA4 is live).
- [ ] Confirm that storing first-touch source in the visitor's browser (localStorage) is covered by the final privacy text.

## Structure
- [ ] The sticky bar's "Explore collaboration opportunities" button points to `/who-we-serve/` until the Phase 2
      partnership page exists (`TODO(phase2)` in src/shell.mjs).
- [ ] Phase 2 pages (partnership opportunities, roadmap, team, insights & knowledge) are intentionally not built or linked.
- [ ] Arabic page canonicals are self-referencing (`/ar/...`), not pointing to the English page.

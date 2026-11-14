# Approvals needed before launch

Tick each item once approved. Everything below is currently a **placeholder or default**.

## Brand / legal
- [ ] **Official company name.** The site uses "Mezzanine / ميزانين" everywhere (logo alt, titles, footer ©, JSON-LD).
      Search for `TODO(name-approval)` (i18n/*/site.mjs, src/shell.mjs). The logo image is the existing wordmark.
- [ ] **Privacy policy text.** `/privacy/` is a clearly marked DRAFT (`TODO(legal)`), now written for a site with **no forms
      and no analytics**. Replace `i18n/*/privacy.mjs` and remove the draft note. Rewrite it when GA4 or forms are added.

## Solutions
- [ ] **Solution statuses** — all four are "In development". Flip individually in `config/solutions.mjs`
      (`'available'` only after approval): credit-intelligence · conditional-credit · impact-sukuk · reports.
- [ ] Wording of the four solution cards (Arabic verbatim from the brief; English is a translation).

## Contact
- [ ] **Contact details** kept from the previous site: info@mezzanine.sa · +966 54 404 3103 · KAFD 4.07, Riyadh · LinkedIn.
- [ ] **Social links** — only LinkedIn is set. Add X / Instagram / YouTube URLs in `config/site.mjs` (`SOCIAL`); each
      one with a URL appears automatically on `/contact/` and in the footer.
- [ ] `/contact/` meta description (my wording) and the card labels (Email / Phone / Address).
- [ ] The sticky bar is hidden on `/contact/` (it points there). All other pages show it, linking to `/contact/` and
      `/who-we-serve/`.

## Copy and terms
- [ ] **English translations** of the whole site (Arabic is verbatim from the brief) — see TRANSLATION_NOTES.md,
      especially «القابضة» → "The Holding", «الجدارة» → "Merit", «الصكوك» → "sukuk", «الأنشطة» → "activities".
- [ ] Text I wrote that is **not** in the brief: the ecosystem intro sentence («أربعة أنشطة تعمل معًا كمنظومة واحدة مترابطة»),
      the button label «اعرف المزيد عن ميزانين», the card labels on `/contact/`, cookie banner text, privacy draft.
- [ ] **Value descriptions** for المعرفة / الذكاء / الجدارة — cards show names only; fill `values[].text` in
      i18n/*/about.mjs when ready.

## Analytics
- [ ] **GA4 Measurement ID** — set `GA4_ID` in `config/site.mjs`. While empty: no analytics script and **no cookie banner**.
      Once set, the consent banner appears on every page and GA4 loads only after "Accept". Review the banner wording
      (i18n/*/site.mjs → `cookie`) and update the privacy text at that point.

## Structure
- [ ] The sticky bar's "Explore collaboration opportunities" button points to `/who-we-serve/` until the Phase 2
      partnership page exists (`TODO(phase2)` in src/shell.mjs).
- [ ] Phase 2 pages (partnership opportunities, roadmap, team, insights & knowledge) are intentionally not built or linked.
- [ ] Arabic page canonicals are self-referencing (`/ar/...`), not pointing to the English page.

## Deferred (cloud phase — nothing to approve now)
- Contact forms, lead storage, form option lists, required fields and recipients: see `docs/LEADS_SETUP.md`.

# Leads setup (Netlify Forms) — no backend required

The site has **five forms**, one per audience. Each is detected by Netlify at deploy time from the static HTML
(`/contact/` and `/ar/contact/` both contain all five; Arabic and English submissions land in the same form,
distinguished by the `language` field).

| Form name | Audience |
|---|---|
| `contact-enterprise` | Small & medium enterprises |
| `contact-funder` | Banks & funding institutions |
| `contact-investor` | Investors |
| `contact-partner` | Partners |
| `contact-government` | Government & institutional entities |

## 1. Enable form detection (once)
1. Netlify → select the site → **Site configuration** → **Forms**.
2. Under **Form detection**, click **Enable form detection** (if it says "Disable", it is already on).
3. Trigger a deploy (merge the PR or **Deploys → Trigger deploy**). After it finishes, **Forms → Active forms** should list
   the five forms above. If one is missing, check the deploy log's "Forms" section.
4. Submit each form once on the live/preview site to confirm it appears under **Submissions**.

## 2. Email notifications per form
Do this for **each** form so the right team receives its leads:
1. **Forms → Active forms →** *(form name)* **→ Settings & notifications → Form notifications → Add notification → Email notification**.
2. Event to listen for: **New form submission**. Form: *(that form)*.
3. Email to notify: the responsible team's address (e.g. SME team for `contact-enterprise`, partnerships for `contact-partner`).
4. Optional: set a custom subject, e.g. `[Mezzanine] New {{ form_name }} lead`, and add a **spam** review step in
   **Settings & notifications → Spam filters** (Akismet is available; the forms also have a honeypot field).
5. Repeat for the other four forms. Per-form recipients are decided by you — nothing is hard-coded in the site.

## 3. Export submissions to CSV
1. **Forms →** *(form name)* **→ Export CSV** (top right of the submissions list), or **Forms → Export all submissions**.
2. Columns include all the fields entered plus the tracking fields: `segment`, `language`, `landing_page`, `page_path`,
   `referrer`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `source_type`, `submitted_at`.
3. Uploaded files (profiles/letters) appear as download links in each submission; they are not inside the CSV.

Limits to be aware of: Netlify's free tier allows a limited number of submissions per month and file uploads up to
8 MB in total per submission (the site caps files at 5 MB). Check your plan on the **Forms** page.

## 4. Planned (Phase 2–3, not built): statuses and dashboard
Statuses for a future lead dashboard / CRM link:
**جديد · قيد المراجعة · تم التواصل · فرصة مؤهلة · قيد التفاوض · تم الاتفاق · مغلق**
(New · Under review · Contacted · Qualified opportunity · In negotiation · Agreed · Closed)

Planned dashboard fields:

| Field (AR) | Field (EN) | Source |
|---|---|---|
| اسم الجهة | Entity name | form (`company_name` / `entity_name` / `investor_name`) |
| الشريحة | Segment | `segment` |
| مجال الاهتمام | Area of interest | `interest_area` / `cooperation_area` / `integration_type` |
| تاريخ الطلب | Request date | `submitted_at` |
| مصدر الطلب | Request source | `source_type` + `utm_*` |
| المسؤول | Owner | assigned internally |
| الحالة | Status | internal (list above) |
| الإجراء التالي | Next action | internal |

Until then, a shared spreadsheet fed by the CSV export (or Netlify's Zapier/webhook notifications) is enough.

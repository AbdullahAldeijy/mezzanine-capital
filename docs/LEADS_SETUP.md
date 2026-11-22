# Leads setup — DEFERRED to the cloud phase

**Status: there are no forms on the site right now.** The five Netlify forms, the segment picker, the form JavaScript,
the file/mobile validation, the hidden tracking fields and the `/thank-you/` pages were removed (they remain in git
history, see PR #1). `/contact/` shows contact cards only (email, phone, LinkedIn, address, plus any social links set in
`config/site.mjs`).

Forms will return on Mezzanine's own cloud with a real database, so there is nothing to enable in Netlify
(no form detection, no notifications, no CSV export). Everything below is the **plan to carry over** to that phase.

## Planned segments (one form each) and fields — from the website brief
| Segment | Fields |
|---|---|
| Enterprise (المنشآت) | اسم المنشأة، السجل التجاري، النشاط، المدينة، حجم المنشأة، سنوات التشغيل، الموقع الإلكتروني (اختياري)، اسم المسؤول، المسمى، البريد، الجوال، مجال الاهتمام، وصف الاحتياج |
| Funder (الجهات التمويلية) | اسم الجهة، نوعها، مقرها، موقعها، ممثل الجهة وبياناته (الاسم، المسمى، البريد، الجوال)، مجال التعاون، وصف الفرصة، ملف تعريفي (اختياري) |
| Investor (المستثمرون) | اسم المستثمر أو المؤسسة، نوع المستثمر، الدولة، الموقع، ممثل الجهة وبياناته، مجال الاهتمام، نطاق الاستثمار المتوقع (اختياري)، نبذة، ملف تعريفي (اختياري) |
| Partner (الشركاء) | اسم الشركة والمسؤول، نوع النشاط، الموقع، بيانات التواصل، نوع التكامل أو مجال التعاون، وصف الحل أو الفرصة، ملف (اختياري) |
| Government & institutional (الجهات الحكومية والمؤسسية) | اسم الجهة والقطاع والإدارة، ممثل الجهة وبياناته، مجال التعاون، وصف المبادرة، خطاب أو ملف تعريفي (اختياري) |

Rules to keep: Saudi mobile validation (`05XXXXXXXX` or `+9665XXXXXXXX`), required privacy-consent checkbox, files
PDF/DOC/DOCX ≤ 5 MB, honeypot/spam protection, the verbatim thank-you message
(«شكراً لاهتمامك بميزانين، تم استلام طلبك، وسيقوم الفريق المختص بمراجعته والتواصل معك بشأن الخطوة التالية.»),
and the "Who we serve" buttons preselecting the segment.

## Planned tracking fields (sent with every submission)
`segment`, `language`, `landing_page`, `page_path`, `referrer`, `utm_source`, `utm_medium`, `utm_campaign`,
`utm_content`, `utm_term`, `source_type`, `submitted_at`.

`analytics.js` still contains the first-touch capture and source classification (`MZ.attribution()`, `MZ.fillForm(form)`),
but it is **dormant**: nothing calls it, so nothing is captured or stored today. See `docs/UTM_GUIDE.md`.

## Planned statuses and dashboard
Statuses: **جديد · قيد المراجعة · تم التواصل · فرصة مؤهلة · قيد التفاوض · تم الاتفاق · مغلق**
(New · Under review · Contacted · Qualified opportunity · In negotiation · Agreed · Closed)

| Field (AR) | Field (EN) | Source |
|---|---|---|
| اسم الجهة | Entity name | form (entity / company / investor name) |
| الشريحة | Segment | `segment` |
| مجال الاهتمام | Area of interest | interest / cooperation / integration field |
| تاريخ الطلب | Request date | `submitted_at` |
| مصدر الطلب | Request source | `source_type` + `utm_*` |
| المسؤول | Owner | assigned internally |
| الحالة | Status | internal (list above) |
| الإجراء التالي | Next action | internal |

## Until then
Enquiries arrive by email (info@mezzanine.sa), phone or LinkedIn. Tag any links you share with UTM parameters anyway
(`docs/UTM_GUIDE.md`) so campaigns are comparable once analytics/forms are live.

# Translation notes — for review

**Arabic** is verbatim from the official Website Development Brief wherever the brief provides copy.
**English** is my translation (formal, plain business English). Text that is *not* in the brief is listed in the last section.

## Terms to confirm
| Arabic | English used | Question |
|---|---|---|
| ذكاء الائتمان التجاري | Commercial Credit Intelligence | "Trade credit intelligence" is also possible; "commercial credit" chosen to match "التجاري" in the vision |
| منظومة | ecosystem | Consistent throughout ("منظومتنا" → "Our Ecosystem") |
| الأنشطة الأربعة | the four activities | Deliberately *not* "subsidiaries/companies" per the brief |
| القابضة | The Holding | Reads as "the holding company"; confirm you want it shown publicly while the entity is not yet named |
| الجدارة (value) | Merit | Alternatives: "Competence", "Worthiness", "Creditworthiness" (الجدارة also means creditworthiness in «الجدارة الائتمانية», translated "creditworthiness" in the solutions card) |
| المعرفة / الذكاء (values) | Knowledge / Intelligence | |
| الصكوك المرتبطة بالأثر | Impact-Linked Sukuk | "sukuk" kept transliterated |
| خطوط الائتمان المشروطة | Conditional Credit Lines | |
| الذكاء والتقييم الائتماني | Credit Intelligence and Assessment | |
| الجهات التمويلية / الممولين | funding institutions / funders | Used both ("Banks and Funding Institutions" for the card; "funders" in running text) |
| الجهات الحكومية والمؤسسية | Government and Institutional Entities | |
| المنشآت الصغيرة والمتوسطة | small and medium enterprises (SMEs) | |
| قيد التطوير / متاح | In development / Available | |
| استقطاب | attracting | Alternatives "acquiring" / "onboarding" |
| تحصيل | collection | |
| إدارة الخزينة | treasury management | |
| وفق النموذج المعتمد | according to the approved model | |
| السجل التجاري | Commercial registration no. | Label in the enterprise form |
| ملف تعريفي | Company profile | File-upload label; the government form says «خطاب أو ملف تعريفي» → "Letter or company profile" |
| Name | «Mezzanine / ميزانين» used in both languages | Official name pending (`TODO(name-approval)`) |

## Form option lists (my proposals — please approve; Arabic ↔ English)
- حجم المنشأة: متناهية الصغر / صغيرة / متوسطة ↔ Micro / Small / Medium
- نوع الجهة: بنك / شركة تمويل / صندوق / أخرى ↔ Bank / Finance company / Fund / Other
- نوع المستثمر: فرد / مكتب عائلي / مؤسسة استثمارية / صندوق استثمار / مستثمر استراتيجي ↔ Individual / Family office / Investment institution / Investment fund / Strategic investor
- مجال التعاون (جهات تمويلية وحكومية): التقييم والبيانات الائتمانية / الحلول التمويلية / الصكوك والاستثمار / التقنية والتكامل / أخرى
- مجال اهتمام المنشأة: حلول التمويل / الائتمان المشروط / التقييم الائتماني / رأس المال العامل / التقارير والتحليلات / أخرى
- مجال اهتمام المستثمر: الصكوك المرتبطة بالأثر / المحافظ الائتمانية / التقنية / أخرى
- نوع التكامل (الشركاء): تكامل عبر واجهات API / تكامل البيانات / تكامل تجاري / تكامل تسويقي / أخرى

Submitted *values* are stable English codes (e.g. `financing_solutions`), so labels can change without breaking reports.

## Text I wrote that is not in the brief (Arabic + English)
- Ecosystem intro: «أربعة أنشطة تعمل معًا كمنظومة واحدة مترابطة.» / "Four activities working together as one connected ecosystem."
- Button labels: «اعرف المزيد عن ميزانين» (home → About), «تواصل معنا» on audience cards
- Contact: «اختر مسارك» (from the intro sentence), all field labels not named in the brief, validation messages, consent text, file hint
- Cookie banner and the privacy-policy draft (`/privacy/`)
- Meta titles/descriptions for inner pages; image alt text; nav ARIA labels

## Notes
- Western digits (0–9) are used in Arabic, e.g. «05XXXXXXXX», «+966…».
- Mobile format hint: 05XXXXXXXX or +9665XXXXXXXX.
- The Arabic page canonical points to `/ar/…` (self-referencing) so it can be indexed; `hreflang` links the pairs.

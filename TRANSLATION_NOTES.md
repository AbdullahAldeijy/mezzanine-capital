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
| Name | «Mezzanine / ميزانين» used in both languages | Official name pending (`TODO(name-approval)`) |

## Text I wrote that is not in the brief (Arabic + English)
- Ecosystem intro: «أربعة أنشطة تعمل معًا كمنظومة واحدة مترابطة.» / "Four activities working together as one connected ecosystem."
- Button label «اعرف المزيد عن ميزانين» / "Learn more about Mezzanine" (home → About); «تواصل معنا» on audience cards
- Contact: card labels (البريد الإلكتروني / الهاتف / العنوان) and the meta description; social labels (إكس (X), إنستغرام, يوتيوب)
- Cookie banner (only rendered once a GA4 ID is set) and the privacy-policy draft (`/privacy/`)
- Meta titles/descriptions for inner pages; image alt text; nav ARIA labels

*Contact forms (field labels, option lists, validation messages, thank-you text) were removed in this phase; the previous
translations are in git history and the planned fields in `docs/LEADS_SETUP.md`.*

## Notes
- Western digits (0–9) are used in Arabic, e.g. «05XXXXXXXX», «+966…».
- The Arabic page canonical points to `/ar/…` (self-referencing) so it can be indexed; `hreflang` links the pairs.

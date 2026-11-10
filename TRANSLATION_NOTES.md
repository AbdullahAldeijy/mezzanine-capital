# Translation notes (Arabic) — for review

All Arabic copy lives in `i18n/ar/*.mjs`. Formal MSA, financial tone. The two Arabic lines from the brief are used verbatim (`hero.arLine`, `contact.arLine`).
Digits are kept Western (11.3%, 2030) to match the source figures; switch to Arabic-Indic digits if you prefer.

## Terms I'm not fully sure of (please confirm)

| English | Arabic used | Question |
|---|---|---|
| Sukuk / Impact-linked sukuk | صكوك / صكوك مرتبطة بالأثر | Standard term; confirm "مرتبطة بالأثر" vs "مرتبطة بالأثر المستدام" |
| Information asymmetry | عدم تماثل المعلومات | Standard economics term; alternative: "تباين المعلومات" |
| Financeability | القابلية للتمويل | No single established term; alternative "الأهلية للتمويل" |
| Gray → Green conversion | التحوّل من «الرمادي» إلى «الأخضر» | **Product jargon** — I don't know what gray/green mean in your scoring model. Needs your definition (e.g. unscored → scored?) |
| Cost of funds (COF) / Cash cycle (CCC) | تكلفة التمويل (COF) / دورة تحويل النقد (CCC) | Acronyms kept in Latin; diagram label shortened to "دورة النقد" |
| Platform flywheel | عجلة زخم المنصة | "Flywheel" has no exact Arabic equivalent; alternatives "عجلة النمو", "دولاب الزخم" |
| Control (Funders impact) | الرقابة والتحكم | Brief says "Control ↑"; this is "oversight + control" — confirm it reads as positive for funders |
| Policy / covenant adherence | الالتزام بالسياسات والتعهدات | "Covenant" → "تعهدات" (loan-covenant sense); alternative "الشروط التعاقدية" |
| Delinquency & loss outcomes | نتائج التعثر والخسائر | "التعثر" = default/distress; "delinquency" strictly = late payment ("التأخر في السداد") |
| Backtesting | الاختبار الرجعي | Also seen as "الاختبار على البيانات التاريخية" |
| Outcome labeling | توصيف النتائج | ML sense (labelling outcomes); alternative "وسم النتائج" |
| Open-banking licensing | ترخيص الصيرفة المفتوحة | SAMA's own Arabic term may differ — check the SAMA announcement wording |
| SAMA | البنك المركزي السعودي (ساما) | Fine, confirm preferred form |
| Credit pool (3.3T SAR) | حجم الائتمان المصرفي | "pool" rendered as "حجم" (size) |
| Policy flex ("flex policy for them") | تطويع السياسات لصالحها | Idiomatic; check meaning is as intended |
| Pilot | التجربة الرائدة | Alternatives "التجربة التجريبية" / "المشروع التجريبي"; used in the CTA "ابنِ التجربة الرائدة معنا" |
| Scale-up | التوسّع | |
| Mezzanine AI | ميزانين AI | Kept from existing site |
| Subsidiary names | ميزانين التقنية / المالية / الاستثمارية / التسويقية | Kept from existing site |
| Page headline | نربط المنشآت السعودية الصغيرة والمتوسطة بالفرص ورأس المال | My translation of the H1; the verbatim Arabic line from the brief appears beneath it |

## Notes
- "SMEs" is translated as «المنشآت الصغيرة والمتوسطة»; the brief's own Arabic line uses the shorter «المنشآت».
- The Arabic page canonical points to `/ar/` (not `/`) so it can be indexed; `hreflang` links the two.

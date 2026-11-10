# UTM guide — tagging links so every lead shows where it came from

The site records the **first** visit's source in the visitor's browser and attaches it to any form they submit
(`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `referrer`, `landing_page`, `source_type`).
Untagged visits are still classified from the referrer (search, linkedin, social, email, referral, direct), but
**tagged links are far more reliable** — always tag links you post yourself.

## Build a link
```
https://mezzanine.sa/?utm_source=linkedin&utm_medium=social&utm_campaign=launch-2026-q1&utm_content=post-ceo
```
Point it at the page you want people to land on (e.g. `/who-we-serve/` or `/ar/contact/?segment=funder`):
```
https://mezzanine.sa/contact/?segment=funder&utm_source=linkedin&utm_medium=social&utm_campaign=funders-intro
```

## Naming convention
Lowercase, hyphens, no spaces, no Arabic characters in values (keeps reports clean).

| Parameter | Meaning | Examples |
|---|---|---|
| `utm_source` | Where the link lives | `linkedin`, `x`, `newsletter`, `whatsapp`, `event-riyadh`, `google` |
| `utm_medium` | Type of channel | `social`, `email`, `cpc` (paid search), `paid-social`, `referral`, `qr` |
| `utm_campaign` | The initiative: `<topic>-<yyyy>-<q>` | `launch-2026-q1`, `funders-intro`, `sme-webinar` |
| `utm_content` | Which variation (optional) | `post-ceo`, `banner-a`, `ar`, `en` |
| `utm_term` | Paid keyword (optional) | `trade-credit` |

## How `source_type` is decided
1. `utm_medium` is `cpc`, `ppc`, `paid`, `paid-social`, `display` or `cpm` → **paid**
2. `utm_source=linkedin` or the referrer is linkedin.com / lnkd.in → **linkedin**
3. `utm_medium=email` or `utm_source=email|newsletter` → **email**
4. `utm_medium=social` or a social referrer (Facebook, Instagram, X, YouTube, TikTok, Snapchat, WhatsApp, Telegram…) → **social**
5. `utm_medium=organic` or a search-engine referrer → **search**
6. any other referrer → **referral**; no referrer → **direct**

Tip: tag LinkedIn posts with `utm_medium=social`, and LinkedIn *ads* with `utm_medium=paid-social` — the paid rule wins.

## Where it shows up
- **Netlify Forms:** every submission has these fields (Site → Forms → open a form).
- **GA4** (once the ID is added and the visitor accepts cookies): standard UTM reports, plus the custom events
  `cta_click`, `segment_select`, `form_start`, `form_submit`, `file_attach`, `lang_switch`.

## Notes
- First touch is stored in the browser (`localStorage`). A returning visitor keeps their original source; to test
  a new tag, use a private window or clear site data.
- Don't put personal data in UTM values — they are visible in URLs and stored with the lead.

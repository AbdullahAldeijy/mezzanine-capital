// Site-wide settings. Edit here; then run `node scripts/build.mjs`.

// Social profiles. Only entries with a URL are shown (footer + /contact/). Leave '' to hide.
export const SOCIAL = {
  linkedin: 'https://www.linkedin.com/company/mezzanineai',
  x: '',
  instagram: '',
  youtube: '',
};

// GA4 Measurement ID (G-XXXXXXXXXX). While empty: no analytics script, no cookie banner.
// Setting it renders the consent banner on every page and loads GA4 only after the visitor accepts.
export const GA4_ID = '';

// WhatsApp: the phone number on /contact/, in the footer and in the sticky bar opens a WhatsApp chat
// (https://wa.me/<number>?text=<message>) with this message prefilled in the page's language.
// number: international format, digits only (no +, spaces or leading zeros).
export const WHATSAPP = {
  number: '966544043103',
  message: {
    ar: 'السلام عليكم، أتواصل معكم من موقع ميزانين وأرغب في الاستفسار عن خدماتكم.',
    en: "Hello, I'm reaching out from the Mezzanine website and would like to learn more about your services.",
  },
};

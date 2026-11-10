export default {
  title: 'The Opportunity',
  stats: {
    sme: { value: '11.3', unit: '%', label: 'Share of total Saudi bank loans that went to SMEs in 2025' },
    target: { value: '20', unit: '%', label: '2030 national target' },
    gap: { value: '8.7', unit: ' pts', label: 'still to close' },
    meter: 'SME share of bank loans, 11.3%, against the 20% target',
    market: { value: '3.3', unit: 'T SAR', label: 'Saudi bank-credit pool (2025)' },
    contextTag: 'Market context',
  },
  footnote: 'This is a target gap, not a direct measure of unmet credit demand.',
  whyNow: {
    title: 'Why now',
    items: [
      { when: 'Q4 2025', what: 'SME bank-credit share reaches 11.3%' },
      { when: 'March 2026', what: 'Open-banking licensing begins' },
      { when: '2030', what: '20% national target' },
    ],
    line: 'Data availability and regulated connectivity are improving just as financing ambition rises.',
  },
  sources: 'Sources: Vision 2030 Annual Report 2025; SAMA Open Banking licensing announcement (Mar 2026); SAMA monthly banking data.',
};

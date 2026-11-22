// How We Work: the value chain as a pipeline pinned while you scroll. The rail fills step by step,
// then a loop returns from the last step («القابضة» / The Holding) to the start.
import { pageHead } from './parts.mjs';

export default function how(t, { esc, rtl }) {
  const w = t.how, n = w.steps.length;
  return `${pageHead(esc, w.title, w.subtitle)}

<section class="chain" data-chain aria-label="${esc(w.flowLabel)}">
  <div class="chain-stick">
    <div class="wrap">
      <div class="chain-track">
        <svg class="chain-rail" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true"${rtl ? ' data-flip' : ''}>
          <path class="rail-base" d="M40 150 H1160"/>
          <path class="rail-fill" d="M40 150 H1160" pathLength="1"/>
          <path class="loop-base" d="M1160 150 C 1160 30, 1100 20, 600 20 S 40 30, 40 150"/>
          <path class="loop-fill" d="M1160 150 C 1160 30, 1100 20, 600 20 S 40 30, 40 150" pathLength="1"/>
        </svg>
        <ol class="chain-steps">
          ${w.steps.map((s, i) => `<li class="chain-step${i === n - 1 ? ' is-hold' : ''}" style="--k:${i}"><span class="step-n">${i + 1}</span><span class="step-who">${esc(s.who)}</span><span class="step-text">${esc(s.text)}</span></li>`).join('\n          ')}
        </ol>
      </div>
    </div>
  </div>
</section>`;
}

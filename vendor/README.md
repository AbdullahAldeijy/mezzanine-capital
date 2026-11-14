# Vendored libraries (self-hosted, pinned — no CDN at runtime)

| File | Package | Version | License |
|---|---|---|---|
| gsap-3.15.1.min.js | gsap | 3.15.1 | GSAP Standard "no charge" license — https://gsap.com/standard-license |
| ScrollTrigger-3.15.1.min.js | gsap (ScrollTrigger plugin) | 3.15.1 | same |
| SplitText-3.15.1.min.js | gsap (SplitText plugin) | 3.15.1 | same |
| lenis-1.3.27.min.js | lenis | 1.3.27 | MIT |

Copied unmodified from the npm packages' `dist/` folders (only the sourceMappingURL comment is stripped).
To upgrade: `npm pack gsap@<v>` / `lenis@<v>`, copy the same files, rename with the new version, and update
`VENDOR` in `src/shell.mjs` and the Lenis path in `js/50-motion.js`.

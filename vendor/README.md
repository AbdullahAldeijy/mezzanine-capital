# Vendored libraries (self-hosted, pinned — no CDN at runtime)

| File | Package | Version | License |
|---|---|---|---|
| gsap-3.15.1.min.js | gsap | 3.15.1 | GSAP Standard "no charge" license — https://gsap.com/standard-license |
| ScrollTrigger-3.15.1.min.js | gsap (ScrollTrigger plugin) | 3.15.1 | same |
| SplitText-3.15.1.min.js | gsap (SplitText plugin) | 3.15.1 | same |
| ogl-1.0.11.min.mjs | ogl (WebGL) | 1.0.11 | Unlicense |

GSAP files are copied unmodified from the npm package's `dist/` folder (only the sourceMappingURL comment is stripped).
OGL ships ES-module sources only, so `ogl-1.0.11.min.mjs` is a tree-shaken esbuild bundle of the classes the site uses
(`Renderer, Camera, Transform, Program, Mesh, Geometry, Vec2, Vec3, Color, Triangle`):
`esbuild entry.mjs --bundle --format=esm --minify`.
To upgrade: `npm pack gsap@<v>` / `lenis@<v>`, copy the same files, rename with the new version, and update
the script paths that reference them.

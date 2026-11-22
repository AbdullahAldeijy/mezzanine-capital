# Vendored libraries (self-hosted, pinned — no CDN at runtime)

| File | Package | Version | License |
|---|---|---|---|
| ogl-1.0.11.min.mjs | ogl (WebGL) | 1.0.11 | Unlicense |

OGL ships ES-module sources only, so `ogl-1.0.11.min.mjs` is a tree-shaken esbuild bundle of the classes the site uses
(`Renderer, Camera, Transform, Program, Mesh, Geometry, Vec2, Vec3, Color, Triangle`):
`esbuild entry.mjs --bundle --format=esm --minify`. It is loaded only by `js/scene.js` (the data city), lazily.

To upgrade: bundle the new version the same way, rename with the new version, and update the import in `js/scene.js`.

# Third-Party Notices

PayDance depends on the following third-party software and assets. Each is
governed by its own license terms.

This file covers the **direct dependencies** declared in `package.json` and
`src-tauri/Cargo.toml`. For the full transitive set, see `package-lock.json`,
`src-tauri/Cargo.lock`, and the SPDX SBOM attached to every release.

`npm run check:notices` compares the direct dependencies against this file in
both directions: a new dependency that is not listed here, or a listed entry
that is no longer a dependency, fails the check.

## npm runtime dependencies

| Package | License | Usage |
|---------|---------|-------|
| [`@lucide/vue`](https://github.com/lucide-icons/lucide) | ISC | Icons |
| [`@tauri-apps/api`](https://github.com/tauri-apps/tauri) | Apache-2.0 OR MIT | Tauri frontend API |
| [`@tauri-apps/plugin-autostart`](https://github.com/tauri-apps/plugins-workspace) | MIT OR Apache-2.0 | Launch at startup |
| [`@tauri-apps/plugin-opener`](https://github.com/tauri-apps/plugins-workspace) | MIT OR Apache-2.0 | Open external links |
| [`@tauri-apps/plugin-process`](https://github.com/tauri-apps/plugins-workspace) | MIT OR Apache-2.0 | Process control |
| [`@tauri-apps/plugin-store`](https://github.com/tauri-apps/plugins-workspace) | MIT OR Apache-2.0 | Settings persistence |
| [`@tauri-apps/plugin-updater`](https://github.com/tauri-apps/plugins-workspace) | MIT OR Apache-2.0 | Application updates |
| [`vue`](https://github.com/vuejs/core) | MIT | Frontend framework |

## npm development dependencies

Build, test, and verification only. Not shipped in the distributed artifact.

| Package | License |
|---------|---------|
| `@axe-core/playwright` | MPL-2.0 |
| `@eslint/js` | MIT |
| `@tailwindcss/vite` | MIT |
| `@tauri-apps/cli` | Apache-2.0 OR MIT |
| `@types/node` | MIT |
| `@types/pngjs` | MIT |
| `@vitejs/plugin-vue` | MIT |
| `@vue/test-utils` | MIT |
| `eslint` | MIT |
| `eslint-config-prettier` | MIT |
| `eslint-plugin-vue` | MIT |
| `eslint-plugin-vuejs-accessibility` | MIT |
| `globals` | MIT |
| `happy-dom` | MIT |
| `pixelmatch` | ISC |
| `playwright` | Apache-2.0 |
| `pngjs` | MIT |
| `prettier` | MIT |
| `tailwindcss` | MIT |
| `typescript` | Apache-2.0 |
| `typescript-eslint` | MIT |
| `vite` | MIT |
| `vitest` | MIT |
| `vue-tsc` | MIT |

## Rust direct dependencies

See `src-tauri/Cargo.lock` for the full dependency tree and their respective
licenses. `cargo deny check` enforces the license allowlist across that whole
tree in CI.

| Crate | License |
|-------|---------|
| `serde` | Apache-2.0 OR MIT |
| `serde_json` | Apache-2.0 OR MIT |
| `tauri` | Apache-2.0 OR MIT |
| `tauri-build` | Apache-2.0 OR MIT |
| `tauri-plugin-autostart` | Apache-2.0 OR MIT |
| `tauri-plugin-opener` | Apache-2.0 OR MIT |
| `tauri-plugin-process` | Apache-2.0 OR MIT |
| `tauri-plugin-single-instance` | Apache-2.0 OR MIT |
| `tauri-plugin-store` | Apache-2.0 OR MIT |
| `tauri-plugin-updater` | Apache-2.0 OR MIT |

## Fonts

The desktop UI uses the system font stack (`Segoe UI Variable`, `Segoe UI`,
`Bahnschrift`, `system-ui`). No fonts are bundled.

The website pages embed two subset fonts stored in `src/assets/fonts/` and
loaded through `@font-face` in `src/web-preview/web-preview.css`, so they ship
with the web build. Both are subsets of Noto CJK, licensed under the
[SIL Open Font License 1.1](https://openfontlicense.org/):

- `paydance-web-sans-subset.woff2` — subset of Noto Sans SC 2.004
  Copyright 2014-2021 Adobe (http://www.adobe.com/), with Reserved Font Name 'Source'.
- `paydance-web-serif-subset.woff2` — subset of Noto Serif SC 2.002
  Copyright 2017-2023 Adobe (http://www.adobe.com/).

A subset is a Modified Version under the OFL, so these ship under the names
`PayDance Web Sans` and `PayDance Web Serif` rather than the upstream names.

---

If you notice an omission or error, please open an Issue.

> [中文版 →](THIRD_PARTY_NOTICES.md)

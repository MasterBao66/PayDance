# 第三方声明

> [English version →](THIRD_PARTY_NOTICES_EN.md)

本文件列出 PayDance 的直接依赖和捆绑字体，各项均受其自身许可条款约束。直接依赖以 `package.json` 和 `src-tauri/Cargo.toml` 为准；完整传递依赖见 `package-lock.json`、`src-tauri/Cargo.lock`，以及每个 Release 附带的 SPDX SBOM。

## npm 运行时依赖

| 包名 | 许可证 | 用途 |
|------|--------|------|
| [`@lucide/vue`](https://github.com/lucide-icons/lucide) | ISC | 图标 |
| [`@tauri-apps/api`](https://github.com/tauri-apps/tauri) | Apache-2.0 OR MIT | Tauri 前端 API |
| [`@tauri-apps/plugin-autostart`](https://github.com/tauri-apps/plugins-workspace) | MIT OR Apache-2.0 | 开机自启 |
| [`@tauri-apps/plugin-opener`](https://github.com/tauri-apps/plugins-workspace) | MIT OR Apache-2.0 | 打开外部链接 |
| [`@tauri-apps/plugin-process`](https://github.com/tauri-apps/plugins-workspace) | MIT OR Apache-2.0 | 进程控制 |
| [`@tauri-apps/plugin-store`](https://github.com/tauri-apps/plugins-workspace) | MIT OR Apache-2.0 | 设置持久化 |
| [`@tauri-apps/plugin-updater`](https://github.com/tauri-apps/plugins-workspace) | MIT OR Apache-2.0 | 应用更新 |
| [`vue`](https://github.com/vuejs/core) | MIT | 前端框架 |

## npm 开发依赖

仅用于构建、测试和校验，不作为独立软件包进入分发产物。

| 包名 | 许可证 |
|------|--------|
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

## Rust 直接依赖

| Crate | 许可证 |
|-------|--------|
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

## 字体

桌面端 UI 只按名称引用本机字体（`Segoe UI Variable`、`Bahnschrift`、`JetBrains Mono`、`Consolas` 等），不捆绑字体文件。

Web 构建通过 `src/web-preview/web-preview.css` 中的 `@font-face` 加载 `src/assets/fonts/` 内的两个 Noto CJK 子集字体，并随构建产物分发。两者采用 [SIL Open Font License 1.1](https://openfontlicense.org/)：

- `paydance-web-sans-subset.woff2` — 子集自 Noto Sans SC 2.004
  Copyright 2014-2021 Adobe (http://www.adobe.com/), with Reserved Font Name 'Source'.
- `paydance-web-serif-subset.woff2` — 子集自 Noto Serif SC 2.002
  Copyright 2017-2023 Adobe (http://www.adobe.com/).

子集属于 OFL 定义的修改版本，因此对外字体名使用 `PayDance Web Sans` 和 `PayDance Web Serif`，不沿用上游名称；上游来源和版权声明保留如上。

---

如发现遗漏或错误，请提交 [Issue](https://github.com/MrBaoboer/PayDance/issues)。

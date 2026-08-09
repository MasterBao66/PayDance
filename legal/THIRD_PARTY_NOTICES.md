# 第三方声明

PayDance 依赖以下第三方软件和素材，各项均受各自许可条款约束。

本文件覆盖 `package.json` 与 `src-tauri/Cargo.toml` 中声明的**直接依赖**。传递依赖的完整清单见 `package-lock.json` 与 `src-tauri/Cargo.lock`，以及每个 Release 附带的 SPDX SBOM。

`npm run check:notices` 会在直接依赖与本文件之间做双向比对：漏记新依赖、或保留已移除的依赖，都会让检查失败。

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

不进入分发产物，仅用于构建、测试与校验。

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

桌面端 UI 使用系统字体栈（`Segoe UI Variable`、`Segoe UI`、`Bahnschrift`、`system-ui`），不捆绑字体。

官网页面内嵌两个子集字体，位于 `src/assets/fonts/`，由 `src/web-preview/web-preview.css` 通过 `@font-face` 加载，随网页构建产物一同分发。两者都是 Noto CJK 的子集，依 [SIL Open Font License 1.1](https://openfontlicense.org/) 授权：

- `paydance-web-sans-subset.woff2` — 子集自 Noto Sans SC 2.004
  Copyright 2014-2021 Adobe (http://www.adobe.com/), with Reserved Font Name 'Source'.
- `paydance-web-serif-subset.woff2` — 子集自 Noto Serif SC 2.002
  Copyright 2017-2023 Adobe (http://www.adobe.com/).

子集属于 OFL 定义的修改版本，因此以 `PayDance Web Sans` 与 `PayDance Web Serif` 作为对外字体名，不沿用上游名称。

---

如发现遗漏或错误，请提交 Issue。

> [English version →](THIRD_PARTY_NOTICES_EN.md)

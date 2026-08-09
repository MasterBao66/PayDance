# 参与贡献

> [English version →](https://github.com/MrBaoboer/PayDance/blob/main/docs/CONTRIBUTING_EN.md)

## 开始之前

- Windows 11 是桌面版的发布与验证基线。
- 使用 Node.js 24、Rust stable 和 npm。
- 桌面开发还需安装 [Tauri Windows 前置依赖](https://v2.tauri.app/zh-cn/start/prerequisites/)（Microsoft C++ 生成工具和 WebView2）。
- 先阅读[产品边界](https://github.com/MrBaoboer/PayDance/blob/main/docs/PRODUCT.md)；需要定位代码时查看[架构与修改导航](https://github.com/MrBaoboer/PayDance/blob/main/docs/ARCHITECTURE.md)。

安装依赖后，按需启动桌面版或 Web Preview：

```powershell
npm ci
npm run tauri dev # 桌面版
npm run dev:web   # Web Preview
```

## 确认改动范围

范围明确的 Bug、测试或文档修改可以直接提交 PR。较大功能、产品方向调整和平台适配应先开 Issue，说明使用场景与边界。

开始处理 Issue 前，确认其中写清了用户能看到的结果、现状证据、涉及范围、验收标准和验证命令；信息不足时先在 Issue 中补齐。

平台适配贡献需附验证边界：目标系统、构建命令、人工冒烟项、更新方式和后续维护范围。

## 第一次贡献

从带 `good first issue` 或 `help wanted` 标签的 Issue 入手。这类任务通常只涉及 1–2 个主要文件，不需要发布密钥、更新签名或跨模块迁移。

- Issue 仍处于打开状态，并写明了**用户能看到的结果**、复现证据或截图、涉及范围、**验收标准**和一条**验证命令**。
- UI 改动附修改前后截图；行为修复附一个修复前失败、修复后通过的测试。
- PR 描述写清简短摘要、已运行的验证命令，并包含 `Signed-off-by:` 行。

认领后 7 天没有方案、提交或进度说明时，维护者可以释放认领。

## PR 要求

1. 一个 PR 只解决一个问题，不夹带无关重构。
2. 新行为需要测试；Bug 修复需要回归测试。
3. 用户可见的改动同步更新 [CHANGELOG.md](https://github.com/MrBaoboer/PayDance/blob/main/CHANGELOG.md) 和 [CHANGELOG_EN.md](https://github.com/MrBaoboer/PayDance/blob/main/CHANGELOG_EN.md) 的 `## Unreleased`；纯测试、内部维护或小幅文档修订无需更新。
4. UI 改动附修改前后截图，覆盖受影响的主题和语言。
5. 面向用户的文案同时更新 `src/i18n/locales/zh-CN.ts`、`src/i18n/locales/en.ts` 和 `src/i18n/types.ts`，不要在组件中硬编码。
6. 不要修改版本号；版本由维护者在发布时更新。
7. Commit 标题使用 `feat:`、`fix:`、`docs:`、`test:`、`chore:` 或 `refactor:`。

## DCO 与许可

普通贡献只需要 DCO 签署行，不需要提前签 CLA。

每个非合并提交都必须包含与提交作者邮箱一致的 `Signed-off-by:` 行。可用 `git commit -s` 自动添加；CI 会逐个提交检查。

代码贡献按 [AGPL-3.0-only](https://github.com/MrBaoboer/PayDance/blob/main/LICENSE) 和 [AGPL 第 7 条附加条款](https://github.com/MrBaoboer/PayDance/blob/main/legal/ADDITIONAL_TERMS.md)并入项目；原创文档按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 并入，另有说明的除外。提交贡献即表示你有权提交相关内容，并同意适用的项目许可。

仅当某项贡献需要用于商业、OEM 或其他非 AGPL 授权时，维护者才会在合并前明确要求签署[贡献者许可协议（CLA）](https://github.com/MrBaoboer/PayDance/blob/main/legal/CLA.md)。DCO 签署行不等同于签署 CLA。

商标和品牌资产规则见 [TRADEMARK.md](https://github.com/MrBaoboer/PayDance/blob/main/legal/TRADEMARK.md) 与 [BRAND-ASSETS.md](https://github.com/MrBaoboer/PayDance/blob/main/legal/BRAND-ASSETS.md)。

## 验证

按改动范围运行：

```powershell
npm run verify:metadata # 文档、法务、品牌和社区模板
npm run verify:fast     # 前端或桌面代码
npm run qa:web-preview  # Web Preview 行为或样式
```

`build:desktop` 和 `build:web` 共用 `dist/`，不要并行运行。

Rust 改动还需在 `src-tauri/` 运行：

```powershell
cargo fmt --all -- --check
cargo check
cargo clippy --all-targets -- -D warnings
cargo test
```

依赖或安全相关改动还需运行 `npm audit --audit-level=high`；Rust 依赖改动再运行 `cargo audit` 和 `cargo deny check`。

## 维护者流程

只验证待推送内容时运行 `npm run verify:push`；向 `main` 推送时运行 `npm run push:main`。正式发布前用 `npm run verify:release`，它依赖以下本地工具，版本要与 CI 固定的一致，否则本地审计结论不作数：

```powershell
cargo install cargo-audit --version 0.22.2 --locked
cargo install cargo-deny --version 0.20.2 --locked
gh auth login
```

发布流程与工具链对齐方式见[维护约定](https://github.com/MrBaoboer/PayDance/blob/main/docs/MAINTENANCE.md)。

## 相关规则

- [行为准则](https://github.com/MrBaoboer/PayDance/blob/main/CODE_OF_CONDUCT.md)
- [维护者说明](https://github.com/MrBaoboer/PayDance/blob/main/docs/MAINTAINERS.md)
- [治理说明](https://github.com/MrBaoboer/PayDance/blob/main/docs/GOVERNANCE.md)
- [维护约定](https://github.com/MrBaoboer/PayDance/blob/main/docs/MAINTENANCE.md)

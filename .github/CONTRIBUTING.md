# 参与贡献

> [English version →](https://github.com/MrBaoboer/PayDance/blob/main/docs/CONTRIBUTING_EN.md)

感谢你愿意参与薪跳 PayDance。这个项目刻意保持很小：只做一件事，把“今天正在挣到的钱”安静、清楚地放在桌面上。

> **贡献许可一句话说明：普通贡献只需要 DCO 签署行，不需要提前签 CLA。**

## 开发环境

- **操作系统**：官方发布与验证基线为 Windows 11；Web Preview 可在浏览器中预览核心体验；平台适配贡献需附验证边界说明
- **运行时**：Node.js 24（与 CI 一致）、Rust 最新稳定版
- **包管理器**：npm

装好后跑通这三条即可开始：

```powershell
npm install
npm run tauri dev # 桌面应用
npm run dev:web   # 浏览器 Web Preview
```

## 提交前验证

按改动范围选择验证命令。CI 会按路径自动选择轻量或完整验证，本地先跑一遍可以减少来回排查。

```powershell
npm run verify:metadata # 文档、法务、品牌、社区模板等轻量改动
npm run verify:fast     # lint、格式、测试、桌面构建、Web Preview 构建
npm run qa:web-preview  # Web Preview 视觉、DOM 与控制台验证
```

涉及 Rust、发布或安全治理时，在 `src-tauri/` 下额外运行：

```powershell
cargo fmt --all -- --check
cargo check
cargo clippy --all-targets -- -D warnings
cargo audit
cargo deny check
```

## 维护者推送工作流

向 `main` 推送用 `npm run push:main`，它会按待推送文件路径决定检查范围；只验证不推送用 `npm run verify:push`。

正式发布前用 `npm run verify:release`，完整执行桌面与 Web 构建、npm/Rust 安全审计、Rust 格式、编译检查、Clippy 和测试。发布审计依赖以下本地工具：

```powershell
cargo install cargo-audit --version 0.22.2 --locked
cargo install cargo-deny --version 0.20.2 --locked
gh auth login
```

版本要和 CI 固定的一致，否则本地审计结论不作数（见 [docs/MAINTENANCE.md](https://github.com/MrBaoboer/PayDance/blob/main/docs/MAINTENANCE.md)）。

> `npm run build:desktop` 和 `npm run build:web` 写入同一个 `dist/` 目录，不要并行运行。

## 贡献方向

欢迎的改动：

- 附复现步骤的 Bug 修复
- 桌面端可靠性：窗口管理、托盘、自启动、单实例
- Windows 11 UI 打磨：主题、无障碍、DPI、多显示器
- 平台适配提案
- 薪资计时器的性能与边界优化
- 边界场景测试：时钟变化、配置迁移、夜班等
- 中英文文案、文档、发布流程与社区模板

薪跳 PayDance 不是时间追踪、个人财务、薪酬、考勤或任务管理工具，完整边界见 [PRODUCT.md](https://github.com/MrBaoboer/PayDance/blob/main/docs/PRODUCT.md)。

小改动可以直接提 PR；较大功能、平台适配或方向调整先开 Issue 说明场景和边界，不确定的想法也可以先开 Issue 讨论。

## 第一次贡献

从带 `good first issue` 或 `help wanted` 标签的 Issue 入手。这类任务通常只涉及 1–2 个主要文件，不需要发布密钥、更新签名或跨模块迁移。动手前后对照这份清单：

- Issue 仍处于打开状态，并写明了**用户能看到的结果**、复现证据或截图、涉及范围、**验收标准**和一条**验证命令**。
- UI 改动附修改前后截图；行为修复附一个修复前失败、修复后通过的测试。
- 一个 PR 只解决这一个 Issue，不夹带无关重构、发布说明或文档清理。
- PR 描述写清简短摘要、已运行的验证命令，并包含 `Signed-off-by:` 行。

认领后 7 天没有方案、提交或进度说明时，维护者可以释放认领。

## PR 规范

1. **一个 PR 只做一件事。** 不要把 Bug 修复、重构和文档整理混在一起。
2. **写测试。** 新行为需要测试覆盖，Bug 修复需要回归测试。
3. **沿用现有代码风格。**
4. **更新 CHANGELOG.md 与 CHANGELOG_EN.md** 的 `## Unreleased` 区段；纯内部验证或文档微调可注明不适用。
5. **UI 改动附截图**，至少覆盖浅色/深色和中文/英文。
6. **平台适配说明验证边界**：目标系统、构建命令、人工冒烟项、更新端点和品牌区分方式。
7. **使用约定式提交**：`feat:`、`fix:`、`docs:`、`test:`、`chore:`、`refactor:`。

## 国际化

面向用户的文案必须同时出现在 `src/i18n/locales/zh-CN.ts` 和 `src/i18n/locales/en.ts`，并在 `src/i18n/types.ts` 中定义类型。不要在 Vue 组件或 TypeScript 里硬编码中英文文案。

## 版本管理

薪跳 PayDance 遵循 [语义化版本](https://semver.org/lang/zh-CN/)。版本号由项目作者管理，不要在 PR 中提升版本号。

## 许可细则

本项目代码采用 [AGPL-3.0-only](https://github.com/MrBaoboer/PayDance/blob/main/LICENSE) 发布，另有 [AGPL 第 7 条附加条款](https://github.com/MrBaoboer/PayDance/blob/main/legal/ADDITIONAL_TERMS.md)。提交代码贡献即表示你确认：

- 你有权提交该代码，且贡献为你的原创作品（或已获得必要授权）；
- 你同意你的贡献以 AGPL-3.0-only 及本项目附加条款并入项目；
- 提交时包含 `Signed-off-by:` 行（DCO），确认你的贡献来源合法。

如果维护者需要把某项贡献纳入商业、OEM 或白标授权范围，会在合并前请你签署 [贡献者许可协议（CLA）](https://github.com/MrBaoboer/PayDance/blob/main/legal/CLA.md)；仅提交 Issue、建议或安全报告无需签署。

商标与品牌资产另见 [legal/TRADEMARK.md](https://github.com/MrBaoboer/PayDance/blob/main/legal/TRADEMARK.md) 和 [legal/BRAND-ASSETS.md](https://github.com/MrBaoboer/PayDance/blob/main/legal/BRAND-ASSETS.md)。

## 维护与治理

- 行为准则：[CODE_OF_CONDUCT.md](https://github.com/MrBaoboer/PayDance/blob/main/CODE_OF_CONDUCT.md)
- 维护者说明：[docs/MAINTAINERS.md](https://github.com/MrBaoboer/PayDance/blob/main/docs/MAINTAINERS.md)
- 治理说明：[docs/GOVERNANCE.md](https://github.com/MrBaoboer/PayDance/blob/main/docs/GOVERNANCE.md)
- 维护约定：[docs/MAINTENANCE.md](https://github.com/MrBaoboer/PayDance/blob/main/docs/MAINTENANCE.md)

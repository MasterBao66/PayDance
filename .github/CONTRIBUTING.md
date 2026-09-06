# 参与贡献

> [English version →](https://github.com/MrBaoboer/PayDance/blob/main/docs/CONTRIBUTING_EN.md)

环境准备、架构与验证细节见[技术文档](https://github.com/MrBaoboer/PayDance/blob/main/docs/DEVELOPMENT.md)；动手前先读[产品边界](https://github.com/MrBaoboer/PayDance/blob/main/docs/PRODUCT.md)。

## 确认改动范围

范围明确的 Bug、测试或文档修改可以直接提交 PR。较大功能、产品方向调整和平台适配先开 Issue，说明使用场景与边界。

开始处理 Issue 前，确认其中写清了用户能看到的结果、现状证据、涉及范围、验收标准和验证命令；信息不足时先在 Issue 中补齐。

平台适配贡献需附验证边界：目标系统、构建命令、人工冒烟项、更新方式和后续维护范围。

## 第一次贡献

从带 `good first issue` 或 `help wanted` 标签的 Issue 入手。这类任务通常只涉及 1–2 个主要文件，不需要发布密钥、更新签名或跨模块迁移。

认领后 7 天没有方案、提交或进度说明时，维护者可以释放认领。

## PR 要求

1. 一个 PR 只解决一个问题，不夹带无关重构。
2. 新行为需要测试；Bug 修复需要回归测试。
3. 用户可见的改动同步更新 [CHANGELOG.md](https://github.com/MrBaoboer/PayDance/blob/main/CHANGELOG.md) 和 [CHANGELOG_EN.md](https://github.com/MrBaoboer/PayDance/blob/main/CHANGELOG_EN.md) 的 `## Unreleased`；纯测试、内部维护或小幅文档修订无需更新。
4. UI 改动附修改前后截图，覆盖受影响的主题和语言。
5. 面向用户的文案同时更新 `src/i18n/locales/zh-CN.ts`、`src/i18n/locales/en.ts` 和 `src/i18n/types.ts`，不要在组件中硬编码。
6. 不要修改版本号；版本由维护者在发布时更新。
7. Commit 标题使用 `feat:`、`fix:`、`docs:`、`test:`、`chore:` 或 `refactor:`。

## 验证

按改动范围运行：

```powershell
npm run verify:metadata # 文档、法务、品牌和社区模板
npm run verify:fast     # 前端或桌面代码
npm run qa:web-preview  # Web Preview 行为或样式
```

Rust、依赖和安全相关改动的额外命令见技术文档的「验证」一节。

## DCO 与许可

普通贡献只需要 DCO 签署行，不需要提前签 CLA。

每个非合并提交都必须包含与提交作者邮箱一致的 `Signed-off-by:` 行，可用 `git commit -s` 自动添加，CI 会逐个提交检查。唯一例外是 Dependabot 自己开的依赖升级 PR：它的提交只重写版本号与哈希，且改动限于 `package.json`、`package-lock.json`、`src-tauri/Cargo.*` 与 `.github/workflows/*.yml`；越界的机器人提交和人往同一分支补的提交仍要签署。

代码贡献按 [AGPL-3.0-only](https://github.com/MrBaoboer/PayDance/blob/main/LICENSE) 和 [AGPL 第 7 条附加条款](https://github.com/MrBaoboer/PayDance/blob/main/legal/ADDITIONAL_TERMS.md)并入项目；原创文档按 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) 并入，另有说明的除外。提交贡献即表示你有权提交相关内容，并同意适用的项目许可。仅当某项贡献需要用于商业、OEM 或其他非 AGPL 授权时，维护者才会在合并前要求签署[贡献者许可协议（CLA）](https://github.com/MrBaoboer/PayDance/blob/main/legal/CLA.md)；DCO 签署行不等同于签署 CLA。

商标和品牌资产规则见 [TRADEMARK.md](https://github.com/MrBaoboer/PayDance/blob/main/legal/TRADEMARK.md) 与 [BRAND-ASSETS.md](https://github.com/MrBaoboer/PayDance/blob/main/legal/BRAND-ASSETS.md)。

## 相关规则

- [行为准则](https://github.com/MrBaoboer/PayDance/blob/main/CODE_OF_CONDUCT.md)
- [安全策略](https://github.com/MrBaoboer/PayDance/blob/main/.github/SECURITY.md)
- [技术文档](https://github.com/MrBaoboer/PayDance/blob/main/docs/DEVELOPMENT.md)：架构、验证、发布与治理

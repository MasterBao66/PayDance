# 维护约定

> [English version →](MAINTENANCE_EN.md)

面向维护者，覆盖本地设置的兼容规则、主分支推送、依赖、工具链和发布。贡献者流程见[贡献指南](../.github/CONTRIBUTING.md)，代码定位见[架构与修改导航](ARCHITECTURE.md)。

## 配置迁移

- `src/lib/settings-migration.ts` 的 `settingsSchemaVersion` 记录薪资配置结构版本；窗口尺寸、迷你模式和透明度等窗口偏好的兼容边界在 `src/lib/window-mode.ts`。
- `window-mode.ts` 的 `windowSettingsSchemaVersion` 与写盘的 `settingsVersion` 是两个计数器，上调前者会重置所有用户的窗口尺寸。
- 新增持久化字段时，先补迁移测试，再改迁移逻辑；改 schema 时同步检查 `src/composables/useSalarySettings.ts` 的读写键和保存校验。
- 旧配置不能阻塞启动。时间、布尔值、薪资数字和工作日在使用前归一化，无法识别或不安全的值回退到默认值，未知字段不透传到运行时配置。
- 自动修复只重置损坏项或最小关联组，保留其他有效设置并立即写回；修复完成后不再以警告长期展示。

## 诊断与日志

- 用户可见的错误要给出下一步：重试、检查配置或重新打开应用。
- 维护者诊断信息留在 console 或本地日志，只记录失败阶段和安全的错误类别，不写入薪资、私有路径、密钥、邮箱等敏感数据。

## 主分支推送

文案、图片和低风险文档可直接推送 `main`；程序功能、Bug 修复、依赖升级、发布流程和安全相关修改走 PR，等待 CI 与 CodeQL 通过。

- `npm run push:main` 需要已登录的 GitHub CLI（`gh auth login`）。它先运行 `npm run verify:metadata`，改动不限于文档时再跑 lint 与单元测试，有未关闭的 Dependabot 安全告警时中止；然后推送并等待 CI 与 CodeQL（改动会部署官网时还有 Web Preview）。构建、浏览器 QA、Rust 检查和安全审计交给 CI。
- `npm run verify:push` 只做同样的本地检查，不推送。
- `npm run verify:release:record` 会把通过记录写到 `.tmp/paydance-verification.json`；两小时内对同一 HEAD 运行 `push:main` 不再重复本地检查。

CI 按改动文件裁剪 job（`scripts/ci-change-scope.mjs`），两个 gate 只校验被判定为必需的 job，绿灯不等于全量检查跑过：

- 纯文档改动只跑 metadata job，前端、Rust、Web Preview QA、安全审计和 CodeQL 全部跳过。
- `scripts/` 下的改动会触发 CodeQL，但 Vitest 挂在前端 job 上，只在前端文件变化时运行；改完脚本要在本地跑 `npm test`。

## 依赖更新

- Dependabot 配置在 `.github/dependabot.yml`：覆盖 npm、cargo、github-actions，每周一 09:00（Asia/Shanghai）检查，每个 ecosystem 一个分组，不开自动合并。它自己开的 PR 在 DCO 门禁里有豁免，前提是提交只落在依赖清单与 workflow 文件内，规则在 `scripts/check-dco.mjs`。
- 故意不升的依赖写在两处并保持同步：`dependabot.yml` 的 `ignore`，以及 `scripts/repository-metadata.test.js` 里 "keeps the upgrades that are blocked upstream pinned with a reason"。当前两条：
  - `typescript` 锁在 6.x：TS 7 是原生移植版，vue-tsc 解析不到 `tsc.js`，typescript-eslint 拒绝加载。
  - `@types/node` 锁在 24.x，跟随运行时主版本。Node 26 转为 LTS 后，把 CI 各处 `node-version` 推到 26，放开这条封锁并删掉对应测试断言。
- 声明区间只是文档，决定安装结果的是 `package-lock.json`。调整 `^` 下限以锁定并验证过的版本为准；`@tauri-apps/*` 与 Rust 侧 crate 配套，下限过旧会让人误以为老 IPC 接口仍受支持。

## 工具链

- CI 的 Rust 用 `stable`，本地落后会让 `cargo clippy -D warnings` 的结论与 CI 不一致：`rustup check` 看差距，`rustup update stable` 跟上。
- `npm run verify:release` 调用本地的 cargo-audit 和 cargo-deny，版本必须与 CI 固定的一致，否则本地审计结论不作数：

  ```powershell
  cargo install cargo-audit --version 0.22.2 --locked
  cargo install cargo-deny --version 0.20.2 --locked
  ```

- `npm run build:exe` 前会检查 `src-tauri/target/release/pay-dance.exe` 是否仍在运行；运行中会阻止构建覆盖，从托盘退出后重试。

## 发布

1. 同步更新 `package.json`、`src-tauri/tauri.conf.json` 和 `src-tauri/Cargo.toml` 的版本号，`npm run version:check` 校验三者一致。
2. 在 `CHANGELOG.md` 和 `CHANGELOG_EN.md` 中把 `## Unreleased` 收进 `### vX.Y.Z`；Release 正文由 `scripts/extract-release-notes.mjs` 从中文 CHANGELOG 的对应小节生成。
3. 运行 `npm run verify:release`（含 npm audit 与 Rust 的 fmt、clippy、test、audit、deny），完成 [Web Preview QA](web-preview-qa.md) 和[桌面端冒烟清单](desktop-smoke-checklist.md)中发布前的章节。
4. `npm run push:main`，等 CI 与 CodeQL 通过。
5. `npm run release:publish`：校验分支、工作区、远端同步、版本与 CHANGELOG 小节、tag 未存在和 CI 结论，然后创建并推送附注 tag `v<版本>`，等待 Release 与 Post-Release Smoke 工作流，最后核对 Release 资产齐全。`--dry-run` 只做本地检查。
6. 发布后按冒烟清单的“便携版更新”一节，用上一版 EXE 升级到新版本。

Release workflow 在 `windows-2025` 上构建便携 EXE，并附带 `.sha256`、updater 签名 `.sig`、`latest.json`、SPDX SBOM、`scripts/smoke-windows-exe.ps1` 生成的自动冒烟报告和 `release-manifest.json`；Post-Release Smoke 下载已发布的资产，复核哈希、清单和下载链接。

### 发布链路不变量

- `latest.json` 指向对应版本的 Windows EXE；updater 端点固定为 `releases/latest/download/latest.json`。
- `.sha256` 匹配实际 EXE。`.sig` 是 Tauri updater 签名，不是 Windows Authenticode 发布者签名；接入 Authenticode 前先确认成本、证书来源、续期方式和失败回滚路径。
- `pay-dance-sbom.spdx.json` 随 Release 归档。
- GitHub Actions 的 `uses:` 固定到 40 位 Commit SHA，并在行尾保留版本注释。
- CodeQL workflow 显式分析 `javascript-typescript` 与 `rust`。

### 更新签名密钥泄露

1. 停用泄露的密钥，生成新密钥对。
2. 用新公钥更新 `src-tauri/tauri.conf.json` 的 `plugins.updater.pubkey`，并替换 GitHub Secrets 中的 `TAURI_UPDATER_PRIVKEY` 与 `TAURI_UPDATER_PRIVKEY_PASSWORD`。
3. 发布用新密钥签名的版本。旧版本无法再自动更新，用户需手动下载。

# 维护约定

> [English version →](MAINTENANCE_EN.md)

本文记录 PayDance 的日常维护规则，方便维护者和贡献者快速判断：改配置、写日志、做发布前检查时，哪些事项必须同步处理。

## 配置迁移

- `src/lib/settings-migration.ts` 里的 `settingsSchemaVersion` 记录薪资配置结构版本。
- 新增持久化字段时，先补迁移测试，再改迁移逻辑。
- 旧配置不能阻塞应用启动；无法识别或不安全的值应回退到默认值。
- 窗口尺寸、迷你模式、透明度等窗口偏好，继续由 `src/lib/window-mode.ts` 维护兼容边界。
- 改 schema 时，同时检查 `src/composables/useSalarySettings.ts` 的读写键和保存校验。
- 时间、布尔值、薪资数字和工作日必须在使用前归一化；未知字段不能透传到运行时配置。
- 自动恢复应只重置损坏项或最小关联组，保留其他有效设置，并立即写回修复结果；不要把已完成的后台修复长期展示为警告。

## 诊断与日志

- 用户能看到的错误，应说明下一步该怎么做，例如重试、检查配置或重新打开应用。
- 维护者诊断信息可以留在 console 或本地日志里，但不要记录薪资、私有路径、密钥、邮箱等敏感数据。
- 新增日志时，优先记录失败阶段和安全的错误类别，不记录完整私密内容。

## 桌面发布前冒烟

每次 Windows 发布前，使用 `docs/desktop-smoke-checklist.md` 或英文版清单。记录至少包含：

- PayDance 版本号和 commit。
- Windows 版本。
- 显示器数量和 DPI 缩放。
- 失败项截图或说明。
- 是否验证托盘、迷你悬浮、置顶、自启动和更新入口。

Release workflow 还会运行 `scripts/smoke-windows-exe.ps1`，自动确认便携 EXE 能创建主窗口、稳定运行并阻止第二实例。人工清单继续覆盖自动化暂时无法可靠操作的托盘、自启动和休眠场景。

## 发布链路

- `latest.json` 必须指向对应版本的 Windows EXE。
- `.sha256` 必须匹配实际 EXE 文件。
- `.sig` 是 Tauri updater 签名，不等于 Windows Authenticode 发布者签名。
- 接入 Authenticode 前，先确认成本、证书来源、续期方式和失败回滚路径。
- `release-assets/pay-dance-sbom.spdx.json` 必须随 Release 归档。
- GitHub Actions 的 `uses:` 必须固定到 40 位 Commit SHA，并在行尾保留对应版本注释。
- CodeQL workflow 必须显式分析 `javascript-typescript` 与 `rust`。

## 主分支推送

- 维护者可将文案、图片、README 和低风险文档修改直接推送到 `main`，推送前运行 `npm run verify:metadata`。
- 程序功能、Bug 修复、依赖升级、发布流程和安全相关修改优先走 PR，并等待 CI 与 CodeQL 通过。
- 纯文档变更仍保留 `CI gate` 与 `CodeQL gate`，但 CodeQL 会跳过耗时的 JavaScript 和 Rust 分析。

## 依赖更新

- **生效中的是 Dependabot**，配置位于 `.github/dependabot.yml`，覆盖 npm、cargo、github-actions 三个 ecosystem，每周一 09:00（Asia/Shanghai）检查，分组与人工评估策略照搬 renovate.json，不开自动合并。
- `.github/renovate.json` 保留但**从未被执行过**：2026-08-08 查证，仓库内 `app/renovate` 活动数为 0，历史 PR 无一来自它，issue #25「依赖更新面板」是手写的占位 issue 而非 renovate[bot] 产出。上一条约定「仅存在配置文件不等于机器人已经安装」当时写对了，但一直没人去验证。
- 若日后真的安装了 Renovate Hosted App，需同时删除 `.github/dependabot.yml`，否则两边会重复提 PR。
- 被上游卡住、故意不升的依赖写在三处并保持同步：`dependabot.yml` 的 `ignore`、`renovate.json` 的 `allowedVersions`、以及 `scripts/repository-metadata.test.js` 里 “keeps the upgrades that are blocked upstream pinned with a reason”。当前有两条：`typescript` 锁在 6.x（TS 7 是原生移植版，vue-tsc 解析不到 `tsc.js`，typescript-eslint 拒绝加载），`@types/node` 锁在 24.x（跟随运行时主版本）。
- **2026-10 待办**：Node 26 转为 LTS 后，把 CI 各处 `node-version` 推到 26，同步放开 `@types/node` 的 major 封锁并删掉对应测试断言。
- `package.json` 的 `overrides` 是**临时措施**，上游补齐后必须撤掉，否则会长期把某个 major 硬塞进声明了低版本区间的依赖里。2026-08-08 已移除 `brace-expansion` 的 override：它当初是为清 ReDoS 公告加的，如今 `minimatch@10` 自己就依赖 `brace-expansion ^5.0.8`，而 `minimatch@9`（经 js-beautify → editorconfig 引入）声明的 `^2.0.2` 也已能解析到打过补丁的 `2.1.4`。撤掉前后 `npm audit` 都是 0 公告，撤掉后 `minimatch@9` 拿回的是上游本来打算给它的版本，而不是被强推的 v5。
- `glob@10.5.0` 在依赖树里带 deprecated 标记，**属于已知且可接受**：链路是 `@vue/test-utils → js-beautify → glob`，而 `glob` 只在 `js-beautify/js/lib/cli.js` 里被 `require`，测试工具走的是库入口 `js/index.js`，这条路径在本仓库从不加载。它没有任何公告，强行用 override 顶到 glob 13 反而是把一个未跑过的 CLI 路径推上未验证的 major。等 js-beautify 自己升级即可。
- 声明区间只是文档，真正决定安装结果的是提交进仓库的 `package-lock.json`。2026-08-08 把 `package.json` 里 20 处已经落后于锁定版本的 `^` 下限对齐到实际验证过的版本，其中只有 `@tauri-apps/api`（`^2.0.0` → `^2.11.1`）和 `@tauri-apps/plugin-store`（`^2.0.0` → `^2.4.4`）有实际意义——它们和 Rust 侧的 crate 是配套的，下限停在 2.0.0 会让人误以为一年前的 IPC 接口也在支持范围内。

## 本地工具链对齐

- CI 的 Rust 用 `stable`，本地落后会导致 `cargo clippy -D warnings` 的结论与 CI 不一致。定期 `rustup update stable`（含 `rustup check` 先看差距）。
- `npm run verify:release` 调用的是**本地**的 cargo-audit / cargo-deny，而 CI 装的是固定版本。两边版本不一致时本地结论不作数，用 `cargo install cargo-audit cargo-deny --locked` 追平。

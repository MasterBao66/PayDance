## 变更内容 / What Changed

- 请用 2–4 条说明这次 PR 改了什么，以及为什么需要这样改。
- Summarize what this PR changes and why in 2–4 bullets.

## 影响范围 / Scope

- [ ] 桌面端体验 / Desktop experience
- [ ] Web Preview
- [ ] 平台适配 / Platform adaptation
- [ ] 构建、发布或安全治理 / Build, release, or security governance
- [ ] 文档、社区或法律材料 / Docs, community, or legal material

## 验证方式 / Verification

请选择与你的改动相关的检查；不适用的项目请说明原因。
Select the checks relevant to your change. Explain why an item is not applicable when needed.

- [ ] `npm run verify:metadata`
- [ ] `npm run verify:fast`
- [ ] `npm audit --audit-level=high`
- [ ] `Push-Location src-tauri; cargo fmt --all -- --check; cargo check; cargo clippy --all-targets -- -D warnings; cargo audit --deny warnings; cargo deny check --hide-inclusion-graph; Pop-Location`
- [ ] `npm run qa:web-preview`
- [ ] Windows 桌面端人工冒烟 / Windows desktop manual smoke test
- [ ] 平台适配人工冒烟与维护边界说明 / Platform-adaptation smoke test and maintenance-boundary notes

## 风险与回滚 / Risk and Rollback

- 请说明最需要关注的风险，以及如果出现问题应如何回退或缓解。
- Describe the main risk and how to roll back or mitigate it if something goes wrong.

## 提交确认 / Submission Checklist

- [ ] 没有更新版本号，除非这个 PR 的目标就是发版 / Version numbers are unchanged unless this PR is a release PR
- [ ] 没有提交私钥、薪资数据、构建产物或本机缓存 / No private keys, salary data, build artifacts, or local caches are committed
- [ ] 文档链接已检查，中文默认文档与英文镜像保持一致 / Documentation links are checked, and Chinese default docs stay aligned with English mirrors

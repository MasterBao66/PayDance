## 变更内容 / What Changed

用 2–4 条说明改了什么、为什么这样改。
What changed and why, in 2–4 bullets.

## 影响范围 / Scope

- [ ] 桌面端体验 / Desktop experience
- [ ] Web Preview
- [ ] 平台适配 / Platform adaptation
- [ ] 构建、发布或安全治理 / Build, release, or security governance
- [ ] 文档、社区或法律材料 / Docs, community, or legal material

## 验证方式 / Verification

勾选与改动相关的检查，不适用的说明原因。
Check what applies; note why an item does not.

- [ ] `npm run verify:metadata`
- [ ] `npm run verify:fast`
- [ ] `npm audit --audit-level=high`
- [ ] `Push-Location src-tauri; cargo fmt --all -- --check; cargo check; cargo clippy --all-targets -- -D warnings; cargo audit --deny warnings; cargo deny check --hide-inclusion-graph; Pop-Location`
- [ ] `npm run qa:web-preview`
- [ ] Windows 桌面端人工冒烟 / Windows desktop manual smoke test
- [ ] 平台适配人工冒烟与维护边界说明 / Platform-adaptation smoke test and maintenance-boundary notes

## 风险与回滚 / Risk and Rollback

最需要关注的风险，以及出问题后如何回退或缓解。
The main risk, and how to roll it back or mitigate it.

## 提交确认 / Checklist

- [ ] 未改动版本号，发版 PR 除外 / Version numbers unchanged unless this is a release PR
- [ ] 未提交私钥、薪资数据、构建产物或本机缓存 / No private keys, salary data, build artifacts, or local caches
- [ ] 文档链接可解析，中文文档与英文镜像保持一致 / Doc links resolve; Chinese docs and English mirrors stay aligned

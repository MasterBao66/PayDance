# 维护者说明

> [English version →](MAINTAINERS_EN.md)

决策规则见[治理说明](GOVERNANCE.md)。

## 当前维护者

- Mr.Baoboer / MrBaoboer
- GitHub：<https://github.com/MrBaoboer>

## 处理顺序

1. 按[安全策略](../.github/SECURITY.md)私下提交的安全问题
2. 影响当前支持范围且可以复现的 Bug
3. 范围明确、完成相关验证并符合[产品边界](PRODUCT.md)的 PR
4. 功能建议和其他讨论

项目由单人维护，除[安全策略](../.github/SECURITY.md)约定的安全报告时限外，不承诺固定响应时间。

## 发布

不设固定发版周期，积累到一组完整且验证充分的改动后再发布。

发布前必须运行 `npm run verify:release`，完成 [Web Preview QA](web-preview-qa.md) 和 [Windows 桌面冒烟清单](desktop-smoke-checklist.md)，并通过所需的 GitHub 检查。细节见[维护约定](MAINTENANCE.md)。

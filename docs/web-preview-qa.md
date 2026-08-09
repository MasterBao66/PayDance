# Web Preview 质量验证

> [English version →](web-preview-qa_EN.md)

Web Preview QA 用来确认官网橱窗在真实浏览器里稳定可用：页面能正常渲染，主题和语言能切换，关键文案不丢，主要布局不溢出。

不要用 headless Chrome、CDP 或命令行截图替代这个流程：它们出现过全白截图却正常退出的情况，不能作为发布信号。

## 验证流程

1. 启动本地 Web Preview dev server，并记录本地 URL。
2. 使用项目 `devDependency` 中的 Playwright 打开页面；如需调试特殊环境，可用 `PLAYWRIGHT_NODE_MODULES` 指向外部 `node_modules`。
3. 按固定视口截图，浅色和深色主题都要覆盖：桌面端 `1440x900`，中等窗口 `960x760`，移动端 `390x844`。
4. 检查 DOM：页面标题、`Web Preview · appVersion`、软件预览区和移动端布局必须存在且稳定。
5. 跑真实语言切换：本地和 GitHub Pages 镜像从 `/PayDance/` 进入中文页，点击 `Switch to English`，确认网址进入 `/PayDance/en/`、`data-locale="en"`；Vercel 主站线上冒烟从 `/` 和 `/en/` 入口确认同一套语言状态。两个入口都要核对本页的标题、Canonical、`zh-CN` / `en` / `x-default` 双向 `hreflang`，以及 JSON-LD 语言和构建日期。
6. 用 `@axe-core/playwright` 检查自动化能发现的严重无障碍问题。这不是完整 WCAG 合规证明。
7. 收集控制台错误和页面错误，确认没有严重报错。
8. 将截图和 `summary.json` 保存到系统临时目录下本次运行专属的 `paydance-web-preview-qa-{version}-{commit}-{timestamp}`：本地取 `%LOCALAPPDATA%\Temp`，CI 取 `RUNNER_TEMP`。
9. 对 4 个标准状态执行像素差异检查：中英文各覆盖桌面端和移动端，中文使用浅色，英文使用深色。
10. 结束后关闭本地服务，避免占用端口。

## 命令

```powershell
npm run qa:web-preview
```

仅在确认视觉变化符合预期时，显式更新基准图：

```powershell
npm run qa:web-preview:update
```

普通 QA 永远不会自动接受新截图。发生差异时，临时目录会保留预期图、实际图和差异图。`summary.json` 会记录运行 ID、commit、页面实际读取到的中英文文案、截图路径和视觉比较结果。

## 通过标准

- 三种视口都有非空截图，首屏没有文字重叠、按钮溢出或主体塌缩。
- 中英文文案都来自当前页面 DOM，而不是旧截图或手工判断。
- 中文进入后点击 EN，镜像路径必须进入 `/PayDance/en/`，Vercel 主站路径必须进入 `/en/`，根节点 `data-locale` 必须同步为 `en`。
- 两个入口的标题、Canonical、`hreflang` 和 JSON-LD 必须与各自语言一致。
- 没有 critical/serious 级别的 axe 自动化无障碍违规。
- 浅色/深色切换后，预览窗口边缘没有明显闪白、错色或残影。
- `summary.json` 中没有严重控制台错误或页面错误。
- 标准状态会过滤轻微抗锯齿差异，总像素差异不得超过 `0.5%`；超过时保留预期图、实际图和差异图供人工判断。
- 验证结束后本地 dev server 已退出。

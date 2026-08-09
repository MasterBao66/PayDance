# Web Preview 质量验证

> [English version →](web-preview-qa_EN.md)

Web Preview QA 用来确认官网橱窗的内容、布局、主题、语言、无障碍和视觉基准。`npm run qa:web-preview` 会启动本地 Vite 服务，并使用 Playwright Chromium；默认地址为 `http://127.0.0.1:4174/PayDance/`，结束时会关闭服务。

不要用 headless Chrome、CDP 或命令行截图等临时结果代替本流程；仓库脚本虽使用 headless Chromium，但同时执行 DOM、交互、无障碍、控制台和像素差异断言。

## 覆盖范围

脚本验证以下组合：

- 中文和英文。
- 浅色和深色主题。
- `1440x900`、`960x760` 和 `390x844` 三种视口。
- 移动端从中文 `/PayDance/` 切换到英文 `/PayDance/en/` 的真实导航。

每个组合都会检查：

- 页面标题、Canonical、`zh-CN` / `en` / `x-default` `hreflang` 和 JSON-LD。
- 版本、语言状态、核心文案、下载入口、软件预览区和功能说明。
- 关键元素是否越界、重叠、换行异常或垂直错位。
- 首次主题绘制是否稳定，以及连续切换主题时预览窗口边缘是否保持一致。
- `@axe-core/playwright` 报告的 critical 或 serious 无障碍问题。
- 浏览器控制台错误和页面错误；任一错误都会使验证失败。

本地和 GitHub Pages 镜像从 `/PayDance/` 进入中文页，从 `/PayDance/en/` 进入英文页；Vercel 主站对应 `/` 和 `/en/`。该命令只访问本地服务，不验证已经部署的站点。

## 运行

首次运行先安装依赖和 Chromium：

```powershell
npm ci
npx playwright install chromium
```

脚本优先加载项目 `node_modules` 中的 Playwright。仅在排查外部运行环境时，才用 `PLAYWRIGHT_NODE_MODULES` 指定另一套 `node_modules`。

执行验证：

```powershell
npm run qa:web-preview
```

如默认端口被占用，可临时指定其他端口：

```powershell
$env:PAYDANCE_WEB_QA_PORT = 4175
npm run qa:web-preview
```

## 视觉基准

像素差异覆盖四个固定状态：

- 中文浅色：桌面端与移动端。
- 英文深色：桌面端与移动端。

脚本忽略轻微抗锯齿差异；变化像素超过 `0.5%` 即失败。确认视觉变化符合预期后，才能更新基准图：

```powershell
npm run qa:web-preview:update
```

普通 QA 不会自动接受新截图。

## 结果文件

截图保存在系统临时目录下的独立目录；Windows 通常使用 `%LOCALAPPDATA%\Temp`，CI 使用 `RUNNER_TEMP`：

```text
paydance-web-preview-qa-{version}-{commit}-{timestamp}
```

验证成功时，同目录的 `summary.json` 记录版本、Commit、本地 URL、页面实际读取到的中英文文案、截图路径和视觉比较结果。视觉比较失败时会保留预期图、实际图和差异图。

## 通过条件

- 12 个语言、主题和视口组合及一次语言切换全部完成。
- DOM、SEO、布局、主题切换和无障碍检查全部通过。
- 四个固定状态的像素差异不超过 `0.5%`。
- 没有控制台错误或页面错误。
- 本地服务在脚本结束后退出。

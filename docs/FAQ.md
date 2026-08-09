# 常见问题

> [English version →](FAQ_EN.md)

产品边界见 [PRODUCT.md](PRODUCT.md)，故障与反馈路径见 [SUPPORT.md](SUPPORT.md)。

## 下载与使用

### 用 Web Preview 还是 Windows 桌面版？

[Web Preview](https://paydance.vercel.app/) 用于体验界面和计算逻辑。托盘、置顶、迷你悬浮窗和开机自启动仅在 Windows 桌面版提供。

### 该下载哪个文件？

在 [最新 Release](https://github.com/MrBaoboer/PayDance/releases/latest) 里下载名为 `pay-dance-v<版本>-windows-x64.exe` 的文件。同一页面提供 SHA256 校验文件，可用于验证下载完整性。

### 为什么是便携 EXE，而不是安装包？

便携 EXE 下载后即可运行，无需安装。删除前如已开启开机自启动，请先在设置中关闭；退出应用后删除 EXE。需要同时清除薪资设置时，再删除本地配置文件。

### 如何重新进入首次启动向导？

关闭应用后删除本地配置文件，再重新启动：

```powershell
Remove-Item "$env:APPDATA\com.masterbao.paydance\salary-settings.json"
```

### Web Preview 的设置会影响桌面版吗？

不会。Web Preview 使用浏览器 `localStorage`，桌面版通过 Tauri Store 保存到本机应用数据目录，两者互不影响。

## 薪资与时间计算

### 今日入账是怎么算出来的？

你可以选择月薪、日薪或时薪。PayDance 根据工作日、上下班时间和午休设置计算当天的有效工作时长，再按已经过的工作时间估算今日入账。

### 午休时间会计入计算吗？

取决于你的设置。启用午休剔除后，午休时段不计入有效工作时间；如果你的薪资规则不扣午休，关掉这个选项即可。

### 支持夜班或跨零点工作吗？

支持。PayDance 会处理跨零点的夜班场景。

### 显示金额等于真实到账工资吗？

不等于。它是基于你输入的薪资与时间设置得到的实时估算，不含税费、社保、公积金、奖金、请假、加班和公司内部薪资规则。

## 隐私与本地数据

### 薪资数据会上传吗？

不会。PayDance 没有账号、云同步、遥测或广告，薪资、工作时间和界面偏好只保存在你的设备上。

### 配置保存在哪里？

Windows 桌面版通过 Tauri Store 把配置保存在本机应用数据目录下的 `salary-settings.json`。这个文件包含你的薪资信息，属于个人数据。删除它之后，下一次启动会重新进入首次启动向导。

## 桌面能力

### 迷你悬浮窗口怎么用？

在主窗口双击金额进入迷你悬浮模式。迷你窗口只显示金额；双击它可以恢复主窗口。

### 关闭主窗口后为什么仍在运行？

主窗口的关闭按钮会把应用隐藏到系统托盘。可以从托盘重新显示窗口或彻底退出；置顶和开机自启动可在设置中单独开关。

### 多显示器或高 DPI 下显示异常怎么办？

按 [SUPPORT.md](SUPPORT.md) 提交反馈，附上应用版本、Windows 版本、显示器数量、DPI 缩放和复现步骤。截图或录屏会更有帮助。

## 开源、许可与品牌

### 用的什么许可证？可以商用吗？

代码采用 [AGPL-3.0-only](../LICENSE) 发布，并带有 AGPL 第 7 条允许的附加条款。商业使用需同时遵守两者；闭源集成、OEM、白标和官方品牌使用需要单独授权。详见 [LEGAL.md](../legal/LEGAL.md)。

### 可以 fork 或修改后发布吗？

可以，但修改版需要保留必要法律声明，标注不是官方版本，并使用能清楚区分的名称、图标、应用标识符和发布渠道，避免被误认为官方版本。商标与品牌素材边界见 [TRADEMARK.md](../legal/TRADEMARK.md) 和 [BRAND-ASSETS.md](../legal/BRAND-ASSETS.md)。

## 贡献与反馈

### 发现 Bug 怎么反馈？

用仓库里的 Bug 反馈表单，需要提供的信息见 [SUPPORT.md](SUPPORT.md)。Issue 是公开的，请勿附上薪资数据或配置文件。

### 想提功能建议，先看什么？

先看 [PRODUCT.md](PRODUCT.md) 里的产品边界。说明建议解决的具体使用场景，比描述功能本身更有帮助。

### 开发者从哪里开始？

先读 [贡献指南](../.github/CONTRIBUTING.md)，再查看标有 `good first issue` 或 `help wanted` 的公开 Issue。文档和测试通常不需要完整的 Windows 桌面环境。

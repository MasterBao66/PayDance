# 常见问题

> [English version →](FAQ_EN.md)

## 下载与使用

### 用在线体验还是 Windows 桌面版？

[在线体验（Web Preview）](https://paydance.vercel.app/)用于了解界面和计算逻辑，迷你悬浮窗和透明度可在浏览器内模拟；托盘、置顶和开机自启动只有 Windows 桌面版提供。

### 该下载哪个文件？

在[最新 Release](https://github.com/MrBaoboer/PayDance/releases/latest) 下载 `pay-dance-v<版本>-windows-x64.exe`。同一页面的 `.sha256` 文件用于核对完整性：

```powershell
Get-FileHash .\pay-dance-v<版本>-windows-x64.exe -Algorithm SHA256
```

输出的哈希与 `.sha256` 文件中的一致即可，大小写不影响。

### 如何彻底删除 PayDance？

1. 如果开启过开机自启动，先在设置中关闭。
2. 从托盘退出应用。
3. 删除 EXE 文件。
4. 需要同时清除薪资设置时，删除 `%APPDATA%\com.masterbao.paydance\salary-settings.json`。

### 如何重新进入首次启动向导？

关闭应用后删除本地配置文件，再重新启动：

```powershell
Remove-Item "$env:APPDATA\com.masterbao.paydance\salary-settings.json"
```

### 在线体验的设置会影响桌面版吗？

不会。在线体验使用浏览器 `localStorage`，桌面版保存在本机应用数据目录，两者互不影响。

## 薪资与时间计算

### 今日入账是怎么算出来的？

先按工作日、上下班时间和午休设置算出当天的有效工作时长，再折算出当天应得：月薪除以设置里的「每月工作天数」，日薪直接取用，时薪乘以有效工作时长。今日入账按已经过的有效工作时间同比例累加。

### 午休时间会计入吗？

取决于设置。启用午休剔除后，午休时段不计入有效工作时间；如果你的薪资规则不扣午休，关掉这个选项即可。

### 支持夜班或跨零点工作吗？

支持。下班时间早于上班时间时按跨零点班次处理，过零点后继续累计同一班次的收入。

### 显示金额等于真实到账工资吗？

不等于。它是基于你输入的薪资与时间设置得到的实时估算，不含税费、社保、公积金、奖金、请假、加班和公司内部薪资规则。

## 隐私与本地数据

### 薪资数据会上传吗？

不会。PayDance 没有账号、云同步、遥测或广告，薪资、工作时间和界面偏好只保存在你的设备上。

### 配置保存在哪里？

Windows 桌面版保存在 `%APPDATA%\com.masterbao.paydance\salary-settings.json`。这个文件包含你的薪资信息，属于个人数据，不要对外分享。删除它之后，下一次启动会重新进入首次启动向导。

## 桌面能力

### 迷你悬浮窗口怎么用？

在主窗口双击金额进入迷你悬浮模式。迷你窗口只显示金额，右键调出透明度面板，双击恢复主窗口。

### 关闭主窗口后为什么仍在运行？

主窗口的关闭按钮会把应用隐藏到系统托盘。可以从托盘重新显示窗口或彻底退出；置顶和开机自启动可在设置中单独开关。

### 多显示器或高 DPI 下显示异常怎么办？

按下方「反馈与帮助」提交 Bug，附上应用版本、Windows 版本、显示器数量、DPI 缩放和复现步骤，截图或录屏会更有帮助。

## 开源、许可与品牌

### 用的什么许可证？可以商用吗？

代码采用 [AGPL-3.0-only](../LICENSE) 发布，并带有 AGPL 第 7 条允许的附加条款，商业使用需同时遵守两者。闭源集成、OEM、白标和官方品牌使用需要单独授权，详见[许可导引](../legal/LEGAL.md)。

### 可以 fork 或修改后发布吗？

可以，但修改版需要保留必要法律声明，标注不是官方版本，并使用能清楚区分的名称、图标、应用标识符和发布渠道。商标与品牌素材边界见 [TRADEMARK.md](../legal/TRADEMARK.md) 和 [BRAND-ASSETS.md](../legal/BRAND-ASSETS.md)。

## 反馈与帮助

### 发现 Bug 或想提建议，怎么提交？

在 [Issue 选择页](https://github.com/MrBaoboer/PayDance/issues/new/choose)使用对应表单：

- Bug：填写版本、发生位置、复现步骤、期望结果和实际结果。
- 功能建议：先对照[产品边界](PRODUCT.md)，说明使用场景和希望改善的结果；平台适配建议需附验证边界，要求见[贡献指南](../.github/CONTRIBUTING.md)。
- 其他问题：使用空白 Issue，写清背景和期望结果。

Issue 是公开的，请勿附上薪资数据、`salary-settings.json`、私钥或其他敏感信息；日志和截图先脱敏。

### 发现安全漏洞怎么办？

不要公开提交，按[安全策略](../.github/SECURITY.md)私下报告。

### 如何私下联系维护者？

不适合公开讨论的项目事项，可使用 [Mr.Baoboer 的 GitHub 主页](https://github.com/MrBaoboer)公示的邮箱。

### 开发者从哪里开始？

先读[贡献指南](../.github/CONTRIBUTING.md)和[技术文档](DEVELOPMENT.md)，再看标有 `good first issue` 或 `help wanted` 的公开 Issue。文档和测试通常不需要完整的 Windows 桌面环境。

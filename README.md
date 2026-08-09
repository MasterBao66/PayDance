
<p align="center">
  <img src="src-tauri/icons/icon.png" alt="薪跳 PayDance" width="92">
</p>

<h1 align="center">薪跳 PayDance</h1>

<p align="center">
  把「今天正在挣到的钱」放到桌面上，让每一秒的收入增长都看得见
</p>

<p align="center">
  <a href="https://paydance.vercel.app/"><strong>在线体验</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="https://github.com/MrBaoboer/PayDance/releases/latest"><strong>下载桌面版</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="docs/README_EN.md">English</a>
</p>

<p align="center">
  <a href="https://github.com/MrBaoboer/PayDance/releases/latest"><img alt="最新版本" src="https://img.shields.io/github/v/release/MrBaoboer/PayDance?style=flat&label=release&labelColor=1F2328&color=F59E0B"></a>
  <a href="https://github.com/MrBaoboer/PayDance/releases"><img alt="下载量" src="https://img.shields.io/github/downloads/MrBaoboer/PayDance/total?style=flat&label=downloads&labelColor=1F2328&color=3D444D"></a>
  <a href="LICENSE"><img alt="许可" src="https://img.shields.io/badge/license-AGPL--3.0--only-3D444D?style=flat&labelColor=1F2328"></a>
</p>

---

## 它是什么

薪跳 PayDance 是一款桌面实时工资看板。配置薪资与上下班时间后，今日入账就会安静地常驻在桌面上，随工作时间实时增长。

主窗口展示今日入账、工作进度、剩余时间和今日预计；迷你悬浮窗只保留金额数字，适合放在屏幕角落随时扫一眼。

<p align="center">
  <img src="docs/posters/poster-02-three-step-setup-v3.png" alt="薪跳 PayDance 首次配置三步上手" width="100%">
</p>

<p align="center">
  薪资模式、工作时间、使用偏好——三步设好，自动记住。
</p>

## 为什么用它

- **收入可见** — 今日入账精确到小数点后 2 位，持续跳动，让工作时间有了直观的价值感。
- **贴近真实工作制** — 月薪/日薪/时薪自动换算，支持每周工作日、午休剔除、跨零点夜班。
- **迷你悬浮** — 只显示金额，可拖拽、可置顶，透明度 10%–100% 可调；双击即可恢复主窗口。
- **本地优先** — 不需要账号，不上传数据，不包含遥测。薪资配置只保存在你自己的电脑上。
- **中英双语** — 界面、托盘、校验提示完整覆盖简体中文与 English。
- **Windows 11 体验** — 无边框圆角窗口、亮暗主题、托盘常驻、开机自启动、静默后台更新。

## 获取

<div align="center">

| &nbsp; | 入口 | 说明 |
|:---:|:---:|:---:|
| 🌐 | **[在线体验](https://paydance.vercel.app/)** | 网页端，含所有核心功能，打开即用，无需下载 |
| ⬇️ | **[Windows 桌面版](https://github.com/MrBaoboer/PayDance/releases/latest/download/pay-dance-v0.9.9-windows-x64.exe)** | 便携 EXE，含托盘、置顶、迷你悬浮、开机自启动等完整能力 |

</div>

Release 页面同时提供 SHA256 校验文件，下载后可验证完整性。

## 技术栈

<div align="center">

| 层级 | 技术 |
|:---:|:---:|
| 桌面壳 | Tauri 2 + Rust |
| 前端 | Vue 3 + TypeScript + Vite |
| UI | Windows 11 风格、CSS Container Queries、Lucide Icons |
| 存储 | 本机应用数据目录（Tauri Store）/ 浏览器 localStorage |
| 测试 | Vitest + Rust 单元测试 + vue-tsc + cargo clippy |

</div>

Web Preview 与桌面端共享核心薪资逻辑和前端界面，当前主站部署在 Vercel，GitHub Pages 可作为仓库镜像与发布验证入口。

## 开发

**安装依赖**

```powershell
npm install
```

**桌面应用**

```powershell
npm run tauri dev
```

**Web Preview**

```powershell
npm run dev:web
```

**构建 Windows 便携版**

```powershell
npm run build:exe
```

**构建网页体验版**

```powershell
npm run build:web
```

**重置本地配置，重新进入首次启动向导**

```powershell
Remove-Item "$env:APPDATA\com.masterbao.paydance\salary-settings.json"
```

详细的提交规范、验证命令和贡献方向请参阅 [贡献指南](.github/CONTRIBUTING.md)。

## 隐私

薪跳不需要登录，不上传数据，不包含遥测。所有配置通过 Tauri Store 保存在本机 `salary-settings.json` 中，内容仅包括薪资参数、工作时间和界面偏好。

## 相关文档

- [常见问题](docs/FAQ.md)
- [架构与修改导航](docs/ARCHITECTURE.md)
- [产品定位与边界](docs/PRODUCT.md)
- [路线图](docs/ROADMAP.md)
- [更新日志](CHANGELOG.md)
- [许可与法律信息](legal/LEGAL.md)

## 许可

薪跳 PayDance 由 Mr.Baoboer 设计与开发，代码以 [AGPL-3.0-only](LICENSE) 发布。

完整许可信息与商标政策请参阅 [许可导引](legal/LEGAL.md)。

---

> [English version →](docs/README_EN.md)

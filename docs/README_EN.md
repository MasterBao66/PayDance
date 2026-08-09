
<p align="center">
  <img src="../src-tauri/icons/icon.png" alt="PayDance" width="92">
</p>

<h1 align="center">PayDance 薪跳</h1>

<p align="center">
  Put the money you are earning today on your desktop
</p>

<p align="center">
  <a href="https://paydance.vercel.app/en/"><strong>Live Preview</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="https://github.com/MrBaoboer/PayDance/releases/latest"><strong>Download</strong></a>
  &nbsp;&nbsp;·&nbsp;&nbsp;
  <a href="../README.md">中文</a>
</p>

<p align="center">
  <a href="https://github.com/MrBaoboer/PayDance/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/MrBaoboer/PayDance?style=flat&label=release&labelColor=1F2328&color=F59E0B"></a>
  <a href="https://github.com/MrBaoboer/PayDance/releases"><img alt="Downloads" src="https://img.shields.io/github/downloads/MrBaoboer/PayDance/total?style=flat&label=downloads&labelColor=1F2328&color=3D444D"></a>
  <a href="../LICENSE"><img alt="License" src="https://img.shields.io/badge/license-AGPL--3.0--only-3D444D?style=flat&labelColor=1F2328"></a>
</p>

---

## What It Is

PayDance (薪跳) is a desktop real-time salary dashboard. Set your salary and working hours, and it shows today's earnings on your desktop in real time.

The main window shows today's earnings, work progress, time remaining, and daily estimate. The mini floating window keeps only the amount, ready for a quick glance from the corner of your screen.

<p align="center">
  <img src="posters/poster-02-three-step-setup-en-v1.png" alt="PayDance first-time setup in three steps" width="100%">
</p>

## Features

- **Live earnings**: Today's amount updates continuously and is shown to two decimal places.
- **Common pay schedules**: Supports monthly, daily, and hourly pay, configurable workdays, lunch-break exclusion, and overnight shifts.
- **Mini window**: Shows only the amount, stays draggable and always on top, and supports 10%–100% opacity. Double-click it to restore the main window.
- **Local-first**: No account required; your salary settings stay on your own machine.
- **Bilingual UI**: The interface, tray menu, and validation messages support Simplified Chinese and English.
- **Windows integration**: Includes light and dark themes, a system tray, auto-start, and background updates.

## Get It

| Version | Notes |
| ------- | ----- |
| [Web Preview](https://paydance.vercel.app/en/) | Try the interface and salary calculations in a browser |
| [Windows desktop app](https://github.com/MrBaoboer/PayDance/releases/latest) | Portable EXE with tray, always-on-top, mini-window, and auto-start support |

Each release includes a SHA256 checksum file so you can verify the download.

## Tech Stack

| Layer | Technologies |
| ----- | ------------ |
| Desktop shell | Tauri 2 + Rust |
| Frontend | Vue 3 + TypeScript + Vite |
| UI | Windows 11 styling, CSS Container Queries, Lucide Icons |
| Storage | Local app data directory (Tauri Store) / browser localStorage |
| Testing | Vitest + Rust unit tests + vue-tsc + cargo clippy |

The Web Preview and desktop app share the same core salary logic and frontend UI.

## Development

**Install dependencies**

```powershell
npm ci
```

**Desktop app**

```powershell
npm run tauri dev
```

**Web Preview**

```powershell
npm run dev:web
```

**Build Windows portable EXE**

```powershell
npm run build:exe
```

**Build web preview**

```powershell
npm run build:web
```

**Reset local config to open the first-run wizard again**

```powershell
Remove-Item "$env:APPDATA\com.masterbao.paydance\salary-settings.json"
```

For commit conventions, verification commands, and contribution workflow, see the [Contributing Guide](CONTRIBUTING_EN.md).

## Privacy

PayDance requires no login, does not upload salary or settings data, and includes no telemetry. Tauri Store saves the configuration locally in `salary-settings.json`, including salary parameters, working hours, and UI preferences.

## Documentation

- [FAQ](FAQ_EN.md)
- [Architecture and Change Map](ARCHITECTURE_EN.md)
- [Product Positioning & Boundaries](PRODUCT_EN.md)
- [Roadmap](ROADMAP_EN.md)
- [Changelog](../CHANGELOG_EN.md)

## License

Designed and developed by Mr.Baoboer. Code licensed under [AGPL-3.0-only](../LICENSE).

For full license information and trademark policy, see the [Legal Guide](../legal/LEGAL_EN.md).

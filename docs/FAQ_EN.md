# FAQ

> [中文版 →](FAQ.md)

For product scope, see [PRODUCT_EN.md](PRODUCT_EN.md); for support and feedback paths, see [SUPPORT_EN.md](SUPPORT_EN.md).

## Product and Use Cases

### What does PayDance do?

PayDance is a desktop real-time salary dashboard. Once you set your salary and working hours, it keeps today's earnings on your desktop and grows the amount as the workday goes on. It suits Windows 11 users who like lightweight, local-only tools.

### Can it replace an attendance, timesheet, or payroll tool?

No. PayDance only shows today's live earnings — no keyboard shortcuts, reminders, history charts, clock-in tracking, or cloud sync. See [PRODUCT_EN.md](PRODUCT_EN.md) for the full scope.

## Download and Usage

### Web Preview or the Windows desktop app?

Open the [Web Preview](https://paydance.vercel.app/en/) to try the core interface and the calculation logic. Tray, always-on-top, the mini floating window, and auto-start are native desktop capabilities that a browser cannot provide, so they ship only in the Windows desktop app.

### Which file should I download?

From the [latest Release](https://github.com/MrBaoboer/PayDance/releases/latest), download the file named `pay-dance-v<version>-windows-x64.exe`. The same page provides a SHA256 checksum file so you can verify the download.

### Why a portable EXE instead of an installer?

A portable EXE runs straight after download. To remove it, delete the EXE and the local settings file.

### How do I open the first-run wizard again?

Close the app, delete the local settings file, then start PayDance again:

```powershell
Remove-Item "$env:APPDATA\com.masterbao.paydance\salary-settings.json"
```

### Do Web Preview settings affect the desktop app?

No. The Web Preview keeps settings in browser `localStorage`; the desktop app uses Tauri Store in your local app data directory. Neither one reads the other.

## Salary and Time Calculation

### How is today's amount calculated?

Choose monthly, daily, or hourly pay. PayDance turns your workdays, start and end times, and lunch-break setting into an effective work period for the day, then reads the current time against it.

### Is the lunch break paid?

It depends on your settings. With lunch-break exclusion on, the break is not counted as effective work time. If your own pay rule does not deduct it, turn the option off.

### Are night shifts and work past midnight supported?

Yes. PayDance handles shifts that cross midnight.

### Does the amount match my actual paycheck?

No. It is a live estimate from the salary and schedule you entered, without taxes, social insurance, housing fund, bonuses, leave, overtime, or company-specific payroll rules.

## Privacy and Local Data

### Is my salary data uploaded?

No. PayDance has no account, cloud sync, telemetry, or advertising. Salary, working hours, and UI preferences stay on your device.

### Where are settings stored?

The Windows desktop app writes settings through Tauri Store to `salary-settings.json` in your local app data directory. That file holds your salary figures, so it counts as personal data. Delete it and the next launch starts from the first-run wizard.

## Desktop Capabilities

### How does the mini floating window work?

Double-click the amount in the main window to switch to mini floating mode. The mini window shows only the amount and sits well in a screen corner; double-click it to restore the main window.

### What are tray, always-on-top, and auto-start for?

The tray keeps PayDance running after the main window is closed, always-on-top keeps the dashboard visible, and auto-start suits long-term daily use. Each one can be turned on or off independently.

### Multi-monitor or high-DPI display looks wrong — what now?

Report it through [SUPPORT_EN.md](SUPPORT_EN.md) with the app version, Windows version, monitor count, DPI scaling, and reproduction steps. Screenshots or a recording help.

## Open Source, License, and Branding

### What license is it under, and can I use it commercially?

The code is released under [AGPL-3.0-only](../LICENSE) with additional terms permitted by AGPL Section 7. Commercial use is fine as long as you comply with both. Closed-source integration, OEM, white-label, and official brand use fall under separate commercial licensing — see [LEGAL_EN.md](../legal/LEGAL_EN.md).

### Can I fork it or publish a modified version?

Yes, but a modified version must preserve the required legal notices, state that it is not an official release, and use distinguishable names, icons, application identifiers, and release channels so it is not mistaken for the official build. For trademark and brand asset boundaries, see [TRADEMARK_EN.md](../legal/TRADEMARK_EN.md) and [BRAND-ASSETS_EN.md](../legal/BRAND-ASSETS_EN.md).

## Contributions and Feedback

### How do I report a bug?

Use the repository's Bug Report form; [SUPPORT_EN.md](SUPPORT_EN.md) lists what to include. Issues are public, so salary data and settings files do not need to be attached.

### What should I read before suggesting a feature?

Start with the product scope in [PRODUCT_EN.md](PRODUCT_EN.md). Describing the specific situation your idea solves helps more than describing the feature itself.

### Where can developers start?

Read the [Contributing Guide](CONTRIBUTING_EN.md), then pick up an issue labeled `good first issue` or `help wanted`. Copy, documentation, tests, the release workflow, and Windows desktop reliability are all good entry points.

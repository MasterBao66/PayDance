# FAQ

> [中文版 →](FAQ.md)

This page answers common questions before and after using PayDance. For product scope, see [PRODUCT_EN.md](PRODUCT_EN.md). For support and feedback paths, see [SUPPORT_EN.md](SUPPORT_EN.md).

## Product and Use Cases

### What does PayDance do?

PayDance is a desktop real-time salary dashboard. After you set your salary and working hours, it keeps today's live earnings on your desktop and updates the amount as your workday moves forward.

### Who is it for?

PayDance is for Windows 11 desktop users who want a more tangible sense of what their work time is worth. It is also for people who prefer lightweight, local-first tools with no account and no data upload.

### Is it a salary calculator, attendance tool, or time tracker?

No. PayDance is focused on showing today's live earnings. It is not designed for attendance management, timesheets, payroll calculation, or personal finance analysis.

### Why not add reminders, clock-in, history charts, or account sync?

Those directions would move PayDance toward time management, attendance, or cloud services. The current priority is to stay lightweight, local-first, and low-distraction. See [PRODUCT_EN.md](PRODUCT_EN.md) for the full boundary.

## Download and Usage

### Should I use the Web Preview or the Windows desktop app?

Use the [Web Preview](https://paydance.vercel.app/) if you want to try the core interface and calculation logic first. Use the Windows desktop app if you want the full tray, always-on-top, mini floating window, and auto-start experience.

### Which Windows file should I download?

Download `pay-dance-v0.9.8-windows-x64.exe` from the [latest Release](https://github.com/MrBaoboer/PayDance/releases/latest). The Release page also includes a SHA256 checksum file so you can verify the download.

### Why a portable EXE instead of an installer?

The current release strategy prioritizes a portable EXE to keep setup simple and reduce installer maintenance. You can run it directly; to remove it, delete the EXE and local configuration.

### How do I open the first-run wizard again?

Close the app, delete the local settings file, and start PayDance again:

```powershell
Remove-Item "$env:APPDATA\com.masterbao.paydance\salary-settings.json"
```

### Do Web Preview settings affect the desktop app?

No. Web Preview settings stay in browser `localStorage`. The Windows desktop app uses Tauri Store in your local app data directory. They do not share settings.

## Salary and Time Calculation

### How are monthly, daily, and hourly pay converted?

You can choose monthly, daily, or hourly pay. PayDance uses your workdays, start/end time, and lunch-break settings to estimate today's live earnings progress.

### Is lunch break counted as paid time?

It depends on your settings. If lunch break exclusion is enabled, the lunch period is not counted as effective work time. If your real pay rule does not exclude lunch, turn that option off.

### Does PayDance support night shifts or work across midnight?

Yes. PayDance handles overnight work so today's progress and live earnings remain within a reasonable boundary.

### Why does today's earnings amount keep changing?

PayDance calculates today's earnings from the current time, your effective work period, and your salary settings, so the amount keeps increasing during work hours.

### Is the displayed amount the same as my actual paycheck?

Not necessarily. It is a real-time estimate based on your settings. It does not include taxes, social insurance, housing fund, bonuses, leave, overtime, or company-specific payroll rules.

## Privacy and Local Data

### Does PayDance upload my salary data?

No. PayDance requires no account, uploads no data, and includes no telemetry. Salary settings, work hours, and UI preferences stay on your device.

### Where are settings stored?

The Windows desktop app stores settings through Tauri Store in `salary-settings.json` under the local app data directory. This file may contain personal salary information and should not be shared publicly.

### Can I delete local settings?

Yes. After deleting `salary-settings.json`, PayDance opens the first-run wizard on the next launch. Make sure you no longer need the old settings before deleting the file.

### Does PayDance include telemetry, ads, or accounts?

No. PayDance currently has no account system, cloud sync, telemetry, or advertising.

## Desktop Capabilities

### How does the mini floating window work?

Double-click the main amount to enter mini floating mode. The mini window shows only the amount and works well in a screen corner. Double-click it to restore the main window.

### What are tray, always-on-top, and auto-start for?

The tray lets PayDance keep running after the main window is closed. Always-on-top keeps the dashboard visible. Auto-start is useful if you want PayDance to be part of your daily desktop setup.

### Why are some desktop features missing from the Web Preview?

Web Preview runs in a browser, so it cannot provide native capabilities such as system tray, always-on-top windows, or auto-start. Those features are available in the Windows desktop app.

### What should I do if multi-monitor or high-DPI display looks wrong?

Record the app version, Windows version, monitor count, DPI scaling, and reproduction steps, then report it through [SUPPORT_EN.md](SUPPORT_EN.md). Screenshots or recordings are especially helpful.

## Open Source, License, and Branding

### Is PayDance open source?

Yes. The code is released under [AGPL-3.0-only](../LICENSE) with additional terms permitted under AGPL Section 7. See [LEGAL_EN.md](../legal/LEGAL_EN.md) for the full guide.

### Can I use it commercially?

Yes, as long as you comply with AGPL-3.0-only and the project's additional terms. For closed-source integration, OEM, white-label, or official brand licensing, see the commercial licensing notes in [LEGAL_EN.md](../legal/LEGAL_EN.md).

### Can I fork it or publish a modified version?

Yes, but modified versions must preserve required legal notices, clearly state that they are not official releases, and use distinguishable names, icons, application identifiers, and release channels.

### Why can't modified versions use the official name, icon, or posters directly?

This avoids confusing users into thinking a third-party modified version is official. See [TRADEMARK_EN.md](../legal/TRADEMARK_EN.md) and [BRAND-ASSETS_EN.md](../legal/BRAND-ASSETS_EN.md) for the trademark and brand asset boundaries.

### When do I need separate commercial authorization?

Closed-source integration, OEM, white-label distribution, official brand use, or licensing models that do not fit AGPL-3.0-only usually require separate authorization. Contact via the email listed on the author's GitHub profile.

## Contributions and Feedback

### How should I report a bug?

Use the repository's Bug Report form when possible, and include the version, system environment, reproduction steps, expected behavior, and actual behavior. Do not publicly paste salary data, configuration files, private keys, or other sensitive information.

### What should I read before suggesting a feature?

Read [PRODUCT_EN.md](PRODUCT_EN.md) first to check whether the idea supports the core desktop real-time wage board experience. Ideas close to reminders, attendance, history charts, accounts, or sync need to explain why they would not make PayDance heavier.

### Where can developers start contributing?

Read the [Contributing Guide](CONTRIBUTING_EN.md), then look for issues labeled `good first issue` or `help wanted`. Copy, documentation, tests, release workflow, and Windows desktop reliability are all good entry points.

### What should a platform-adaptation proposal include?

Include the target system, build flow, validation scope, manual smoke items, update path, and the maintenance scope you can support. Before an official release, build, validation, update, and maintenance boundaries must be clear.

# FAQ

> [中文版 →](FAQ.md)

For product scope, see [PRODUCT_EN.md](PRODUCT_EN.md); for support and feedback paths, see [SUPPORT_EN.md](SUPPORT_EN.md).

## Download and Usage

### Web Preview or the Windows desktop app?

Use the [Web Preview](https://paydance.vercel.app/en/) to try the interface and calculation logic. The mini window and opacity control are simulated in the browser; the system tray, always-on-top mode, and auto-start are available only in the Windows desktop app.

### Which file should I download?

From the [latest Release](https://github.com/MrBaoboer/PayDance/releases/latest), download `pay-dance-v<version>-windows-x64.exe`. Verify it against the `.sha256` file on the same page:

```powershell
Get-FileHash .\pay-dance-v<version>-windows-x64.exe -Algorithm SHA256
```

The printed hash must match the one inside the `.sha256` file; case does not matter.

### How do I remove PayDance completely?

1. If auto-start was ever enabled, turn it off in Settings.
2. Quit PayDance from the tray.
3. Delete the EXE file.
4. To also erase your salary settings, delete `%APPDATA%\com.masterbao.paydance\salary-settings.json`.

### How do I open the first-run wizard again?

Close the app, delete the local settings file, then start PayDance again:

```powershell
Remove-Item "$env:APPDATA\com.masterbao.paydance\salary-settings.json"
```

### Do Web Preview settings affect the desktop app?

No. The Web Preview keeps settings in browser `localStorage`; the desktop app uses Tauri Store in your local app data directory. Neither one reads the other.

## Salary and Time Calculation

### How is today's amount calculated?

Choose monthly, daily, or hourly pay. PayDance first works out the day's effective working time from your workdays, start and end times, and lunch-break setting, then works out the day's pay: monthly salary divided by the "Work days per month" setting, daily salary as entered, or hourly rate times the effective working time. Today's amount grows in proportion to the effective working time already elapsed.

### Is the lunch break included in the calculation?

It depends on your settings. With lunch-break exclusion on, the break is not counted as effective work time. If your own pay rule does not deduct it, turn the option off.

### Are night shifts and work past midnight supported?

Yes. When the end time is earlier than the start time, the shift is treated as crossing midnight, and earnings keep accumulating for that same shift past 00:00.

### Does the amount match my actual paycheck?

No. It is a live estimate based on the salary and schedule you entered. It does not account for taxes, benefits, bonuses, leave, overtime, or employer-specific payroll rules.

## Privacy and Local Data

### Is my salary data uploaded?

No. PayDance has no account, cloud sync, telemetry, or advertising. Salary, working hours, and UI preferences stay on your device.

### Where are settings stored?

The Windows desktop app writes settings through Tauri Store to `%APPDATA%\com.masterbao.paydance\salary-settings.json`. That file holds your salary figures, so it counts as personal data. Delete it and the next launch starts from the first-run wizard.

## Desktop Capabilities

### How does the mini floating window work?

Double-click the amount in the main window to switch to mini floating mode. The mini window shows only the amount. Right-click it to adjust opacity, and double-click to restore the main window.

### Why does PayDance keep running after I close the main window?

The main window's close button hides PayDance to the system tray. Use the tray menu to reopen the window or quit the app. Always-on-top and auto-start can be changed independently in Settings.

### Multi-monitor or high-DPI display looks wrong — what now?

Report it through [SUPPORT_EN.md](SUPPORT_EN.md) with the app version, Windows version, monitor count, DPI scaling, and reproduction steps. Screenshots or a recording help.

## Open Source, License, and Branding

### What license is it under, and can I use it commercially?

The code is released under [AGPL-3.0-only](../LICENSE) with additional terms permitted by AGPL Section 7. Commercial use must comply with both. Closed-source integration, OEM, white-label distribution, and official brand use require separate permission. See [LEGAL_EN.md](../legal/LEGAL_EN.md).

### Can I fork it or publish a modified version?

Yes, but a modified version must preserve the required legal notices, state that it is not an official release, and use distinguishable names, icons, application identifiers, and release channels so it is not mistaken for the official build. For trademark and brand asset boundaries, see [TRADEMARK_EN.md](../legal/TRADEMARK_EN.md) and [BRAND-ASSETS_EN.md](../legal/BRAND-ASSETS_EN.md).

## Contributions and Feedback

### How do I report a bug?

Use the repository's Bug Report form; [SUPPORT_EN.md](SUPPORT_EN.md) lists what to include. Issues are public, so do not attach salary data or settings files.

### What should I read before suggesting a feature?

Start with the product scope in [PRODUCT_EN.md](PRODUCT_EN.md). Describing the specific situation your idea solves helps more than describing the feature itself.

### Where can developers start?

Read the [Contributing Guide](CONTRIBUTING_EN.md), then check open issues labeled `good first issue` or `help wanted`. Documentation and tests usually do not require a full Windows desktop environment.

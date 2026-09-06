# FAQ

> [中文版 →](FAQ.md)

## Download and Usage

### Live Preview or the Windows desktop app?

The [Live Preview (Web Preview)](https://paydance.vercel.app/en/) shows the interface and calculation logic; the mini window and opacity are simulated in the browser. The system tray, always-on-top mode, and launch at startup are available only in the Windows desktop app.

### Which file should I download?

From the [latest Release](https://github.com/MrBaoboer/PayDance/releases/latest), download `pay-dance-v<version>-windows-x64.exe`. Verify it against the `.sha256` file on the same page:

```powershell
Get-FileHash .\pay-dance-v<version>-windows-x64.exe -Algorithm SHA256
```

The printed hash must match the one in the `.sha256` file; case does not matter.

### How do I remove PayDance completely?

1. If launch at startup was ever enabled, turn it off in Settings.
2. Quit PayDance from the tray.
3. Delete the EXE file.
4. To also erase your salary settings, delete `%APPDATA%\com.masterbao.paydance\salary-settings.json`.

### How do I open the first-run wizard again?

Close the app, delete the local settings file, then start PayDance again:

```powershell
Remove-Item "$env:APPDATA\com.masterbao.paydance\salary-settings.json"
```

### Do Live Preview settings affect the desktop app?

No. The Live Preview keeps settings in browser `localStorage`; the desktop app saves them in your local app data directory. Neither reads the other.

## Salary and Time Calculation

### How is today's amount calculated?

PayDance first works out the day's effective working time from your workdays, start and end times, and lunch-break setting, then the day's pay: monthly salary divided by the "Work days per month" setting, daily salary as entered, or hourly rate times the effective working time. Today's amount grows in proportion to the effective working time already elapsed.

### Is the lunch break counted?

It depends on your settings. With lunch-break exclusion on, the break is not counted as effective working time. If your pay rule does not deduct it, turn the option off.

### Are night shifts and work past midnight supported?

Yes. When the end time is earlier than the start time, the shift is treated as crossing midnight, and earnings keep accumulating for that shift past 00:00.

### Does the amount match my actual paycheck?

No. It is a live estimate based on the salary and schedule you entered. It does not account for taxes, benefits, bonuses, leave, overtime, or employer-specific payroll rules.

## Privacy and Local Data

### Is my salary data uploaded?

No. PayDance has no account, cloud sync, telemetry, or advertising. Salary, working hours, and UI preferences stay on your device.

### Where are settings stored?

The Windows desktop app saves them to `%APPDATA%\com.masterbao.paydance\salary-settings.json`. That file holds your salary figures, so it is personal data; keep it private. Delete it and the next launch starts from the first-run wizard.

## Desktop Capabilities

### How does the mini window work?

Double-click the amount in the main window to switch to mini mode. The mini window shows only the amount; right-click it to adjust opacity, and double-click to restore the main window.

### Why does PayDance keep running after I close the main window?

The close button hides PayDance to the system tray. Use the tray menu to reopen the window or quit. Always-on-top and launch at startup can be changed independently in Settings.

### The display looks wrong on multiple monitors or at high DPI. What now?

File a bug as described under "Feedback and Help" below, with the app version, Windows version, monitor count, DPI scaling, and reproduction steps. Screenshots or a recording help.

## Open Source, License, and Branding

### What license is it under, and can I use it commercially?

The code is released under [AGPL-3.0-only](../LICENSE) with additional terms permitted by AGPL Section 7; commercial use must comply with both. Closed-source integration, OEM, white-label distribution, and official brand use need separate permission. See the [Legal Guide](../legal/LEGAL_EN.md).

### Can I fork it or publish a modified version?

Yes, but a modified version must keep the required legal notices, state that it is not an official release, and use distinguishable names, icons, application identifiers, and release channels. For trademark and brand-asset boundaries, see [TRADEMARK_EN.md](../legal/TRADEMARK_EN.md) and [BRAND-ASSETS_EN.md](../legal/BRAND-ASSETS_EN.md).

## Feedback and Help

### How do I report a bug or suggest a feature?

Pick the matching form on the [new Issue page](https://github.com/MrBaoboer/PayDance/issues/new/choose):

- Bugs: include the version, affected surface, reproduction steps, expected result, and actual result.
- Feature requests: check the [Product Boundaries](PRODUCT_EN.md) first, then describe the use case and the outcome you want. Platform adaptations must define a validation boundary; see the [Contributing Guide](CONTRIBUTING_EN.md).
- Anything else: use a blank Issue and explain the context and expected outcome.

Issues are public. Do not attach salary data, `salary-settings.json`, private keys, or other sensitive information, and redact logs and screenshots first.

### What if I find a security vulnerability?

Do not report it publicly. Follow the private process in the [Security Policy](SECURITY_EN.md).

### How do I reach the maintainer privately?

For project matters that should not be discussed publicly, use the email published on [Mr.Baoboer's GitHub profile](https://github.com/MrBaoboer).

### Where can developers start?

Read the [Contributing Guide](CONTRIBUTING_EN.md) and the [Technical Guide](DEVELOPMENT_EN.md), then look for open Issues labeled `good first issue` or `help wanted`. Documentation and tests usually do not need a full Windows desktop environment.

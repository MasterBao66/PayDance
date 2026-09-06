# Roadmap

> [中文版 →](ROADMAP.md)

This document records PayDance's development direction and does not commit to release dates. Completed changes are in the [CHANGELOG](../CHANGELOG_EN.md).

## Now

- Only manual items remain in the release chain: a real-world check of the portable auto-update path, and an updater key-rotation drill.
- Close the system-clock calibration gaps: large backward corrections, timezone changes, day crossing, and night-shift boundaries.
- Make background updater failures visible: keep network failures low-noise, and give manifest and signature-verification failures a clear message.
- Add preview examples to the onboarding wizard so setup immediately shows the daily estimate, per-minute earnings, and lunch-break pauses.

## Next

- Authenticode code signing to reduce Windows SmartScreen warnings.
- A context menu for the mini window: reset window position, restore main window.
- Extend coverage that only a real Windows session can validate: tray clicks, autostart after reboot, real sleep and resume.
- Publish starter tasks that have passed product-boundary review, each with a user-visible result, as an entry point for public feedback.

## Later

- Per-currency grouping separators and decimal rules, while keeping the main interface lightweight and staying out of exchange rates, tax, and financial analysis.

## Long-Term Exclusions

See the product boundaries in [PRODUCT_EN.md](PRODUCT_EN.md). Related proposals start with an Issue explaining why they still serve the core experience of a desktop real-time salary dashboard.

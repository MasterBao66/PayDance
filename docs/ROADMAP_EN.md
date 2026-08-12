# Roadmap

> [中文版 →](ROADMAP.md)

This document records PayDance's development direction. It is not a release-date promise.

## Recently Completed

Where the product stands today. For the per-version detail, see the [CHANGELOG](../CHANGELOG_EN.md):

- **Desktop reliability**: the hybrid clock rebases after long sleep or system-clock jumps; fully off-screen windows are pulled back into view while still-visible secondary-monitor placements are left alone; mini floating mode no longer holds a taskbar button.
- **Local settings**: migrations follow an explicit version chain, damaged or future-version settings are repaired field by field and written back, and write failures surface in the UI.
- **Release and supply chain**: Release runs an automated Windows EXE launch smoke and single-instance check and generates an SPDX SBOM; CodeQL analyzes TypeScript and Rust; GitHub Actions are pinned to commit SHAs and every security-tool download is SHA256-verified.
- **Website and accessibility**: Web Preview is gated in CI by multi-viewport screenshots, axe-core, and pixel diffs; the bilingual entry points are live on the Vercel primary site and the GitHub Pages mirror.

## Now

- Only manual items remain in the release chain: a real-world check of the portable auto-update path, and an updater key-rotation drill.
- Close the system-clock calibration gaps: large backward corrections, timezone changes, day crossing, and night-shift boundaries.
- Make background updater failures visible: keep network failures low-noise, and give manifest and signature-verification failures a clear message.
- Add preview examples to the onboarding wizard so setup immediately shows estimated daily earnings, per-minute earnings, and lunch-break pauses.

## Next

- Authenticode code signing to reduce Windows SmartScreen warnings.
- Mini floating-window context menu: reset window position, restore main window.
- Extend coverage that only a real Windows session can validate: tray clicks, autostart after reboot, real sleep/resume.
- Publish starter tasks that have passed product-boundary review and deliver a user-visible result, building a public feedback loop.

## Later

- Per-currency grouping separators and decimal rules, while keeping the main interface lightweight and staying out of exchange rates, tax, and financial analysis.

## Long-Term Exclusions

See the product boundaries in [PRODUCT_EN.md](PRODUCT_EN.md). Related proposals start with an Issue explaining why they still serve the core experience of a desktop real-time salary dashboard; for the submission process, see the [Contributing Guide](CONTRIBUTING_EN.md).

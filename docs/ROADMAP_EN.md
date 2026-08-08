# Roadmap

> [中文版 →](ROADMAP.md)

This document records PayDance's development direction. It is not a release-date promise; it helps maintainers, contributors, and users quickly understand current priorities.

## Recently Completed

- Web Preview automated QA is now enforced in CI: local server, multi-viewport screenshots, DOM, console, and axe-core accessibility checks, with evidence uploaded on failure.
- Desktop reliability baseline hardening: the hybrid clock rebases after long sleep or major forward system-clock jumps; window recovery brings fully off-screen saved positions back into a visible area.
- More trustworthy local settings: config migrations now use an explicit version chain, future-version configs are safely isolated, and settings write failures surface a lightweight UI message.
- Stronger updater and release chain: updater errors now distinguish missing development config, production signature failures, invalid manifests, and network failures; Release dry-runs include smoke checks for the current build artifacts, while post-release smoke no longer mistakes dry-runs for published Release verification.
- Web Preview and accessibility fixes: locale switching now syncs the HTML `lang` attribute, and updater badges use semantic buttons.
- Supply-chain, brand, and licensing baseline governance: `cargo audit`, `cargo deny`, gitleaks, locked dependencies, metadata tests, official asset boundaries, and bilingual documentation mirrors.
- Every CI security tool download is now SHA256-verified: gitleaks was previously downloaded without any checksum. All three pre-built tools (gitleaks, cargo-audit, cargo-deny) were upgraded along with their checksums.
- First-run and settings recovery: the mobile onboarding footer stays visible, Web Preview always opens in the full dashboard, and damaged or future-version settings are silently repaired field by field and written back.
- Release and supply-chain automation: real Rust unit tests cover update helpers; Release runs an automated Windows EXE launch smoke and single-instance check, generates an SPDX SBOM, and CodeQL analyzes TypeScript and Rust. All GitHub Actions are pinned to commit SHAs.
- Website discovery: the sharing image now uses the three-step setup poster, while the title and structured data describe a Windows desktop utility more accurately.
- Bilingual website entries: the Vercel primary site uses `/` and `/en/`, while the GitHub Pages mirror keeps `/PayDance/` and `/PayDance/en/`; both pages expose independent SEO metadata, reciprocal hreflang links, automatic dates, and sitemap entries.
- Maintenance evidence: Web Preview now has deterministic time/viewport pixel-diff gates; Rust tray actions have behavior-level tests, and EXE smoke records window responsiveness and single-instance results as JSON.
- Contributor entry points: bilingual architecture change maps connect common work to files and checks, while starter issues require a user-visible result, before evidence, acceptance criteria, and a verification command.
- Custom currency symbol: Settings takes any symbol as free text, or nothing at all, with a live preview, applied consistently across the dashboard, estimated daily earnings, salary details, and the mini window. No exchange-rate conversion.
- Mini mode no longer keeps a taskbar button: the main window drops its taskbar entry on entering mini mode and restores it on exit, with the tray icon remaining the recovery path.

## Now

- Complete the v0.9.6 release-chain review: confirm Latest Release status, public assets, `latest.json` compatibility, portable auto-update paths, and a key-rotation drill.
- Close remaining system-clock calibration gaps: major backward corrections, timezone changes, day crossing, and night-shift boundaries.
- Improve multi-monitor recovery: preserve still-valid secondary-monitor positions first, and add a reset-window-position entry point.
- Surface background updater failures appropriately: keep routine network failures low-noise, while clearly exposing manifest errors and signature-verification failures.
- Add onboarding preview examples so setup immediately shows estimated daily income, per-minute income, and lunch-break pause semantics.

## Next

- Authenticode code signing to reduce Windows SmartScreen warnings.
- Mini floating-window context menu: opacity, reset position, and restore main window.
- Continue coverage that requires a real Windows session: system-tray clicks, autostart after reboot, and actual sleep/resume.
- Add real updater signature verification.
- Publish product-boundary-reviewed, user-visible starter tasks and build a public feedback loop.

## Later

- Advanced per-currency formatting (grouping separators and decimal rules per currency), while keeping the main interface lightweight and avoiding exchange-rate, tax, or financial-analysis complexity.

## Long-Term Exclusions

These directions remain outside the long-term product focus. Related proposals should start with an Issue explaining why they still serve the core desktop real-time wage-board experience:

- Keyboard shortcuts / hotkeys
- Reminders / notifications / alerts
- Historical timelines / charts / trends
- Clock-in / attendance / timesheet tracking
- Cloud sync / accounts / online services

Roadmap decisions are grounded in [PRODUCT_EN.md](PRODUCT_EN.md) and the [Contributing Guide](CONTRIBUTING_EN.md).

# CHANGELOG

> [中文版 →](CHANGELOG.md)

This file records official PayDance releases. README introduces the product to new users; full version history and GitHub Release notes are maintained here.

Build artifacts and verification files are available in [GitHub Releases](https://github.com/MrBaoboer/PayDance/releases).

## Unreleased

### v0.9.8

- **Fixed the window disappearing after a full-screen game**: Windows parks a minimized window at the sentinel position `-32000, -32000` and reports it verbatim through the window move event. That coordinate was being treated as a real position and written to `salary-settings.json`, leaving the window stranded offscreen and invisible on the desktop. The move event, the position capture, and the settings write now all reject it, and a coordinate poisoned by an older build is cleared on the next save.
- **The tray and a second launch can always bring the window back**: `show()` does not un-minimize on Windows, so the tray menu, a tray left-click, and re-running the app all failed to recover a window a full-screen game had minimized. All three paths now un-minimize first and re-check that the window really lands inside a visible monitor work area. A window that is already partly visible is left exactly where the user put it.
- **Window size no longer shrinks after minimizing**: minimizing collapses the window client area, and that size was being recorded and saved, so the window came back at its minimum size. Minimized and zero-size states are no longer persisted.
- **Hardened settings against corrupt values**: window sizes now reject `NaN`, `Infinity`, and non-numeric content and are capped at a sane maximum, while coordinates also reject non-finite values and absurd magnitudes. A failure while applying the window mode at startup no longer aborts the rest of initialization, so the ticker, tray actions, and exit-save always register.
- **Regression tests**: added coverage for the minimize sentinel, corrupt sizes, offscreen recovery, and tray un-minimize. None of these write paths had any test before.
- **Website demo mode**: Web Preview now opens directly into the full wage dashboard with neutral demo salary, schedule, and preference defaults plus all seven workdays selected, without overwriting existing browser settings.
- **Onboarding remains available**: Web Preview Settings now includes a First-time setup action that reopens the existing three-step flow; Windows desktop first-run behavior is unchanged.

### v0.9.7

- **Language-first onboarding**: first-run setup now starts with usage preferences, then salary mode, then work time, so non-Chinese users can switch language on the first screen before entering salary and workday settings.
- **Independent Chinese and English website entries**: Chinese stays at `/PayDance/` and English now lives at `/PayDance/en/`. Each page has its own title, description, canonical URL, Open Graph metadata, and JSON-LD, connected by reciprocal hreflang links and a generated sitemap. Version and `dateModified` values are injected at build time.
- **Stable website refreshes**: Web Preview restores the saved theme before first paint and pauses color transitions until settings initialization finishes, preventing mixed light-page and black-control frames during refresh.
- **Dependency and CI baseline refresh**: Frontend dependencies move to their latest compatible versions; CI, CodeQL, and release workflows now use Node 24 and Windows 2025, while Pages artifact retrieval uses `actions/download-artifact` 8.0.1.
- **Faster daily pushes**: local push checks now cover metadata, formatting, lint, and unit tests, while GitHub CI handles slower builds, browser QA, Rust checks, and security audits. Formal releases still run the complete `npm run verify:release` path.
- **Maintenance foundation**: Renovate now runs immediately with unlimited concurrent PRs and human merge assessment; Web Preview has deterministic pixel-diff gates; Windows EXE smoke emits JSON evidence for window responsiveness and single-instance behavior.
- **Focused ownership**: tray and portable updater Rust, Web Preview styles, and the Settings repository footer are split by responsibility. Web builds receive only the version string instead of the complete `package.json`.
- **Contributor navigation**: bilingual architecture change maps now connect common changes to files and checks, while starter issues require a user-visible result, before evidence, acceptance criteria, and a verification command.

### v0.9.6

- **First-run fixes**: the mobile onboarding footer remains visible, and Web Preview always returns to the full dashboard instead of restoring the previous mini mode.
- **Silent settings self-repair**: a damaged value now resets only itself or the smallest linked group, preserving other valid preferences; repaired settings are written back without a persistent warning or automatically opening Settings.
- **Platform boundary**: Web Preview now uses browser-only storage, updater, and external-link adapters so its bundle does not pull in Tauri platform modules.
- **Rust regression tests**: cover update-version directory sanitization, Windows EXE recognition, spaced-path arguments, and install-directory write probes.
- **Release security**: added CodeQL, Windows EXE launch and single-instance smoke, SPDX SBOM generation, and full commit-SHA pinning for every GitHub Action.
- **Website SEO**: replaced the sharing image with a product-logo composition and reduced it from about 905 KB to about 45 KB; added a Windows desktop wage-dashboard title and corrected the structured-data category.

### v0.9.5

- **Independent full and mini window positions**: Each mode now saves and restores its own coordinates, so moving the mini window no longer overwrites the full window position.
- **Multi-monitor and DPI recovery fixes**: Window positions consistently use physical pixels and are validated against the actual primary monitor, per-monitor work areas, and scale factors, including left/right secondary displays, mixed scaling, taskbars, and disconnected-display fallback.
- **Mode-transition race fix**: The outgoing position is captured before resizing and the destination position snapshot is restored afterward, preventing resize events from contaminating the other mode's coordinates.
- **Regression coverage**: Added tests for mode transitions, independent positions, 150% DPI, negative secondary-monitor coordinates, and disconnected displays.

### v0.9.4

- **Desktop reliability hardening**: Hybrid clock recalibrates after long sleep or large system clock forward jumps while preserving monotonic earnings; window positions are clamped to visible monitor areas.
- **More trustworthy local settings**: Config migrations upgraded to explicit version chain; future-version configs are safely isolated; save failures now show a lightweight UI message instead of only console logs.
- **Updater and release-chain improvements**: Updater distinguishes missing dev config, production signature failures, invalid manifests, and network errors; Release dry-runs add a build-artifact smoke report, and post-release smoke no longer mistakes dry-runs for public Release verification.
- **Web Preview and accessibility**: Web Preview QA is enforced in CI; language switching syncs HTML `lang`; updater badges use semantic buttons.

### v0.9.3

- **License architecture reorganization**: Code license switched to AGPL-3.0-only; added AGPL §7 additional terms, trademark policy, brand asset license, project notice, third-party notices, and contributor license agreement; documentation license switched to CC BY-SA 4.0; README license section reorganized.
- **Removed NSIS installer**: Releases now publish only portable EXE + SHA256 + `.sig`; `latest.json` points to the portable direct download.
- **CI fix**: gitleaks switched from the broken `gitleaks/gitleaks-action@v2` path to a command-line installation, resolving Windows runner failures.

### v0.9.2

- **Sharing card improvements**: Added `og:image:alt`, `twitter:image:alt`, and richer JSON-LD metadata.
- **Supply-chain security**: CI added gitleaks, `cargo audit`, and `cargo deny check`.
- **Governance docs**: Added or refreshed SECURITY, CONTRIBUTING, TRADEMARK, ROADMAP, SUPPORT, and English mirrors.
- **README refresh**: Reflected bilingual UI and silent updater capabilities.
- **Web Preview language switcher**: Moved to the top-right and refined dark-mode styling.
- **Release workflow reliability**: Removed an unstable provenance-attestation step that intermittently returned 404.

### v0.9.1

- **Updater system completion**: Added real Tauri updater signing keys, `.sig` assets, and `latest.json` manifests for the portable build.
- **Update badge state machine**: Added downloading and failed states with retry.
- **Exit persistence**: Tray exit now flushes frontend state before quitting.
- **Tray internationalization**: Locale changes rebuild the Rust tray menu and tooltip.
- **Onboarding simplification**: Removed always-on-top and mini-mode options from the third setup step.
- **Window position persistence**: Saves and restores main-window positions with safe fallback after monitor changes.
- **Web Preview language switcher**: Added Chinese / English switching.
- **Web Preview deployment gate**: Deploys only after CI succeeds.
- **Post-release smoke workflow**: Validates latest release, README downloads, and `latest.json`.
- **Updater restart fix**: Added `tauri-plugin-process` restart capability.
- **Governance docs and code hygiene**: Added governance material and refreshed accessibility/test assertions.

### v0.9.0

- **Bilingual UI**: Added Simplified Chinese and English across UI, tray menu, and validation messages.
- **License update**: Switched code license to GPL-3.0-only at that time, added trademark notice, and adopted CC BY 4.0 for docs.
- **Website SEO**: Added Open Graph, Twitter Card, JSON-LD, `robots.txt`, and `sitemap.xml`.
- **Auto-update**: Added silent background checks with a lightweight update badge.
- **Code quality and automation**: Improved updater state handling, added Renovate, refreshed dependencies, and updated issue templates.

### v0.8.15

- Versioned Windows release asset names and SHA256 files to reduce download confusion.
- Synced README and Web Preview download links to versioned assets.
- Split Web Preview into smaller page, brand, hero, action, showcase, opacity-panel, and footer components.
- Added build-time entry selection and assertions to keep Web and Desktop bundles isolated.
- Refreshed npm and Rust lockfiles and issue-template versions.

### v0.8.14

- Reverted the v0.8.13 decorative-line direction and rebuilt the Web Preview around quieter titanium-black / warm-white material layers.
- Added favicon support and strengthened QA assertions for visual stability.
- Updated issue-template version hints.

### v0.8.13

- Refined Web Preview light/dark background layers, spacing, and showcase depth.
- Split showcase state and bottom-tag components; added QA assertions for mobile overlap and stage decoration.
- Updated issue-template version hints.

### v0.8.12

- Made desktop release builds explicitly use `build:desktop` before Tauri packaging.
- Added target assertions so Desktop and Web Preview builds cannot load the wrong runtime entry.
- Tightened first-screen spacing and reorganized README sections.
- Updated issue-template version hints.

### v0.8.11

- Reworked Web Preview hero layout and moved the three value tags into a bottom information strip.
- Unified product positioning around a desktop real-time wage board and refreshed related copy, tests, and font subsets.
- Updated issue-template version hints.

### v0.8.10

- Consolidated Web Preview subtitle copy into one line and simplified the three value tags.
- Fine-tuned action-button baselines and theme-transition borders.
- Added repeated light/dark switching QA and refreshed the local Chinese font subset.
- Updated issue-template version hints.

### v0.8.9

- Added the latest Chinese glyphs to the local font subset.
- Kept three value tags horizontally aligned across mobile and narrow widths.
- Added button icon-centering checks and refined footer alignment.
- Simplified README and product copy while improving QA cold-start tolerance.
- Updated issue-template version hints.

### v0.8.8

- Refined Web Preview subtitle and value tags around tangible labor value, focus, and privacy.
- Changed Windows download CTA to a direct EXE path and added Windows-style iconography.
- Corrected author attribution to `Mr.Baoboer` across the repository.
- Updated issue-template version hints.

### v0.8.7

- Reverted Web Preview version display to lightweight text instead of a large centered capsule.
- Rebalanced hero spacing and responsive two-column behavior.
- Simplified light-mode brand treatment.
- Updated issue-template version hints.

### v0.8.6

- Continued Web Preview first-screen refactor around a centered two-line headline.
- Added a local subset Chinese font and fixed scrolling in small browser windows.
- Restored matching light/dark mini-preview themes and simplified README hero actions.
- Updated issue-template version hints.

### v0.8.5

- Tightened Web Preview storefront layout and switched to a reliable system Chinese font stack.
- Refined light-mode logo, version display, GitHub button spacing, and mini-preview opacity behavior.
- Clarified that Web Preview stores browser-local settings only.
- Reworked README hero as a formal product entry.
- Updated issue-template version hints.

### v0.8.4

- Fixed narrow-width Web Preview title wrapping and scoped the chosen Chinese font to website copy only.
- Tightened GitHub button spacing and added regression assertions.
- Updated issue-template version hints.

### v0.8.3

- Reworked Web Preview headline hierarchy, typography, value tags, mini-preview contrast, and dark-stage depth.
- Fixed rounded-corner regression at low mini-preview opacity.
- Updated issue-template version hints.

### v0.8.2

- Simplified the Web Preview hero to Windows download and GitHub actions.
- Added product logo, current version, concise value tags, compact mini mode, and opaque dark-mode preview background.
- Removed a separate README recent-improvements section.
- Updated issue-template version hints.

### v0.8.1

- Reworked Web Preview into a product-oriented online storefront.
- Reduced preview-window size toward the desktop default and refined page hierarchy.
- Added prominent README Live Preview and Windows download entries.
- Updated issue-template version hints.

### v0.8.0

- Added PayDance Web Preview on GitHub Pages for browser-based salary calculation, onboarding, settings, and mini-mode simulation.
- Added build-target runtime selection so Web Preview does not call Tauri native APIs.
- Abstracted settings storage and external-link opening by platform.
- Hid desktop-only capabilities in Web Preview and documented the preview/full-app boundary.
- Added Pages deployment and Web Preview verification to local and CI workflows.
- Updated product docs and issue-template version hints.

### v0.7.16

- Restored the natural single-layer earnings glow from v0.7.9 and removed the harsher pulse introduced later.
- Preserved adaptive ticker performance optimizations and added regression tests.
- Updated issue-template version hints.

### v0.7.15

- Restored stable two-column settings fields in narrower desktop windows.
- Reworked settings attribution footer layout and removed scale/translation from earnings pulse.
- Unified onboarding and settings input typography and added regressions.
- Updated issue-template version hints.

### v0.7.14

- Changed earnings pulse into a short single-layer keyframe glow.
- Fixed progress-bar corner rendering and refined focus-ring scope.
- Added regression tests and updated issue-template version hints.

### v0.7.13

- Replaced frame-by-frame salary recomputation with adaptive scheduling based on cent changes and status boundaries.
- Split salary settings persistence from UI/window preference persistence.
- Improved progress rendering, verification scripts, keyboard accessibility, and constants.
- Updated issue-template version hints.

### v0.7.12

- Consolidated verification scripts around Node implementations and added ESLint, Vue accessibility linting, and Prettier checks.
- Extracted shared settings controls and salary-core modules.
- Added settings write/read validation, accessibility semantics, and file-size boundaries.
- Narrowed Tauri installer target and kept SHA256-based release verification.

### v0.7.11

- Slimmed the App entry into orchestration and extracted dashboard, overlays, drag logic, and formatting modules.
- Added an explicit monotonic clock model, latest-only window-state save queue, and smoother theme transitions.
- Refined dashboard separators, native dark inputs, and Node-based hygiene checks.

### v0.7.10

- Reused salary and schedule controls between settings and onboarding.
- Made config save failures non-fatal.
- Extracted theme tokens, simplified dark surfaces, refined spacing, and added behavior tests.

### v0.7.9

- Fixed salary-info panel theming in dark mode and restored readable amount colors.
- Added regression tests.

### v0.7.8

- Aligned opacity percentage styling, added high-DPI positioning regression tests, and reorganized README as a product storefront.

### v0.7.7

- Fixed mini-window opacity-panel centering based on visible content bounds and added alignment regressions.

### v0.7.6

- Fixed mini-window right-click opacity panel behavior, switched back to native physical-pixel geometry for Windows DPI, and added fallback tests.

### v0.7.5

- Improved mini-window opacity-panel centering and added tests across click positions.

### v0.7.4

- Fixed missing Tauri permissions for mini-window opacity panel, added fallback placement, and reduced panel size.

### v0.7.3

- Rebuilt the mini-window opacity control as a small floating panel and added screen-bound placement.
- Simplified earnings pulse into a restrained single-layer glow.

### v0.7.2

- Added config-load recovery fallback for damaged local settings or Store failures.
- Reduced opacity-panel size, extracted salary-info panel, and added recovery/interactions tests.

### v0.7.1

- Added right-click mini-window opacity control with 10%–100% range and local persistence.
- Added PowerShell/Git UTF-8 environment helpers.

### v0.7.0

- Reworked window boundaries from the v0.6.9 baseline and fixed dark-mode corner artifacts.
- Disabled unnecessary WebView context menus, kept tray behavior predictable, improved dragging, simplified mini-window visuals, and added Rust build caching.

### v0.6.9

- Fixed duplicate rounded dark edges after theme switching and refined dashboard typography.

### v0.6.8

- Removed outer light-gray padding, refined titlebar spacing, and simplified dark dashboard surfaces while preserving progress-bar texture.

### v0.6.7

- Added single-instance protection, refined theme switching, and flattened dark dashboard visuals.

### v0.6.6

- Fixed frontend/native theme desynchronization during rapid switching and refined dark-mode hover/dashboard surfaces.

### v0.6.5

- Aligned top-left status content and window controls; refined amount symbols and switched to a Windows 11-oriented number-font stack.

### v0.6.4

- Fixed progress-dot clipping, restored `h / m` durations, and removed thousands separators from the main amount.

### v0.6.3

- Corrected night-shift status copy, conditionally showed lunch inputs, and aligned autostart/lunch switches.

### v0.6.2

- Refined duration spacing, amount symbol sizing, and onboarding preference step with autostart option.

### v0.6.1

- Removed persistent per-second/per-minute helper copy so earnings remain the primary focus.
- Simplified amount decimals and progress-percentage visibility.

### v0.6.0

- Upgraded the main screen into an earnings-pulse dashboard with a stronger primary amount and compact stats.
- Intentionally avoided mini-mode changes, hotkeys, notifications, or segmented timelines.

### v0.5.17

- Fixed overnight-but-not-night-shift status copy and added autostart settings through the Tauri plugin.

### v0.5.16

- Added state-specific secondary dashboard metrics, strengthened overnight-shift boundaries, and added legacy-brand/sensitive-data scans.

### v0.5.15

- Fixed consecutive-workday night-shift ownership boundaries, refined settings attribution, updated dependencies, and added production dependency audit.

### v0.5.14

- Restored lightweight settings-card layout, preserved overnight shifts, and fixed early rest-day display after cross-midnight shifts.

### v0.5.10

- Replaced marketing poster assets, focused README screenshots on dashboard and three-step setup, and added version display plus manual-tag release support.

### v0.5.9

- Added README interface previews, shared numeric parsing, CSP, and tighter Tauri permissions.

### v0.5.8

- Added README hero poster, SHA256 example, local-config reset command, window-size persistence, and stronger GitHub Actions release checks.

### v0.5.7

- Added author attribution, repository button, and Tauri opener integration.

### v0.5.6

- Rebuilt README as a user-facing product homepage and added SHA256 release artifacts.

### v0.5.5

- Renamed the English product to PayDance while keeping 薪跳 in Chinese.
- Unified product positioning and cleaned up legacy branding and repository naming.

### v0.5.3

- Restored natural left alignment for onboarding numeric input, added visible units, published the stable version, and removed the previous Release.

### v0.5.0

- Added monthly, daily, and hourly salary modes with automatic conversion.
- Added weekly workday settings, first-run onboarding, and responsive main-window scaling.

### v0.4.1

- Completed product naming and copy cleanup, centered amount layout, and refreshed README.

### v0.2.0

- Added core salary unit tests, config validation, CI, and Release automation.
- Improved mini floating mode with drag, restore, remembered dimensions, and edge-case fixes.

### v0.1.0

- First public release with Windows 11-style real-time wage board, salary/schedule config, live earnings, mini float, tray, always-on-top, and light/dark themes.
- Fixed Chinese Release description encoding and the extra terminal window on Windows EXE startup.

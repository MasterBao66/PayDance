# Maintenance Conventions

> [中文版 →](MAINTENANCE.md)

## Settings Migration

- `settingsSchemaVersion` in `src/lib/settings-migration.ts` tracks the salary settings schema.
- When adding persisted fields, add migration tests before changing migration logic.
- Old settings must not block launch; unknown or unsafe values should fall back to defaults.
- Window size, mini mode, and opacity preferences keep their compatibility boundary in `src/lib/window-mode.ts`.
- When changing the schema, also check the read/write keys and save verification in `src/composables/useSalarySettings.ts`.
- Time, boolean, salary-number, and workday values must be normalized before use; unknown fields must not pass through to runtime config.
- Automatic recovery should reset only the damaged value or smallest linked group, preserve other valid settings, and immediately write back the repair; completed background repair must not remain as a persistent warning.

## Diagnostics and Logs

- User-facing errors should explain the next action: retry, check settings, or reopen the app.
- Maintainer diagnostics may stay in console or local logs, but should record only the failed stage and a safe error category — never salary values, private paths, keys, emails, or similar sensitive data.

## Desktop Release Smoke

Before each Windows release, use `docs/desktop-smoke-checklist.md` or the English checklist. Record at least:

- PayDance version and commit.
- Windows version.
- Monitor count and DPI scaling.
- Screenshot or note for any failed item.
- Whether tray, mini floating mode, always-on-top, auto-start, and update entry points were checked.

The Release workflow also runs `scripts/smoke-windows-exe.ps1` to confirm that the portable EXE creates a main window, remains stable, and rejects a second instance. The manual checklist still covers tray, autostart, and sleep scenarios that are not yet reliable to automate.

## Release Chain

- `latest.json` must point at the versioned Windows EXE.
- `.sha256` must match the actual EXE.
- `.sig` is the Tauri updater signature, not a Windows Authenticode publisher signature.
- Before adding Authenticode, confirm cost, certificate source, renewal, and rollback behavior.
- `release-assets/pay-dance-sbom.spdx.json` must be archived with each Release.
- Every GitHub Actions `uses:` reference must be pinned to a 40-character commit SHA with a version comment.
- The CodeQL workflow must explicitly analyze `javascript-typescript` and `rust`.

## Main Branch Pushes

- Maintainers may push copy, images, README changes, and low-risk documentation directly to `main` after running `npm run verify:metadata`.
- Product features, bug fixes, dependency upgrades, release workflows, and security-related changes should normally use a PR and wait for CI and CodeQL.
- Documentation-only changes still report `CI gate` and `CodeQL gate`, while CodeQL skips the expensive JavaScript and Rust analysis jobs.

## Dependency Updates

- Dependency updates are handled by Dependabot. Its configuration lives in `.github/dependabot.yml` and covers the npm, cargo, and github-actions ecosystems, checking every Monday at 09:00 Asia/Shanghai. Automerge is disabled.
- Upgrades that are deliberately held back live in two places that must stay in sync: the `ignore` block in `dependabot.yml`, and the "keeps the upgrades that are blocked upstream pinned with a reason" test in `scripts/repository-metadata.test.js`. Two entries today: `typescript` is held at 6.x (TypeScript 7 is the native port — vue-tsc cannot resolve `tsc.js` from it and typescript-eslint refuses to load), and `@types/node` is held at 24.x to track the runtime major.
- October 2026 follow-up: once Node 26 reaches LTS, move every CI `node-version` to 26, lift the `@types/node` major block, and drop the matching test assertion.
- `package.json` currently declares no `overrides`. Add one only as a stopgap and remove it once upstream catches up, otherwise it permanently forces a major into dependencies that declare a lower range.
- `glob@10.5.0` carries a deprecation flag and is known and accepted: it is only `require`d from the `js-beautify` CLI entry, which this repository never loads. Wait for js-beautify to upgrade instead.
- Declared ranges are documentation; the committed `package-lock.json` is what actually decides installs. When adjusting a `^` floor, follow the locked and verified version — especially for `@tauri-apps/*`, which is a matched pair with the Rust crates, where a stale floor implies an old IPC surface is still supported.

## Local Toolchain Alignment

- CI uses Rust `stable`. A lagging local toolchain makes `cargo clippy -D warnings` disagree with CI. Run `rustup check` to see the gap and `rustup update stable` to close it.
- `npm run verify:release` invokes the **local** cargo-audit and cargo-deny, while CI installs pinned versions. When the two differ, the local result does not count — realign with `cargo install cargo-audit cargo-deny --locked`.

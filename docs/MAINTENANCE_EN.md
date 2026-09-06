# Maintenance Conventions

> [中文版 →](MAINTENANCE.md)

For maintainers: compatibility rules for local settings, pushes to `main`, dependencies, toolchain, and releases. The contributor workflow lives in the [Contributing Guide](CONTRIBUTING_EN.md); use the [Architecture and Change Map](ARCHITECTURE_EN.md) to locate code.

## Settings Migration

- `settingsSchemaVersion` in `src/lib/settings-migration.ts` tracks the salary settings schema; the compatibility boundary for window size, mini mode, and opacity preferences lives in `src/lib/window-mode.ts`.
- `windowSettingsSchemaVersion` in `window-mode.ts` and the persisted `settingsVersion` are two separate counters; raising the former resets every user's window size.
- When adding persisted fields, add migration tests before changing migration logic. When changing the schema, also check the read/write keys and save validation in `src/composables/useSalarySettings.ts`.
- Old settings must not block launch. Normalize time, boolean, salary-number, and workday values before use, fall back to defaults for unknown or unsafe values, and never pass unknown fields through to the runtime config.
- Automatic repair resets only the damaged value or the smallest linked group, preserves other valid settings, and writes back immediately; a completed repair must not stay on screen as a warning.

## Diagnostics and Logs

- User-facing errors state the next step: retry, check settings, or reopen the app.
- Maintainer diagnostics stay in the console or local logs and record only the failed stage and a safe error category, never salary values, private paths, keys, or email addresses.

## Pushing to main

Copy, images, and low-risk documentation may go straight to `main`. Features, bug fixes, dependency upgrades, release workflow, and security-related changes go through a pull request and wait for CI and CodeQL.

- `npm run push:main` needs an authenticated GitHub CLI (`gh auth login`). It runs `npm run verify:metadata`, adds lint and unit tests when the change goes beyond documentation, and stops while Dependabot security alerts are open; it then pushes and waits for CI and CodeQL (and Web Preview when the change deploys the site). Builds, browser QA, Rust checks, and security audits are left to CI.
- `npm run verify:push` runs the same local checks without pushing.
- `npm run verify:release:record` writes a pass record to `.tmp/paydance-verification.json`; within two hours, `push:main` on the same HEAD skips the local checks.

CI trims jobs by changed files (`scripts/ci-change-scope.mjs`), and both gates check only the jobs judged necessary. A green gate does not mean everything ran:

- Documentation-only changes run the metadata job alone; frontend, Rust, Web Preview QA, security audit, and CodeQL are all skipped.
- Changes under `scripts/` trigger CodeQL, but Vitest belongs to the frontend job and runs only when frontend files change. Run `npm test` locally after editing a script.

## Dependency Updates

- Dependabot is configured in `.github/dependabot.yml`: npm, cargo, and github-actions, checked every Monday at 09:00 Asia/Shanghai, one group per ecosystem, no automerge. Its own pull requests are exempt from the DCO gate as long as the commits stay within dependency manifests and workflow files; the rule lives in `scripts/check-dco.mjs`.
- Upgrades deliberately held back live in two places that must stay in sync: the `ignore` block in `dependabot.yml`, and the test "keeps the upgrades that are blocked upstream pinned with a reason" in `scripts/repository-metadata.test.js`. Two entries today:
  - `typescript` stays on 6.x: TypeScript 7 is the native port, vue-tsc cannot resolve `tsc.js` from it, and typescript-eslint refuses to load.
  - `@types/node` stays on 24.x to track the runtime major. Once Node 26 reaches LTS, move every CI `node-version` to 26, lift this block, and drop the matching test assertion.
- When adding or removing a direct dependency, update `legal/THIRD_PARTY_NOTICES.md` and its English mirror; `npm run check:notices` compares both directions and runs inside `verify:metadata` and `verify:fast`.
- Declared ranges are documentation; the committed `package-lock.json` decides installs. When raising a `^` floor, follow the locked and verified version. `@tauri-apps/*` moves in lockstep with the Rust crates, and a stale floor suggests an old IPC surface is still supported.

## Toolchain

- CI uses Rust `stable`; a lagging local toolchain makes `cargo clippy -D warnings` disagree with CI. `rustup check` shows the gap, `rustup update stable` closes it.
- `npm run verify:release` invokes the local cargo-audit and cargo-deny. Their versions must match the ones pinned in CI, or the local audit result does not count:

  ```powershell
  cargo install cargo-audit --version 0.22.2 --locked
  cargo install cargo-deny --version 0.20.2 --locked
  ```

- `npm run build:exe` first checks whether `src-tauri/target/release/pay-dance.exe` is still running. A running instance blocks the build from overwriting it; quit from the tray and retry.

## Release

1. Bump the version in `package.json`, `src-tauri/tauri.conf.json`, and `src-tauri/Cargo.toml` together; `npm run version:check` verifies that they match.
2. In `CHANGELOG.md` and `CHANGELOG_EN.md`, move `## Unreleased` into `### vX.Y.Z`. `scripts/extract-release-notes.mjs` builds the GitHub Release body from that section of the Chinese changelog.
3. Run `npm run verify:release` (includes npm audit and Rust fmt, clippy, test, audit, and deny), then complete [Web Preview QA](web-preview-qa_EN.md) and the pre-release sections of the [desktop smoke checklist](desktop-smoke-checklist_EN.md).
4. `npm run push:main`, then wait for CI and CodeQL.
5. `npm run release:publish`: it checks the branch, worktree, sync with origin, version and changelog section, that the tag does not exist yet, and the CI results; then creates and pushes the annotated tag `v<version>`, waits for the Release and Post-Release Smoke workflows, and verifies that every Release asset is present. `--dry-run` runs the local checks only.
6. After publishing, run the "Portable Update" section of the smoke checklist: update from the previous release's EXE to the new version.

The Release workflow builds the portable EXE on `windows-2025` and attaches `.sha256`, the updater signature `.sig`, `latest.json`, an SPDX SBOM, the automated smoke report from `scripts/smoke-windows-exe.ps1`, and `release-manifest.json`. Post-Release Smoke downloads the published assets and re-checks hashes, manifests, and download links.

### Release Chain Invariants

- `latest.json` points at the versioned Windows EXE; the updater endpoint is fixed at `releases/latest/download/latest.json`.
- `.sha256` matches the actual EXE. `.sig` is the Tauri updater signature, not a Windows Authenticode publisher signature; before adding Authenticode, confirm cost, certificate source, renewal, and rollback.
- `pay-dance-sbom.spdx.json` is archived with every Release.
- Every GitHub Actions `uses:` is pinned to a 40-character commit SHA with a version comment.
- The CodeQL workflow explicitly analyzes `javascript-typescript` and `rust`.

### Updater Signing Key Compromise

1. Retire the compromised key and generate a new key pair.
2. Put the new public key in `plugins.updater.pubkey` of `src-tauri/tauri.conf.json`, and replace the `TAURI_UPDATER_PRIVKEY` and `TAURI_UPDATER_PRIVKEY_PASSWORD` GitHub Secrets.
3. Ship a release signed with the new key. Earlier releases can no longer auto-update; users must download manually.

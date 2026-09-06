# Contributing to PayDance

> [中文版 →](../.github/CONTRIBUTING.md)

## Before You Start

- Windows 11 is the release and validation baseline for the desktop app.
- Use Node.js 24, Rust stable, and npm. Desktop development also requires the [Tauri prerequisites for Windows](https://v2.tauri.app/start/prerequisites/): Microsoft C++ Build Tools and WebView2.
- Read the [Product Boundaries](PRODUCT_EN.md) first. Use the [Architecture and Change Map](ARCHITECTURE_EN.md) to find the relevant code; UI changes follow the [design guide](DESIGN.md), which is Chinese-only.

Install dependencies, then start either the desktop app or Web Preview:

```powershell
npm ci
npm run tauri dev # Desktop app
npm run dev:web   # Web Preview
```

If PowerShell garbles Chinese text, run `npm run setup:encoding`. It writes UTF-8 settings into your PowerShell profile and changes the global git encoding configuration.

## Confirm the Scope

Focused bug fixes, tests, and documentation changes can go directly to a pull request. Open an Issue first for larger features, product-direction changes, or platform adaptations, and describe the use case and boundaries.

Before starting work on an Issue, confirm that it states the user-visible result, evidence of the current behavior, scope, acceptance criteria, and a verification command. Fill in missing details in the Issue before implementation.

Platform adaptations must define their validation boundary: target system, build command, manual smoke checks, update method, and ongoing maintenance scope.

## Your First Contribution

Start with an Issue labeled `good first issue` or `help wanted`. These usually touch one or two main files and require no release keys, update signing, or cross-module migration.

If a claimed Issue sees no plan, commit, or progress update for 7 days, a maintainer may release the claim.

## Pull Request Requirements

1. Keep each pull request focused on one problem; leave unrelated refactoring out.
2. Cover new behavior with tests and bug fixes with regression tests.
3. For user-visible changes, update `## Unreleased` in both [CHANGELOG.md](../CHANGELOG.md) and [CHANGELOG_EN.md](../CHANGELOG_EN.md). Tests, internal maintenance, and minor documentation edits do not need changelog entries.
4. Include before-and-after screenshots for UI changes, covering the affected themes and languages.
5. Add user-facing copy to `src/i18n/locales/zh-CN.ts` and `src/i18n/locales/en.ts`, and update `src/i18n/types.ts`. Do not hardcode UI copy in components.
6. Leave version numbers unchanged; maintainers update them during a release.
7. Prefix commit subjects with `feat:`, `fix:`, `docs:`, `test:`, `chore:`, or `refactor:`.

## DCO and Licensing

Ordinary contributions only need a DCO sign-off; no CLA is required upfront.

Every non-merge commit must contain a `Signed-off-by:` line whose email matches the commit author. Use `git commit -s` to add it; CI checks each commit.

Code contributions enter the project under [AGPL-3.0-only](../LICENSE) with [additional terms under AGPL Section 7](../legal/ADDITIONAL_TERMS_EN.md). Original documentation enters under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) unless otherwise noted. By contributing, you confirm that you have the right to submit the material and accept the applicable project license.

A maintainer will request the [Contributor License Agreement (CLA)](../legal/CLA_EN.md) before merge only when a contribution is needed for commercial, OEM, or other non-AGPL licensing. A DCO sign-off does not sign the CLA.

See [TRADEMARK_EN.md](../legal/TRADEMARK_EN.md) and [BRAND-ASSETS_EN.md](../legal/BRAND-ASSETS_EN.md) for trademark and brand-asset rules.

## Verification

Run the checks that match the change:

```powershell
npm run verify:metadata # Docs, legal, brand, and community templates
npm run verify:fast     # Frontend or desktop code
npm run qa:web-preview  # Web Preview behavior or styling
```

`build:desktop` and `build:web` share `dist/`; do not run them in parallel.

For Rust changes, also run these commands in `src-tauri/`:

```powershell
cargo fmt --all -- --check
cargo check
cargo clippy --all-targets -- -D warnings
cargo test
```

For dependency or security changes, also run `npm audit --audit-level=high`. Rust dependency changes additionally require `cargo audit` and `cargo deny check`.

## Related Policies

- [Code of Conduct](CODE_OF_CONDUCT_EN.md)
- [Maintainers](MAINTAINERS_EN.md)
- [Governance](GOVERNANCE_EN.md)
- [Maintenance](MAINTENANCE_EN.md): the maintainer's push, dependency, and release workflow

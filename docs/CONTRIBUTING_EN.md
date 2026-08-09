# Contributing to PayDance

> [中文版 →](../.github/CONTRIBUTING.md)

Thanks for your interest in PayDance. This project is intentionally small: it puts today's live earnings on the desktop in a calm, clear way. Please read the boundaries and workflow below before opening an Issue or PR.

> **License in one sentence: Ordinary contributions only need a DCO sign-off; no CLA is required upfront.**

## Environment

- **OS**: the official release and validation baseline is Windows 11; Web Preview covers the core experience in a browser; platform-adaptation contributions need a stated validation boundary
- **Runtime**: Node.js 24 (matching CI) and the latest stable Rust
- **Package manager**: npm

Once those are in place, these three commands get you running:

```powershell
npm install
npm run tauri dev # Desktop app
npm run dev:web   # Browser Web Preview
```

## Before Submitting

Choose the checks that match your change. CI selects lightweight or full verification by path, but running locally first saves review round trips.

```powershell
npm run verify:metadata # Docs, legal, brand, and community-template changes
npm run verify:fast     # Lint, format, tests, desktop build, Web Preview build
npm run qa:web-preview  # Web Preview visual and DOM/console validation
```

For Rust, release, or security-governance changes, also run in `src-tauri/`:

```powershell
cargo fmt --all -- --check
cargo check
cargo clippy --all-targets -- -D warnings
cargo audit
cargo deny check
```

## Maintainer Push Workflow

Push to `main` with `npm run push:main`; it decides the check scope from the paths being pushed. To verify without pushing, run `npm run verify:push`.

Before a formal release, run `npm run verify:release` for the full path: desktop and Web builds, npm/Rust security audits, Rust formatting, compile checks, Clippy, and tests. Release audits depend on these local tools:

```powershell
cargo install cargo-audit --version 0.22.2 --locked
cargo install cargo-deny --version 0.20.2 --locked
gh auth login
```

Match the versions CI pins, or the local audit result does not count — see [docs/MAINTENANCE.md](https://github.com/MrBaoboer/PayDance/blob/main/docs/MAINTENANCE.md).

> `npm run build:desktop` and `npm run build:web` write to the same `dist/` directory — do not run them in parallel.

## Where to Contribute

Changes we welcome:

- Bug fixes with reproduction steps
- Desktop reliability: window management, tray, autostart, single instance
- Windows 11 UI polish: theming, accessibility, DPI, multi-monitor behavior
- Platform-adaptation proposals
- Performance and edge-case work on the wage ticker
- Tests for clock changes, config migration, night shifts, and similar boundaries
- Chinese/English copy, documentation, release workflow, and community templates

PayDance is not a time tracker, personal finance manager, payroll system, attendance system, or task manager, and keyboard shortcuts, reminders, history charts, clock-in tracking, and cloud sync all sit outside its boundary. See [PRODUCT_EN.md](PRODUCT_EN.md) for the full scope.

Small changes can go straight to a PR. Larger features, platform adaptations, or direction changes should start with an Issue describing the use case and its boundary — as should anything that feels borderline.

## Your First Contribution

Start from an Issue labeled `good first issue` or `help wanted`. Such work normally touches only 1–2 primary files and needs no release keys, updater signing, or cross-module migration. Use this checklist before and after you start:

- The Issue is still open and states the **user-visible result**, reproduction evidence or screenshots, bounded scope, **Acceptance criteria**, and one **Verification command**.
- UI changes include before/after screenshots; behavior fixes include a test that fails before the fix and passes after it.
- The PR resolves that one Issue only, without unrelated refactoring, release notes, or documentation cleanup.
- The PR description carries a short summary, the verification command you ran, and a `Signed-off-by:` line.

A claimed Issue may be released after seven days without a plan, commit, or progress update.

## PR Guidelines

1. **One change per PR.** Do not mix a bug fix, refactor, and documentation sweep.
2. **Write tests.** New behavior needs coverage; bug fixes need a regression test.
3. **Follow existing code style.** Prefer established patterns in the codebase.
4. **Update [CHANGELOG.md](../CHANGELOG.md) and [CHANGELOG_EN.md](../CHANGELOG_EN.md)** under `## Unreleased`; for internal verification or tiny doc polish, note why it does not apply.
5. **Include screenshots for UI changes**, covering at least light/dark mode and Chinese/English.
6. **State the validation boundary for platform adaptations**: target OS, build command, manual smoke items, update endpoint, and brand-distinction approach.
7. **Use conventional commits**: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`.

## i18n

User-facing strings must appear in both `src/i18n/locales/zh-CN.ts` and `src/i18n/locales/en.ts`, with a type definition in `src/i18n/types.ts`. Do not hardcode Chinese or English strings in Vue components or TypeScript.

## Versioning

PayDance follows [Semantic Versioning](https://semver.org/). Release versions are managed by the project author. Do not bump the version number in your PR.

## License Details

The project code is released under [AGPL-3.0-only](../LICENSE) with [additional terms under AGPL Section 7](../legal/ADDITIONAL_TERMS_EN.md). By submitting a code contribution, you confirm that:

- You are legally entitled to make the contribution and it is your original work, or you have the necessary permissions;
- You agree that your contribution is incorporated into the project under AGPL-3.0-only and the project's additional terms;
- You include a `Signed-off-by:` line (DCO) with your submission, confirming its lawful origin.

If the maintainer needs to include a contribution in commercial, OEM, or white-label licensing, you will be asked to sign the [Contributor License Agreement (CLA)](../legal/CLA_EN.md) before merge; Issues, suggestions, and security reports need no signature.

For trademark and brand assets, see [TRADEMARK_EN.md](../legal/TRADEMARK_EN.md) and [BRAND-ASSETS_EN.md](../legal/BRAND-ASSETS_EN.md).

## Maintenance and Governance

- Code of Conduct: [CODE_OF_CONDUCT_EN.md](CODE_OF_CONDUCT_EN.md)
- Maintainers: [MAINTAINERS_EN.md](MAINTAINERS_EN.md)
- Governance: [GOVERNANCE_EN.md](GOVERNANCE_EN.md)
- Maintenance conventions: [MAINTENANCE_EN.md](MAINTENANCE_EN.md)

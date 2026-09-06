# Contributing to PayDance

> [中文版 →](../.github/CONTRIBUTING.md)

Environment setup, architecture, and verification details are in the [Technical Guide](DEVELOPMENT_EN.md); read the [Product Boundaries](PRODUCT_EN.md) before starting.

## Confirm the Scope

Focused bug fixes, tests, and documentation changes can go straight to a pull request. Open an Issue first for larger features, product-direction changes, or platform adaptations, and describe the use case and boundaries.

Before working on an Issue, confirm that it states the user-visible result, evidence of the current behavior, scope, acceptance criteria, and a verification command. Fill in what is missing in the Issue first.

Platform adaptations must define their validation boundary: target system, build command, manual smoke checks, update method, and ongoing maintenance scope.

## Your First Contribution

Start with an Issue labeled `good first issue` or `help wanted`. These usually touch one or two main files and need no release keys, update signing, or cross-module migration.

If a claimed Issue sees no plan, commit, or progress update for 7 days, the maintainer may release the claim.

## Pull Request Requirements

1. Keep each pull request to one problem; leave unrelated refactoring out.
2. Cover new behavior with tests and bug fixes with regression tests.
3. For user-visible changes, update `## Unreleased` in both [CHANGELOG.md](../CHANGELOG.md) and [CHANGELOG_EN.md](../CHANGELOG_EN.md). Tests, internal maintenance, and minor documentation edits do not need entries.
4. Include before-and-after screenshots for UI changes, covering the affected themes and languages.
5. Add user-facing copy to `src/i18n/locales/zh-CN.ts` and `src/i18n/locales/en.ts`, and update `src/i18n/types.ts`. Do not hardcode UI copy in components.
6. Leave version numbers unchanged; the maintainer updates them at release time.
7. Prefix commit subjects with `feat:`, `fix:`, `docs:`, `test:`, `chore:`, or `refactor:`.

## Verification

Run the checks that match the change:

```powershell
npm run verify:metadata # Docs, legal, brand, and community templates
npm run verify:fast     # Frontend or desktop code
npm run qa:web-preview  # Web Preview behavior or styling
```

The additional commands for Rust, dependency, and security changes are in the "Verification" section of the Technical Guide.

## DCO and Licensing

Ordinary contributions only need a DCO sign-off; no CLA is required upfront.

Every non-merge commit must carry a `Signed-off-by:` line whose email matches the commit author. `git commit -s` adds it, and CI checks each commit. The only exception is a dependency-update pull request opened by Dependabot itself: its commits only rewrite versions and hashes and are confined to `package.json`, `package-lock.json`, `src-tauri/Cargo.*`, and `.github/workflows/*.yml`. Bot commits outside those paths, and commits a person adds to the same branch, still need a sign-off.

Code contributions enter the project under [AGPL-3.0-only](../LICENSE) with the [additional terms under AGPL Section 7](../legal/ADDITIONAL_TERMS_EN.md). Original documentation enters under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) unless otherwise noted. By contributing, you confirm that you have the right to submit the material and accept the applicable project license. The maintainer requests the [Contributor License Agreement (CLA)](../legal/CLA_EN.md) before merge only when a contribution is needed for commercial, OEM, or other non-AGPL licensing; a DCO sign-off does not sign the CLA.

See [TRADEMARK_EN.md](../legal/TRADEMARK_EN.md) and [BRAND-ASSETS_EN.md](../legal/BRAND-ASSETS_EN.md) for trademark and brand-asset rules.

## Related Policies

- [Code of Conduct](CODE_OF_CONDUCT_EN.md)
- [Security Policy](SECURITY_EN.md)
- [Technical Guide](DEVELOPMENT_EN.md): architecture, verification, releases, and governance

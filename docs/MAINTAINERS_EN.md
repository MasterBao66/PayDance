# Maintainers

> [中文版 →](MAINTAINERS.md)

See [Governance](GOVERNANCE_EN.md) for decision rules.

## Current Maintainer

- Mr.Baoboer / MrBaoboer
- GitHub: <https://github.com/MrBaoboer>

## Triage Order

1. Security reports submitted privately under the [Security Policy](SECURITY_EN.md)
2. Reproducible bugs affecting the currently supported surfaces
3. Focused pull requests with relevant verification complete that fit the [Product Boundaries](PRODUCT_EN.md)
4. Feature requests and other discussions

The project has a single maintainer and does not promise a fixed response time.

## Releases

There is no fixed release cadence; a release ships once a complete, fully verified set of changes has accumulated.

Before release, run `npm run verify:release`, complete Web Preview QA and the [Windows desktop smoke checklist](desktop-smoke-checklist_EN.md), and pass the required GitHub checks. See [Maintenance](MAINTENANCE_EN.md) for details.

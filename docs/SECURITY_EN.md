# Security Policy

> [中文版 →](../.github/SECURITY.md)

## Supported Versions

Only the latest release receives security fixes.

## Supported Platforms

Releases and security fixes cover the **Windows 11 desktop app** and the **Web Preview**.

`Cargo.lock` contains macOS/Linux dependencies pulled in by Tauri upstream. They are scanned like everything else; when an advisory only affects a platform that has not shipped yet, the assessment is recorded and tracked upstream.

## Reporting a Vulnerability

Please do not report security vulnerabilities through public Issues. Use one of these private channels instead:

- **GitHub Security Advisory** (preferred): submit at [Security Advisories](https://github.com/MrBaoboer/PayDance/security/advisories/new)
- **Email**: use the address listed on the [author's GitHub profile](https://github.com/MrBaoboer), with `[SECURITY]` in the subject line

Include a description of the vulnerability, steps to reproduce, the affected versions, and any mitigations you have found.

### What to Expect

- **Acknowledgment**: within 72 hours
- **Assessment**: within 5 business days
- **Fix**: depends on severity; critical issues come first
- **Disclosure**: after a fix ships and users have had time to update

## Local Data and Sensitive Information

PayDance is a local-first application. Salary figures, work schedules, and preferences stay in `salary-settings.json` under the local app data directory and are never sent to a remote server. That file contains personal information, so keep it private.

Do not paste salary data, configuration files, logs, private keys, or signing keys into any public channel.

## Signing Key Compromise

If the Tauri updater signing key is compromised:

1. Revoke the compromised key immediately
2. Generate a new key pair
3. Update `tauri.conf.json` with the new public key
4. Ship a new release signed with the new key
5. Earlier releases can no longer auto-update; users must download manually

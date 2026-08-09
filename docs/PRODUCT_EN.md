# PRODUCT

> [中文版 →](PRODUCT.md)

This document defines PayDance's product positioning, capability boundaries, and trade-off principles.

## One-Sentence Positioning

PayDance is a desktop real-time salary dashboard that keeps today's earnings quietly on screen, ticking upward, ready to scan at a glance.

## Who It Is For

- Windows 11 users who want a more tangible sense of what their working time is worth.
- People who prefer lightweight tools: no account, local storage, nothing uploaded.
- People who want always-on-top, a tray icon, and a mini floating earnings window they can leave running all day.
- People who want to try the feel in a browser before downloading the desktop app.

## Product Boundaries

The following directions are currently outside the product scope:

- Keyboard shortcuts / hotkeys
- Reminders / notifications / alerts
- Historical timelines, charts, or trend analysis
- Clock-in, attendance, or timesheet tracking
- Cloud sync, account systems, or online services
- Turning mini floating mode into a complex panel
- Presenting the Web Preview as the full desktop app

Every new feature answers one question first: does it help users see "the money they are earning today" more easily?

## Experience Principles

- The main window carries the full picture; the mini floating window carries a low-presence amount.
- Salary rules stay close to real schedules: monthly, daily, and hourly modes, weekly workdays, lunch-break exclusion, and night shifts crossing midnight.
- Local-first: salary and schedule settings stay on the device, with no login, cloud sync, telemetry, or ads.
- Salary details and settings are low-frequency entry points and never compete with the dashboard for attention.
- Error messages stay concise, direct, and actionable.

## Platform Strategy

The current official release and validation priority is Windows 11, and the desktop app carries the complete capability set: tray, always-on-top, transparent windows, mini floating mode, system materials, and autostart. Web Preview is the online entry point published on the Vercel primary site, with GitHub Pages serving as a repository mirror and release-validation entry.

This does not exclude macOS, Linux, or other platforms. Community contributors can start by submitting platform-adaptation proposals and validation results; before an official release, the build, validation, updater, and maintenance boundaries still need to be settled.

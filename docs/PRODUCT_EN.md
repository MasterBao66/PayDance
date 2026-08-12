# Product Positioning & Boundaries

> [中文版 →](PRODUCT.md)

## One-Sentence Positioning

PayDance is a desktop real-time salary dashboard that keeps today's earnings on screen, rising as you work and visible at a glance.

## Who It Is For

- Windows 11 users who want to see today's earnings on their desktop in real time.
- People who need a tray icon, always-on-top mode, or a mini window.
- People who want to try the interface and calculations in Web Preview first.

## Product Boundaries

The following are currently out of scope:

- Keyboard shortcuts / hotkeys
- Reminders / notifications / alerts
- Historical timelines, charts, or trend analysis
- Clock-in, attendance, or timesheet tracking
- Cloud sync, account systems, or online services
- Turning mini floating mode into a complex panel
- Presenting the Web Preview as the full desktop app

New features should directly support viewing today's live earnings.

## Experience Principles

- The main window shows the full dashboard; the mini window shows only the live amount.
- Salary rules stay close to real schedules: monthly, daily, and hourly modes, weekly workdays, lunch-break exclusion, and night shifts crossing midnight.
- Salary and schedule settings stay on the device, with no telemetry and no advertising.
- Salary details and settings remain secondary to the dashboard.
- Error messages stay concise, direct, and actionable.

## Platform Strategy

The official desktop app currently targets Windows 11 and supports a system tray, always-on-top mode, transparent windows, a mini window, and auto-start. Web Preview is deployed on Vercel, with GitHub Pages as a repository mirror.

This does not exclude macOS, Linux, or other platforms. Community contributors can start by submitting porting proposals with build and validation results. Before an official release, the update and maintenance scope must also be settled.

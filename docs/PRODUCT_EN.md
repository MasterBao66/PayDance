# Product Positioning & Boundaries

> [中文版 →](PRODUCT.md)

## Positioning

PayDance is a desktop real-time salary dashboard: today's earnings stay on screen and keep rising as you work, so one glance tells you where you are.

## Who It Is For

- People who want today's earnings on their Windows 11 desktop in real time.
- People who need a tray icon, always-on-top mode, or a mini window.
- People who want to try the interface and calculations in the browser first.

## Product Boundaries

The following are out of scope for now:

- Keyboard shortcuts / hotkeys
- Reminders / notifications / alerts
- Historical timelines, charts, or trend analysis
- Clock-in, attendance, or timesheet tracking
- Cloud sync, accounts, or online services
- Turning mini mode into a complex panel
- Presenting the Web Preview as the full desktop app

New features should directly serve "seeing the money you are earning today".

## Experience Principles

- The main window shows the full dashboard; the mini window shows only the live amount.
- Salary rules stay close to real schedules: monthly, daily, and hourly pay, weekly workdays, lunch-break exclusion, and shifts across midnight.
- Salary and schedule settings stay on the device, with no telemetry and no advertising.
- Salary details and Settings are low-frequency entries that stay out of the dashboard's way.
- Error messages are concise, direct, and actionable.

## Platform Strategy

The official desktop app targets Windows 11 and supports a system tray, always-on-top mode, transparent windows, a mini window, and launch at startup. The Web Preview is deployed on Vercel, with GitHub Pages as a repository mirror.

This does not exclude macOS, Linux, or other platforms. Community contributors can start with a porting proposal plus build and validation results; before an official release, the update and maintenance scope must also be settled.

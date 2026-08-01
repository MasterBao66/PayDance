# Desktop Smoke Checklist

> [中文版 →](desktop-smoke-checklist.md)

Use this checklist before each Windows desktop release. It covers real desktop capabilities only and does not replace automated tests.

## Basic Launch

- [ ] Launch the Windows executable by double-clicking it; the main window appears centered.
- [ ] The three-step onboarding wizard appears on first launch.
- [ ] After onboarding, today's earnings, work progress, worked time, and today's estimate display correctly.
- [ ] After closing and reopening the app, settings and onboarding completion state are preserved.

## Settings Persistence

- [ ] Changing salary mode, amount, workdays, start time, and end time updates the dashboard immediately.
- [ ] Typing a currency symbol, or clearing the field, updates the inline preview, the dashboard, estimated earnings, salary details, and the mini window, and persists after restart.
- [ ] Changing theme, amount animation style, and always-on-top state persists after restart.
- [ ] Temporary invalid salary input shows a clear prompt, while theme and window preferences can still be saved.

## Tray and Single Instance

- [ ] After minimizing or closing the window, the tray icon remains available.
- [ ] Left-clicking the tray icon shows the main window again.
- [ ] The tray menu can open the main window, open settings, toggle mini mode, toggle always-on-top, and quit.
- [ ] After switching the language to English and restarting, the tray menu and tooltip are in English too.
- [ ] Closing the main window with Alt+F4 or the taskbar "Close window" entry removes the tray icon and exits the process, leaving nothing in Task Manager.
- [ ] After switching the language to English and restarting, the tray menu and tooltip are in English too.
- [ ] Closing the main window with Alt+F4 or the taskbar "Close window" entry removes the tray icon and exits the process, leaving nothing in Task Manager.
- [ ] Launching the same executable while the app is already running does not open a second main window; the existing window is raised and focused.

## Mini Floating Window

- [ ] Double-clicking the main amount enters mini floating mode.
- [ ] The mini floating window can be dragged; double-clicking it or pressing Enter / Space restores the main window.
- [ ] The mini floating window has no taskbar button; leaving mini mode restores it.
- [ ] Hiding the mini window to the tray and showing it again still leaves no taskbar button.
- [ ] The mini floating window has no taskbar button; leaving mini mode restores it.
- [ ] Hiding the mini window to the tray and showing it again still leaves no taskbar button.
- [ ] Right-clicking the mini floating window opens the opacity panel.
- [ ] Opacity changes apply immediately and persist after restart.
- [ ] With the UI language set to English, the opacity panel heading and slider label are English too.
- [ ] With the UI language set to English, the opacity panel heading and slider label are English too.

## Desktop Environment

- [ ] After switching light/dark themes, window corners, borders, and main panels show no obvious white flash or residue.
- [ ] After system sleep and resume, today's earnings do not go backward or jump unexpectedly.
- [ ] In a multi-monitor setup, moving the main and mini windows restores to reasonable positions and sizes after restart.
- [ ] Moving the window to a secondary monitor, unplugging that monitor, and relaunching pulls the window back onto a visible area of the primary monitor.
- [ ] At high DPI scaling, text in the main window, settings panel, mini window, and opacity panel does not overlap.

## Web Preview Boundary

- [ ] Web Preview does not show desktop-only capabilities such as tray, always-on-top, or autostart.
- [ ] Web Preview settings only affect browser localStorage and do not affect Windows desktop settings.

## Recording

Release automation generates `paydance-exe-smoke-report.json` with the main window handle, responsiveness, and single-instance result. Before release, still record the tested version, Windows version, monitor count, DPI scaling, and screenshots for any failed item. If a critical item fails, fix it or mark it as a known issue before continuing the release.

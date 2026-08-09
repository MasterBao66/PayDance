# Desktop Smoke Checklist

> [中文版 →](desktop-smoke-checklist.md)

Use this checklist before releasing the Windows portable build. Record the PayDance version, commit, Windows version, monitor configuration, and DPI scaling before testing. Run first-launch checks in a test account or virtual machine that has never opened PayDance.

## Launch and Persistence

- [ ] Double-clicking the EXE opens exactly one main window. With no saved position, the window is centered and fully visible.
- [ ] The three-step onboarding flow appears on first launch and allows preferences, salary, and work time to be completed.
- [ ] After onboarding, today's earnings, current status, worked time, today's estimate, and progress display correctly.
- [ ] After quitting from the tray and relaunching, onboarding does not reappear, and settings and window state are preserved.
- [ ] Starting with settings created by the previous release opens the dashboard normally and preserves valid settings.

## Settings

- [ ] Changing salary mode, amount, workdays, start and end times, or lunch settings updates the dashboard immediately.
- [ ] Changing or clearing the currency symbol updates the settings preview, dashboard, today's estimate, salary details, and mini window; the choice persists after restart.
- [ ] Changing theme, amount display mode, or always-on-top state updates the UI immediately and persists after restart.
- [ ] Invalid salary settings show a clear error and do not overwrite the last valid salary configuration; theme, language, and window preferences can still be saved.
- [ ] Switching languages updates the dashboard, settings, and validation messages; the language persists after restart.
- [ ] Enabling autostart launches PayDance after a Windows reboot. Disabling it removes the autostart registration.

## Tray and Single Instance

- [ ] After minimizing the main window, the tray icon remains. Clicking it restores and focuses the window.
- [ ] The title-bar close button, `Alt+F4`, and the taskbar “Close window” action hide the main window to the tray while the process keeps running.
- [ ] The tray menu can open the main window, open settings, toggle mini mode, toggle always-on-top, and quit.
- [ ] After switching to English, the tray menu and tooltip change immediately and remain in English after restart.
- [ ] Launching the same EXE while PayDance is running does not create a second main window; it restores and focuses the existing window.
- [ ] Choosing “Quit” from the tray removes the tray icon and ends the process with no PayDance process left in Task Manager.

## Mini Floating Window

- [ ] Double-clicking the main amount, or focusing it and pressing `Enter` / `Space`, enters mini mode.
- [ ] The mini window can be dragged and remains always-on-top. Double-clicking it or pressing `Enter` / `Space` restores the main window.
- [ ] Mini mode has no taskbar button; restoring the main window brings the taskbar button back.
- [ ] In mini mode, pressing `Alt+F4` hides the window. Restoring it from the tray does not add a taskbar button.
- [ ] Right-clicking the mini window opens the opacity panel. The panel aligns with the mini window and closes on blur or `Esc`.
- [ ] Opacity changes apply immediately and persist after restart. The panel follows the main window's language and light/dark theme.

## Desktop Environment

- [ ] Switching light and dark themes causes no obvious white flash, color mismatch, or residue at the window corners, borders, or main panel.
- [ ] After sleep and resume, today's earnings do not go backward or jump unexpectedly.
- [ ] After moving the main and mini windows between monitors and restarting, their positions and sizes restore reasonably.
- [ ] After moving a window to a secondary display, disconnecting it, and relaunching, the window returns to a visible area of the primary display.
- [ ] At every tested high-DPI scale, the main window, settings, onboarding, mini window, and opacity panel have no overlapping text or clipped controls.

## Portable Update

Test the published new version from the previous release's EXE. If this is not tested, record the reason.

- [ ] When the previous version detects the update, an update button appears beside the version in the settings footer.
- [ ] Starting the update downloads it, exits the old process, replaces the EXE at the same path, and relaunches automatically.
- [ ] The updated version is correct, and settings, window state, and onboarding completion are preserved.
- [ ] A failed update shows a retryable error and leaves the current EXE usable.

## Test Record

Record each failure, screenshot, reproduction steps, and whether it blocks release. The automated `paydance-exe-smoke-report.json` covers only main-window creation, stable runtime, responsiveness, and single-instance behavior; it does not replace this checklist.

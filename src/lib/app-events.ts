// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

export const trayEventNames = {
  openSettings: "tray-open-settings",
  toggleAlwaysOnTop: "tray-toggle-always-on-top",
  toggleMiniMode: "tray-toggle-mini-mode",
} as const;

// Emitted by the Rust side every time the window is shown from the tray or a second launch.
export const windowShownEventName = "window-shown";

// The tray menu and tooltip are built in Rust and can only be re-localized through this event,
// so the frontend has to announce the language on every change — including the one that
// happens at startup when the saved (or auto-detected) locale is restored.
export const localeChangedEventName = "locale-changed";

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

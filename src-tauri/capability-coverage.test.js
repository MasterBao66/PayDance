// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// A window command the frontend calls without a matching capability entry is rejected by the
// Tauri ACL at runtime, and the JS side only sees a rejected promise. Every such call in this
// app sits behind a `catch` that degrades silently, so the feature just stops working with no
// error anywhere — exactly how `availableMonitors` / `primaryMonitor` went unnoticed and left
// the off-screen window rescue inert. This test fails the build instead.

const tauriDir = resolve(import.meta.dirname);
const srcDir = resolve(tauriDir, "..", "src");
const defaultCapability = JSON.parse(
  readFileSync(resolve(tauriDir, "capabilities", "default.json"), "utf8"),
);

const grantedPermissions = new Set(
  defaultCapability.permissions.filter((permission) => typeof permission === "string"),
);

const collectSourceFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(path);

    return /\.(ts|vue)$/.test(entry.name) && !/\.test\.ts$/.test(entry.name)
      ? [path]
      : [];
  });

const source = collectSourceFiles(srcDir)
  .map((path) => readFileSync(path, "utf8"))
  .join("\n");

// Free functions imported from the window API. These are the ones with no `this`, so a regex
// on the call site is unambiguous.
const windowApiFunctions = {
  availableMonitors: "core:window:allow-available-monitors",
  currentMonitor: "core:window:allow-current-monitor",
  monitorFromPoint: "core:window:allow-monitor-from-point",
  primaryMonitor: "core:window:allow-primary-monitor",
};

// Methods invoked on a window handle. Every one of them is an ACL-gated command.
const windowApiMethods = {
  close: "core:window:allow-close",
  hide: "core:window:allow-hide",
  innerPosition: "core:window:allow-inner-position",
  innerSize: "core:window:allow-inner-size",
  isMinimized: "core:window:allow-is-minimized",
  minimize: "core:window:allow-minimize",
  outerPosition: "core:window:allow-outer-position",
  outerSize: "core:window:allow-outer-size",
  setAlwaysOnTop: "core:window:allow-set-always-on-top",
  setFocus: "core:window:allow-set-focus",
  setMinSize: "core:window:allow-set-min-size",
  setPosition: "core:window:allow-set-position",
  setResizable: "core:window:allow-set-resizable",
  setSize: "core:window:allow-set-size",
  setSkipTaskbar: "core:window:allow-set-skip-taskbar",
  setTheme: "core:window:allow-set-theme",
  show: "core:window:allow-show",
  startDragging: "core:window:allow-start-dragging",
  startResizeDragging: "core:window:allow-start-resize-dragging",
  unminimize: "core:window:allow-unminimize",
};

describe("window capability coverage", () => {
  it("grants a permission for every window API function the frontend imports", () => {
    const missing = Object.entries(windowApiFunctions)
      .filter(
        ([name]) =>
          new RegExp(`\\b${name}\\s*\\(`).test(source) &&
          !grantedPermissions.has(windowApiFunctions[name]),
      )
      .map(([, permission]) => permission);

    expect(missing).toEqual([]);
  });

  it("grants a permission for every window method the frontend calls", () => {
    const missing = Object.entries(windowApiMethods)
      .filter(
        ([name, permission]) =>
          // Matches `appWindow.show(`, `opacityWindow.setSize(` and the optional-call form
          // `appWindow.setSkipTaskbar?.(` that a capability-guarded call often uses.
          new RegExp(
            `(?:Window|window|opacityWindow)\\??\\.${name}\\s*(?:\\?\\.)?\\s*\\(`,
          ).test(source) && !grantedPermissions.has(permission),
      )
      .map(([, permission]) => permission);

    expect(missing).toEqual([]);
  });

  it("keeps the monitor queries the off-screen rescue depends on", () => {
    // Without these the rescue degrades to a silent no-op: readMonitorWorkAreas() catches the
    // ACL rejection and returns [], and isWindowPositionVisible() treats "no monitors" as
    // "cannot prove the window is lost", so a stranded window is never pulled back.
    expect(grantedPermissions.has("core:window:allow-available-monitors")).toBe(true);
    expect(grantedPermissions.has("core:window:allow-primary-monitor")).toBe(true);
  });
});

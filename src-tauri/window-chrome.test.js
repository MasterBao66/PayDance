// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const tauriDir = resolve(import.meta.dirname);
const tauriConfig = JSON.parse(
  readFileSync(resolve(tauriDir, "tauri.conf.json"), "utf8"),
);
const defaultCapability = JSON.parse(
  readFileSync(resolve(tauriDir, "capabilities", "default.json"), "utf8"),
);
const miniOpacityCapability = JSON.parse(
  readFileSync(resolve(tauriDir, "capabilities", "mini-opacity.json"), "utf8"),
);
const desktopCapability = JSON.parse(
  readFileSync(resolve(tauriDir, "capabilities", "desktop.json"), "utf8"),
);
const libRs = readFileSync(resolve(tauriDir, "src", "lib.rs"), "utf8");
const readOptional = (path) => (existsSync(path) ? readFileSync(path, "utf8") : "");
const trayRs = readOptional(resolve(tauriDir, "src", "tray.rs"));
const portableUpdateRs = readOptional(resolve(tauriDir, "src", "portable_update.rs"));

describe("desktop window chrome", () => {
  it("keeps native responsibilities in focused Rust modules", () => {
    expect(libRs).toContain("mod tray;");
    expect(libRs).toContain("mod portable_update;");
    expect(trayRs).toContain("enum TrayAction");
    expect(trayRs).toContain("tray_action_for_menu_id");
    expect(portableUpdateRs).toContain("install_portable_update");
    expect(libRs.split(/\r?\n/).length).toBeLessThanOrEqual(120);
  });

  it("disables the native shadow on the transparent main window", () => {
    const mainWindow = tauriConfig.app.windows.find((window) => window.label === "main");

    expect(mainWindow).toBeDefined();
    expect(mainWindow.transparent).toBe(true);
    expect(mainWindow.shadow).toBe(false);
    expect(mainWindow.windowEffects).toBeUndefined();
  });

  it("uses left tray click to show the main window and right click for the menu", () => {
    expect(trayRs).toContain(".show_menu_on_left_click(false)");
    expect(trayRs).toContain("TrayIconEvent::Click");
    expect(trayRs).toContain("MouseButton::Left");
    expect(trayRs).toContain("MouseButtonState::Up");
    expect(trayRs).toContain("show_window(&window)");
  });

  it("names the first tray action as opening the main window", () => {
    expect(trayRs).toContain("打开主界面");
    expect(trayRs).toContain('.text("show"');
  });

  it("hides immediately and delegates process exit when the tray quit action is selected", () => {
    const quitBranch = trayRs.slice(
      trayRs.indexOf("TrayAction::Quit => {"),
      trayRs.indexOf("\n        }\n    }\n}", trayRs.indexOf("TrayAction::Quit => {")),
    );

    expect(quitBranch).toContain("window.hide()");
    expect(quitBranch).toContain('window.emit("before-app-exit", ())');
    expect(quitBranch).not.toContain("std::thread::sleep");
    expect(quitBranch).not.toContain("Duration::from_secs");
    expect(quitBranch).not.toContain("std::thread::spawn");
    expect(quitBranch).not.toContain("handle.exit(0)");
  });

  it("exits instead of leaving a live process behind an unresponsive tray", () => {
    // Every tray action resolves the "main" window and returns when it is missing, and the
    // hidden mini-opacity window keeps tao's window list non-empty so the runtime never exits
    // on its own. Without this handler a destroyed main window is only killable via Task
    // Manager. The frontend must hide rather than close so a destroy stays exceptional.
    expect(libRs).toContain(".on_window_event(exit_when_main_window_destroyed)");
    expect(trayRs).toContain("fn exit_when_main_window_destroyed");
    expect(trayRs).toContain('window.label() != "main"');
    expect(trayRs).toContain("WindowEvent::Destroyed");
    expect(trayRs).toContain("app_handle().exit(0)");

    const desktopApp = readFileSync(
      resolve(tauriDir, "..", "src", "DesktopApp.vue"),
      "utf8",
    );
    expect(desktopApp).toContain('@close="appWindow.hide()"');
    expect(desktopApp).not.toContain("appWindow.close()");
    expect(defaultCapability.permissions).not.toContain("core:window:allow-close");
  });

  it("resolves the tray language from an exact locale match", () => {
    // A substring test would misfire on the first locale that merely contains "en".
    expect(trayRs).toContain("serde_json::from_str::<String>(event.payload())");
    expect(trayRs).not.toContain('event.payload().contains("en")');
  });

  it("defines a hidden companion window for the mini opacity slider", () => {
    const opacityWindow = tauriConfig.app.windows.find(
      (window) => window.label === "mini-opacity",
    );

    expect(opacityWindow).toBeDefined();
    expect(opacityWindow.visible).toBe(false);
    expect(opacityWindow.decorations).toBe(false);
    expect(opacityWindow.transparent).toBe(true);
    expect(opacityWindow.shadow).toBe(false);
    expect(opacityWindow.skipTaskbar).toBe(true);
  });

  it("lets the main window drop its taskbar button while in mini mode", () => {
    expect(defaultCapability.permissions).toContain("core:window:allow-set-skip-taskbar");
  });

  it("keeps the mini opacity companion window compact", () => {
    const opacityWindow = tauriConfig.app.windows.find(
      (window) => window.label === "mini-opacity",
    );

    expect(opacityWindow.width).toBe(108);
    expect(opacityWindow.height).toBe(52);
  });

  it("keeps native geometry and store permissions on the main window only", () => {
    expect(defaultCapability.windows).toEqual(["main"]);
    expect(defaultCapability.permissions).toContain("core:window:allow-inner-position");
    expect(defaultCapability.permissions).toContain("core:window:allow-inner-size");
    expect(defaultCapability.permissions).toContain("core:window:allow-outer-position");
    expect(defaultCapability.permissions).toContain("core:window:allow-outer-size");
    expect(defaultCapability.permissions).toContain("core:window:allow-current-monitor");
    expect(defaultCapability.permissions).toContain("core:window:allow-set-position");
    expect(defaultCapability.permissions).toContain("store:allow-get");
    expect(JSON.stringify(defaultCapability.permissions)).toContain(
      "opener:allow-open-url",
    );
  });

  it("allows the renamed GitHub repository to open from the desktop app", () => {
    const openUrlPermission = defaultCapability.permissions.find(
      (permission) => permission.identifier === "opener:allow-open-url",
    );

    expect(openUrlPermission.allow).toEqual([
      { url: "https://github.com/MrBaoboer/PayDance" },
    ]);
  });

  it("allows the frontend to exit immediately after flushing tray quit state", () => {
    expect(desktopCapability.windows).toEqual(["main"]);
    expect(desktopCapability.permissions).toContain("process:allow-exit");
    expect(desktopCapability.permissions).toContain("process:allow-restart");
  });

  it("uses a portable updater command for in-place exe replacement", () => {
    expect(libRs).toContain("install_portable_update");
    expect(portableUpdateRs).toContain("tauri_plugin_updater::UpdaterExt");
    expect(portableUpdateRs).toContain(".download(|_, _| {}, || {})");
    expect(portableUpdateRs).toContain("apply-update.ps1");
    expect(portableUpdateRs).toContain(
      "Copy-Item -LiteralPath $Source -Destination $Destination -Force",
    );
    expect(defaultCapability.permissions).toContain("updater:allow-check");
    expect(defaultCapability.permissions).not.toContain(
      "updater:allow-download-and-install",
    );
    expect(portableUpdateRs).not.toContain("ShellExecuteW");
    expect(portableUpdateRs).not.toContain("/UPDATE");
  });

  it("limits the mini opacity companion window to slider-only permissions", () => {
    expect(miniOpacityCapability.windows).toEqual(["mini-opacity"]);
    expect(miniOpacityCapability.permissions).toEqual([
      "core:event:allow-emit-to",
      "core:event:allow-listen",
      "core:event:allow-unlisten",
      "core:window:allow-hide",
    ]);
    expect(miniOpacityCapability.permissions).not.toContain("store:allow-get");
    expect(JSON.stringify(miniOpacityCapability.permissions)).not.toContain(
      "opener:allow-open-url",
    );
    expect(miniOpacityCapability.permissions).not.toContain(
      "core:window:allow-set-position",
    );
  });
});

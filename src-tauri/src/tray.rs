// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

use std::sync::Mutex;
use tauri::{
    App, AppHandle, Emitter, Listener, Manager, WebviewWindow, Window, WindowEvent,
    menu::MenuBuilder,
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
};

const TRAY_OPEN_SETTINGS_EVENT: &str = "tray-open-settings";
const TRAY_TOGGLE_ALWAYS_ON_TOP_EVENT: &str = "tray-toggle-always-on-top";
const TRAY_TOGGLE_MINI_MODE_EVENT: &str = "tray-toggle-mini-mode";
const WINDOW_SHOWN_EVENT: &str = "window-shown";

struct TrayState {
    handle: Mutex<Option<tauri::tray::TrayIcon>>,
}

#[derive(Debug, PartialEq, Eq)]
enum TrayAction {
    Show,
    OpenSettings,
    ToggleMiniMode,
    ToggleAlwaysOnTop,
    Quit,
}

struct TrayMenuLabels {
    show: &'static str,
    settings: &'static str,
    toggle_mini: &'static str,
    toggle_top: &'static str,
    quit: &'static str,
}

fn tray_action_for_menu_id(id: &str) -> Option<TrayAction> {
    match id {
        "show" => Some(TrayAction::Show),
        "settings" => Some(TrayAction::OpenSettings),
        "toggle_mini" => Some(TrayAction::ToggleMiniMode),
        "toggle_top" => Some(TrayAction::ToggleAlwaysOnTop),
        "quit" => Some(TrayAction::Quit),
        _ => None,
    }
}

fn tray_menu_labels(use_en: bool) -> TrayMenuLabels {
    if use_en {
        TrayMenuLabels {
            show: "Open",
            settings: "Settings",
            toggle_mini: "Mini Mode",
            toggle_top: "Always on Top",
            quit: "Quit",
        }
    } else {
        TrayMenuLabels {
            show: "打开主界面",
            settings: "打开设置",
            toggle_mini: "切换迷你模式",
            toggle_top: "切换置顶",
            quit: "退出",
        }
    }
}

fn tray_tooltip(use_en: bool) -> &'static str {
    if use_en {
        "PayDance · Desktop Real-Time Salary Dashboard"
    } else {
        "薪跳 · 桌面实时工资看板"
    }
}

fn build_tray_menu(
    app: &AppHandle,
    use_en: bool,
) -> Result<tauri::menu::Menu<tauri::Wry>, tauri::Error> {
    let labels = tray_menu_labels(use_en);
    MenuBuilder::new(app)
        .text("show", labels.show)
        .text("settings", labels.settings)
        .text("toggle_mini", labels.toggle_mini)
        .separator()
        .text("toggle_top", labels.toggle_top)
        .text("quit", labels.quit)
        .build()
}

// Every tray action, the tray click handler and the single-instance callback resolve the
// "main" window and give up when it is gone. The hidden `mini-opacity` companion window is
// created at startup and never destroyed, so tao never sees an empty window list and never
// exits either: destroying the main window used to leave a live process behind a tray icon
// where all five menu entries silently did nothing, recoverable only via Task Manager.
// The frontend hides instead of closing, so a real destroy only happens when the user asked
// the OS to close the window before the frontend could intercept it — and then quitting is
// exactly what they asked for.
pub(crate) fn exit_when_main_window_destroyed(window: &Window, event: &WindowEvent) {
    if window.label() != "main" {
        return;
    }

    if matches!(event, WindowEvent::Destroyed) {
        window.app_handle().exit(0);
    }
}

pub(crate) fn show_window(window: &WebviewWindow) {
    // Windows parks a minimized window at (-32000, -32000) and `show()` maps to SW_SHOW, which
    // leaves it minimized. Every recovery path (tray menu, tray click, second launch) funnels
    // through here, so unminimize first or none of them can bring the window back.
    let _ = window.unminimize();
    let _ = window.show();
    let _ = window.set_focus();
    // Let the frontend re-check that the window really landed somewhere reachable.
    let _ = window.emit(WINDOW_SHOWN_EVENT, ());
}

fn dispatch_tray_action(window: &WebviewWindow, action: TrayAction) {
    match action {
        TrayAction::Show => show_window(window),
        TrayAction::OpenSettings => {
            show_window(window);
            let _ = window.emit(TRAY_OPEN_SETTINGS_EVENT, ());
        }
        TrayAction::ToggleMiniMode => {
            show_window(window);
            let _ = window.emit(TRAY_TOGGLE_MINI_MODE_EVENT, ());
        }
        TrayAction::ToggleAlwaysOnTop => {
            show_window(window);
            let _ = window.emit(TRAY_TOGGLE_ALWAYS_ON_TOP_EVENT, ());
        }
        TrayAction::Quit => {
            let _ = window.hide();
            let _ = window.emit("before-app-exit", ());
        }
    }
}

pub(crate) fn setup(app: &mut App) -> Result<(), tauri::Error> {
    let menu = build_tray_menu(app.handle(), false)?;
    let icon = app
        .default_window_icon()
        .cloned()
        .expect("window icon should be available");

    let tray = TrayIconBuilder::with_id("pay-dance-tray")
        .icon(icon)
        .tooltip(tray_tooltip(false))
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_tray_icon_event(|tray, event| {
            let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            else {
                return;
            };

            if let Some(window) = tray.app_handle().get_webview_window("main") {
                show_window(&window);
            }
        })
        .on_menu_event(|app, event| {
            let Some(action) = tray_action_for_menu_id(event.id().as_ref()) else {
                return;
            };
            let Some(window) = app.get_webview_window("main") else {
                return;
            };

            dispatch_tray_action(&window, action);
        })
        .build(app)?;

    app.manage(TrayState {
        handle: Mutex::new(Some(tray)),
    });

    let handle = app.handle().clone();
    if let Some(window) = app.get_webview_window("main") {
        let _id = window.listen("locale-changed", move |event| {
            // The payload is a JSON-encoded locale string. A substring match would start
            // misfiring the moment a locale like "en-GB" or "sv" is added.
            let use_en = serde_json::from_str::<String>(event.payload())
                .map(|locale| locale == "en")
                .unwrap_or(false);
            if let Ok(guard) = handle.state::<TrayState>().handle.lock()
                && let Some(tray) = guard.as_ref()
                && let Ok(menu) = build_tray_menu(&handle, use_en)
            {
                let _ = tray.set_menu(Some(menu));
                let _ = tray.set_tooltip(Some(tray_tooltip(use_en)));
            }
        });
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn maps_known_menu_ids_to_domain_actions() {
        assert_eq!(tray_action_for_menu_id("show"), Some(TrayAction::Show));
        assert_eq!(
            tray_action_for_menu_id("settings"),
            Some(TrayAction::OpenSettings)
        );
        assert_eq!(
            tray_action_for_menu_id("toggle_mini"),
            Some(TrayAction::ToggleMiniMode)
        );
        assert_eq!(
            tray_action_for_menu_id("toggle_top"),
            Some(TrayAction::ToggleAlwaysOnTop)
        );
        assert_eq!(tray_action_for_menu_id("quit"), Some(TrayAction::Quit));
        assert_eq!(tray_action_for_menu_id("unknown"), None);
    }

    #[test]
    fn localizes_menu_labels_and_tooltips() {
        assert_eq!(tray_menu_labels(false).show, "打开主界面");
        assert_eq!(tray_menu_labels(true).show, "Open");
        assert_eq!(tray_tooltip(false), "薪跳 · 桌面实时工资看板");
        assert_eq!(
            tray_tooltip(true),
            "PayDance · Desktop Real-Time Salary Dashboard"
        );
    }
}

// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { LogicalSize } from "@tauri-apps/api/dpi";
import type { Ref } from "vue";
import {
  fullWindowMinSize,
  miniMinSize,
  normalizeFullSize,
  normalizeMiniSize,
  type WindowSize,
} from "../lib/window-mode";

type ManagedWindow = {
  setAlwaysOnTop: (alwaysOnTop: boolean) => Promise<void>;
  setMinSize: (size: LogicalSize) => Promise<void>;
  setResizable: (resizable: boolean) => Promise<void>;
  setSize: (size: LogicalSize) => Promise<void>;
  setSkipTaskbar?: (skip: boolean) => Promise<void>;
};

export function useWindowMode(
  appWindow: ManagedWindow,
  isMiniMode: Ref<boolean>,
  miniSize: Ref<WindowSize>,
  fullSize: Ref<WindowSize>,
  alwaysOnTop: Ref<boolean>,
) {
  // Mini mode is meant to be a low-presence corner widget, so it must not keep a taskbar
  // button. The tray icon stays the recovery path either way, so hiding the button can never
  // strand the window. Runs last and swallows its own error: an older build whose capability
  // file lacks `core:window:allow-set-skip-taskbar` would otherwise reject here and skip the
  // geometry calls above, which is a far worse failure than an extra taskbar button.
  const applyTaskbarVisibility = async (skip: boolean) => {
    try {
      await appWindow.setSkipTaskbar?.(skip);
    } catch {
      // Keeping a taskbar button is only cosmetic; never let it break a mode switch.
    }
  };

  const applyWindowMode = async () => {
    await appWindow.setResizable(true);

    if (isMiniMode.value) {
      const size = normalizeMiniSize(miniSize.value);
      miniSize.value = size;
      await appWindow.setMinSize(new LogicalSize(miniMinSize.width, miniMinSize.height));
      await appWindow.setSize(new LogicalSize(size.width, size.height));
      await appWindow.setAlwaysOnTop(true);
      await applyTaskbarVisibility(true);
      return;
    }

    const size = normalizeFullSize(fullSize.value);
    fullSize.value = size;
    await appWindow.setMinSize(
      new LogicalSize(fullWindowMinSize.width, fullWindowMinSize.height),
    );
    await appWindow.setSize(new LogicalSize(size.width, size.height));
    await appWindow.setAlwaysOnTop(alwaysOnTop.value);
    await applyTaskbarVisibility(false);
  };

  const setAlwaysOnTop = async (value: boolean) => {
    alwaysOnTop.value = value;
    await appWindow.setAlwaysOnTop(isMiniMode.value ? true : alwaysOnTop.value);
  };

  // Windows re-creates the taskbar button whenever a window is shown again, so hiding to the
  // tray and coming back from it would restore the button even though nothing left mini mode.
  const reapplyTaskbarVisibility = () => applyTaskbarVisibility(isMiniMode.value);

  return {
    applyWindowMode,
    reapplyTaskbarVisibility,
    setAlwaysOnTop,
  };
}

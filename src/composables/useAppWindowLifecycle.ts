// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import type { Ref } from "vue";
import { windowShownEventName } from "../lib/app-events";
import {
  normalizeFullSize,
  normalizeMiniOpacityPercent,
  normalizeMiniSize,
  type WindowSize,
} from "../lib/window-mode";

type UnlistenFn = () => void;

type LifecycleWindow = {
  hide: () => Promise<void>;
  isMinimized?: () => Promise<boolean>;
  listen: <T>(
    event: string,
    handler: (event: { payload: T }) => void,
  ) => Promise<UnlistenFn>;
  onCloseRequested: (
    handler: (event: { preventDefault: () => void }) => Promise<void> | void,
  ) => Promise<UnlistenFn>;
  onResized: (handler: () => void) => Promise<UnlistenFn>;
};

export function useAppWindowLifecycle(
  appWindow: LifecycleWindow,
  {
    ensureWindowOnScreen = async () => false,
    fullSize,
    isMiniMode,
    isSettingsReady,
    miniSize,
    saveStateNow,
    updateMiniOpacityPercent,
  }: {
    ensureWindowOnScreen?: () => Promise<boolean>;
    fullSize: Ref<WindowSize>;
    isMiniMode: Ref<boolean>;
    isSettingsReady: Ref<boolean>;
    miniSize: Ref<WindowSize>;
    saveStateNow: () => Promise<void>;
    updateMiniOpacityPercent: (value: number, options?: { commit?: boolean }) => void;
  },
) {
  let saveWindowSizeTimer = 0;

  const isWindowMinimized = async () => {
    try {
      return (await appWindow.isMinimized?.()) === true;
    } catch {
      return false;
    }
  };

  // Windows resizes a minimized window's client area to nothing before parking it offscreen.
  // Persisting that would silently shrink the saved window size to its minimum, so skip it.
  const persistWindowSize = async () => {
    if (await isWindowMinimized()) return;

    const size = { width: window.innerWidth, height: window.innerHeight };
    if (size.width <= 0 || size.height <= 0) return;

    if (isMiniMode.value) {
      miniSize.value = normalizeMiniSize(size);
    } else {
      fullSize.value = normalizeFullSize(size);
    }

    await saveStateNow();
  };

  const registerWindowLifecycle = async () => {
    const unlisteners: UnlistenFn[] = [];

    unlisteners.push(
      await appWindow.onCloseRequested(async (event) => {
        event.preventDefault();
        await appWindow.hide();
      }),
    );

    unlisteners.push(
      await appWindow.listen<{ value?: number; commit?: boolean }>(
        "mini-opacity-change",
        (event) => {
          updateMiniOpacityPercent(normalizeMiniOpacityPercent(event.payload.value), {
            commit: event.payload.commit === true,
          });
        },
      ),
    );

    // The Rust side shows the window from the tray, a tray click, or a second launch. Any of
    // those can surface a window that a full-screen app left minimized and parked offscreen,
    // so re-check reachability every time instead of only at startup.
    unlisteners.push(
      await appWindow.listen(windowShownEventName, () => {
        void ensureWindowOnScreen().then((moved) => {
          if (moved) return saveStateNow();
        });
      }),
    );

    unlisteners.push(
      await appWindow.onResized(() => {
        if (!isSettingsReady.value) return;

        window.clearTimeout(saveWindowSizeTimer);
        saveWindowSizeTimer = window.setTimeout(() => {
          void persistWindowSize();
        }, 180);
      }),
    );

    return unlisteners;
  };

  const clearWindowLifecycleTimers = () => {
    window.clearTimeout(saveWindowSizeTimer);
  };

  return {
    clearWindowLifecycleTimers,
    registerWindowLifecycle,
  };
}

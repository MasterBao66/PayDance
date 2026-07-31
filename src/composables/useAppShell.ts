// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { computed, ref, type Ref } from "vue";
import { resolveAppView, type AppViewState } from "../lib/app-view";
import type { ThemeMode, WindowPosition, WindowSize } from "../lib/window-mode";
import { normalizeFullSize } from "../lib/window-mode";

type ShellWindow = {
  setFocus: () => Promise<void>;
  show: () => Promise<void>;
};

export function useAppShell({
  alwaysOnTop,
  appWindow,
  applyThemeMode,
  applyWindowMode,
  captureWindowPosition = async () => undefined,
  fullSize,
  hasCompletedOnboarding,
  isMiniMode,
  isOpacityPanelWindow,
  isSettingsReady,
  readWindowPosition = () => undefined,
  restoreWindowPosition = async () => undefined,
  saveStateNow,
  setAlwaysOnTop,
  themeMode,
}: {
  alwaysOnTop: Ref<boolean>;
  appWindow: ShellWindow;
  applyThemeMode: (mode: ThemeMode, options?: { persist?: boolean }) => Promise<void>;
  applyWindowMode: () => Promise<void>;
  // Resolves false when the position was rejected (for example a minimized window).
  captureWindowPosition?: () => Promise<unknown>;
  fullSize: Ref<WindowSize>;
  hasCompletedOnboarding: Ref<boolean>;
  isMiniMode: Ref<boolean>;
  isOpacityPanelWindow: boolean;
  isSettingsReady: Ref<boolean>;
  readWindowPosition?: (miniMode: boolean) => WindowPosition | undefined;
  restoreWindowPosition?: (position: WindowPosition) => Promise<void>;
  saveStateNow: () => Promise<void>;
  setAlwaysOnTop: (value: boolean) => Promise<void>;
  themeMode: Ref<ThemeMode>;
}) {
  const showSettings = ref(false);
  const showSalaryInfo = ref(false);

  const shouldShowOnboarding = computed(
    () => isSettingsReady.value && !hasCompletedOnboarding.value && !isMiniMode.value,
  );

  const activeView = computed(() =>
    resolveAppView({
      hasCompletedOnboarding: hasCompletedOnboarding.value,
      isMiniMode: isMiniMode.value,
      isOpacityPanelWindow,
      isSettingsReady: isSettingsReady.value,
      showSalaryInfo: showSalaryInfo.value,
      showSettings: showSettings.value,
    } satisfies AppViewState),
  );

  const getCurrentWindowSize = () =>
    normalizeFullSize({
      height: window.innerHeight,
      width: window.innerWidth,
    });

  const applyMiniMode = async (value: boolean) => {
    const isChangingMode = value !== isMiniMode.value;
    let destinationPosition: WindowPosition | undefined;

    if (value && !isMiniMode.value) {
      fullSize.value = getCurrentWindowSize();
    }

    if (isChangingMode) {
      await captureWindowPosition().catch(() => undefined);
      destinationPosition = readWindowPosition(value);
    }

    isMiniMode.value = value;
    if (value) {
      showSettings.value = false;
      showSalaryInfo.value = false;
    }
    await applyWindowMode();
    if (destinationPosition) {
      await restoreWindowPosition(destinationPosition).catch(() => undefined);
    }
  };

  const setMiniMode = async (value: boolean) => {
    await applyMiniMode(value);
    await saveStateNow();
  };

  const toggleMiniMode = () => setMiniMode(!isMiniMode.value);

  const openSettings = async () => {
    showSettings.value = true;
    showSalaryInfo.value = false;
    if (isMiniMode.value) {
      await applyMiniMode(false);
    }
    await appWindow.show();
    await appWindow.setFocus();
    await saveStateNow();
  };

  const completeOnboarding = async () => {
    hasCompletedOnboarding.value = true;
    await applyThemeMode(themeMode.value, { persist: false });
    await setAlwaysOnTop(alwaysOnTop.value);
    await saveStateNow();
  };

  return {
    activeView,
    completeOnboarding,
    openSettings,
    setMiniMode,
    shouldShowOnboarding,
    showSalaryInfo,
    showSettings,
    toggleMiniMode,
  };
}

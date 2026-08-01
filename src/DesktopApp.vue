<script setup lang="ts">
// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  miniDefaultSize,
  fullWindowSize,
  defaultMiniOpacityPercent,
  normalizeMiniOpacityPercent,
  resolveWindowPreferences,
  type WindowPosition,
  type WindowSize,
} from "./lib/window-mode";
import { appName } from "./lib/app-meta";
import { localeChangedEventName } from "./lib/app-events";
import { useAppShell } from "./composables/useAppShell";
import { useAppWindowLifecycle } from "./composables/useAppWindowLifecycle";
import { useAutostart } from "./composables/useAutostart";
import { provideCurrency } from "./composables/useCurrency";
import { useDashboardModel } from "./composables/useDashboardModel";
import { provideI18n } from "./composables/useI18n";
import { useMiniWindowDrag } from "./composables/useMiniWindowDrag";
import { useMiniOpacityPanel } from "./composables/useMiniOpacityPanel";
import { useSalarySettings } from "./composables/useSalarySettings";
import { useSalaryTicker } from "./composables/useSalaryTicker";
import { useThemeSync } from "./composables/useThemeSync";
import { registerTrayActions } from "./composables/useTrayActions";
import { useWindowMode } from "./composables/useWindowMode";
import { useWindowPositionRecovery } from "./composables/useWindowPositionRecovery";
import { useWindowStatePersistence } from "./composables/useWindowStatePersistence";
import { checkForUpdate, type UpdaterStatus } from "#updater";
import AppWindow from "./components/AppWindow.vue";
import MiniWindow from "./components/MiniWindow.vue";
import MiniOpacityPanel from "./components/MiniOpacityPanel.vue";
const appWindow = getCurrentWindow();
const isOpacityPanelWindow = appWindow.label === "mini-opacity";
const updateStatus = ref<UpdaterStatus>({ kind: "upToDate" });
type ResizeDirection =
  | "East"
  | "North"
  | "NorthEast"
  | "NorthWest"
  | "South"
  | "SouthEast"
  | "SouthWest"
  | "West";
const {
  amountMode,
  alwaysOnTop,
  config,
  currencySymbol,
  hasCompletedOnboarding,
  isSettingsReady,
  loadSettings,
  locale,
  saveSettings,
  settingsSaveError,
  themeMode,
} = useSalarySettings(undefined, () => t.value);

const { t } = provideI18n(locale);

// Watch the ref rather than hooking setLocale: restoring the saved language at startup — and
// auto-detecting it from the system on a first run — assigns this ref directly and never goes
// through setLocale, so hooking the setter left the Rust tray stuck on Chinese after every
// relaunch. The companion window stays silent; its locale is pushed to it, not chosen there.
watch(locale, (next) => {
  if (isOpacityPanelWindow) return;
  void appWindow.emit(localeChangedEventName, next);
});

provideCurrency(currencySymbol);

const isMiniMode = ref(false);
const {
  autostartEnabled,
  autostartError,
  isAutostartUpdating,
  refreshAutostart,
  updateAutostartEnabled,
} = useAutostart(() => t.value("autostart.error"));
const fullSize = ref<WindowSize>({ ...fullWindowSize });
const miniSize = ref<WindowSize>({ ...miniDefaultSize });
const miniOpacityPercent = ref(defaultMiniOpacityPercent);
const mainPosition = ref<WindowPosition | undefined>(undefined);
const miniPosition = ref<WindowPosition | undefined>(undefined);
const defaultWindowPreferences = resolveWindowPreferences({});
const { snapshot, startTicker, stopTicker } = useSalaryTicker(config, t.value);
const { applyWindowMode, reapplyTaskbarVisibility, setAlwaysOnTop } = useWindowMode(
  appWindow,
  isMiniMode,
  miniSize,
  fullSize,
  alwaysOnTop,
);
const windowPosition = useWindowPositionRecovery({
  appWindow,
  fullSize,
  isMiniMode,
  mainPosition,
  miniPosition,
  miniSize,
});
const { clearSaveStateTimer, loadWindowPreferences, saveStateNow, scheduleSaveState } =
  useWindowStatePersistence({
    defaultWindowPreferences,
    fullSize,
    isMiniMode,
    isSettingsReady,
    loadSettings,
    mainPosition,
    miniOpacityPercent,
    miniPosition,
    miniSize,
    saveSettings,
  });
const { applyThemeMode, isThemeSwitching, setThemeMode, toggleTheme } = useThemeSync(
  appWindow,
  themeMode,
  saveStateNow,
);
const {
  activeView,
  completeOnboarding,
  openSettings,
  setMiniMode,
  shouldShowOnboarding,
  showSalaryInfo,
  showSettings,
  toggleMiniMode,
} = useAppShell({
  alwaysOnTop,
  appWindow,
  applyThemeMode,
  applyWindowMode,
  captureWindowPosition: windowPosition.captureWindowPosition,
  fullSize,
  hasCompletedOnboarding,
  isMiniMode,
  isOpacityPanelWindow,
  isSettingsReady,
  readWindowPosition: windowPosition.readWindowPosition,
  restoreWindowPosition: windowPosition.restoreWindowPosition,
  saveStateNow,
  setAlwaysOnTop,
  themeMode,
});
const { showMiniOpacityPanel } = useMiniOpacityPanel(
  appWindow,
  miniOpacityPercent,
  themeMode,
  locale,
);
const { clearMiniDrag, startMiniDrag } = useMiniWindowDrag(appWindow);
const {
  dailyEarnText,
  earnedText,
  firstConfigIssue,
  hasConfigIssues,
  hasIssue,
  isWorkingStatus,
  middleStat,
  salaryModeLabel,
  statusText,
  workedTimeText,
} = useDashboardModel(config, snapshot, t.value, locale);

const shellClass = computed(() =>
  themeMode.value === "dark" ? "theme-dark" : "theme-light",
);

const updateMiniOpacityPercent = (value: number, options: { commit?: boolean } = {}) => {
  miniOpacityPercent.value = normalizeMiniOpacityPercent(value);
  if (options.commit) {
    void saveStateNow();
    return;
  }
  scheduleSaveState();
};

const toggleAlwaysOnTop = async () => {
  await setAlwaysOnTop(!alwaysOnTop.value);
  await saveStateNow();
};

const startDrag = async (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (target.closest("button, input, label")) return;

  await appWindow.startDragging();
};

const startResize = async (direction: ResizeDirection) => {
  await appWindow.startResizeDragging(direction);
};

const { clearWindowLifecycleTimers, registerWindowLifecycle } = useAppWindowLifecycle(
  appWindow,
  {
    ensureWindowOnScreen: windowPosition.ensureWindowOnScreen,
    fullSize,
    isMiniMode,
    isSettingsReady,
    miniSize,
    reapplyTaskbarVisibility,
    saveStateNow,
    updateMiniOpacityPercent,
  },
);

watch(config, scheduleSaveState, { deep: true });
// These three live outside the window state the persistence layer watches, and nothing else
// saves after they change: without this, picking a currency symbol, an amount animation or a
// language and then losing the process would silently roll the choice back.
watch([amountMode, currencySymbol, locale], scheduleSaveState);
const unlisteners: Array<() => void> = [];

onMounted(async () => {
  if (isOpacityPanelWindow) return;

  // Registered before any await: until the close interceptor inside exists, a close request
  // (Alt+F4, the taskbar context menu) destroys the window instead of hiding it, and a
  // destroyed main window used to leave a live process behind a tray that no longer responds.
  unlisteners.push(...(await registerWindowLifecycle()));

  const windowPreferences = await loadWindowPreferences();
  isMiniMode.value = windowPreferences.isMiniMode;
  fullSize.value = windowPreferences.fullSize;
  miniSize.value = windowPreferences.miniSize;
  miniOpacityPercent.value = windowPreferences.miniOpacityPercent;
  mainPosition.value = windowPreferences.mainPosition;
  miniPosition.value = windowPreferences.miniPosition;
  await refreshAutostart();
  await applyThemeMode(themeMode.value, { persist: false });
  // Never let a window call abort the rest of startup: the listeners, tray actions and ticker
  // registered below are what keep the app usable and let tray Quit exit the process at all.
  await applyWindowMode().catch(() => undefined);
  await windowPosition.restoreWindowPosition().catch(() => undefined);

  unlisteners.push(
    await appWindow.listen("before-app-exit", async () => {
      try {
        await saveStateNow();
      } finally {
        const { exit } = await import("@tauri-apps/plugin-process");
        await exit(0);
      }
    }),
    await appWindow.onMoved(({ payload: position }) => {
      // A minimize reports the sentinel position; recording it would persist a lost window.
      if (!windowPosition.recordWindowPosition(position)) return;
      scheduleSaveState();
    }),
    ...(await registerTrayActions(appWindow, {
      openSettings,
      toggleAlwaysOnTop,
      toggleMiniMode,
    })),
  );

  startTicker();

  // Silent background update check — never blocks the UI
  checkForUpdate().then((status) => {
    updateStatus.value = status;
  });
});

onBeforeUnmount(() => {
  stopTicker();
  clearSaveStateTimer();
  clearWindowLifecycleTimers();
  clearMiniDrag();
  for (const unlisten of unlisteners) {
    unlisten();
  }
});
</script>

<template>
  <MiniOpacityPanel v-if="activeView === 'mini-opacity'" />

  <main
    v-else
    class="app-shell h-full w-full select-none p-0"
    :class="[
      shellClass,
      activeView === 'mini' ? 'is-mini' : '',
      { 'is-theme-syncing': isThemeSwitching },
    ]"
    @contextmenu.prevent
  >
    <MiniWindow
      v-if="activeView === 'mini'"
      :amount="earnedText"
      :amount-mode="amountMode"
      :opacity-percent="miniOpacityPercent"
      @drag-start="startMiniDrag"
      @opacity-menu="showMiniOpacityPanel"
      @restore="setMiniMode(false)"
    />

    <AppWindow
      v-else
      v-model:always-on-top="alwaysOnTop"
      v-model:amount-mode="amountMode"
      v-model:config="config"
      v-model:currency-symbol="currencySymbol"
      v-model:show-salary-info="showSalaryInfo"
      v-model:show-settings="showSettings"
      :app-name="appName"
      :update-status="updateStatus"
      :autostart-enabled="autostartEnabled"
      :autostart-error="autostartError"
      :daily-earn-text="dailyEarnText"
      :earned-text="earnedText"
      :first-config-issue="firstConfigIssue"
      :has-config-issues="hasConfigIssues"
      :has-issue="hasIssue"
      :is-autostart-updating="isAutostartUpdating"
      :is-theme-switching="isThemeSwitching"
      :is-working-status="isWorkingStatus"
      :middle-stat="middleStat"
      :salary-mode-label="salaryModeLabel"
      :settings-save-error="settingsSaveError"
      :should-show-onboarding="shouldShowOnboarding"
      :show-desktop-features="true"
      :snapshot="snapshot"
      :status-text="statusText"
      :theme-mode="themeMode"
      :worked-time-text="workedTimeText"
      @close="appWindow.hide()"
      @complete-onboarding="completeOnboarding"
      @drag-start="startDrag"
      @minimize="appWindow.minimize()"
      @resize-start="startResize"
      @set-mini-mode="setMiniMode"
      @toggle-always-on-top="toggleAlwaysOnTop"
      @toggle-mini-mode="toggleMiniMode"
      @toggle-settings="showSettings = !showSettings"
      @toggle-theme="toggleTheme"
      @update:autostart-enabled="updateAutostartEnabled"
      @update:theme-mode="setThemeMode"
    />
  </main>
</template>

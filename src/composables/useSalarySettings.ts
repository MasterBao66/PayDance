// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { ref } from "vue";
import {
  resolveWindowPreferences,
  sanitizeWindowPosition,
  type ThemeMode,
  type WindowPosition,
  type WindowSize,
} from "../lib/window-mode";
import {
  defaultSalaryConfig,
  validateSalaryConfig,
  type SalaryConfig,
} from "../lib/salary";
import {
  migrateSalaryConfig,
  recoverVersionedSalaryConfig,
  resolveOnboardingState,
  settingsSchemaVersion,
} from "../lib/settings-migration";
import { settingsStoreFileName, settingsStoreKeys } from "../lib/settings-store";
import { createSettingsStore, type SettingsStoreAdapter } from "#settings-store";
import { detectLocale, type Locale } from "./useI18n";

export type AmountMode = "rolling" | "plain";

export type PersistedWindowState = {
  isMiniMode: boolean;
  fullSize: WindowSize;
  miniSize: WindowSize;
  miniOpacityPercent: number;
  mainPosition?: WindowPosition;
  miniPosition?: WindowPosition;
};

const serializeSalaryConfig = (config: SalaryConfig) =>
  JSON.stringify({ ...config, workdays: [...config.workdays] });

import type { Messages } from "../i18n/types";

type TFunc = (key: keyof Messages, params?: Record<string, string | number>) => string;

const fallbackT: TFunc = (key) => key;

export function useSalarySettings(
  storeLoader = () => createSettingsStore(settingsStoreFileName),
  getT: () => TFunc = () => fallbackT,
) {
  const config = ref<SalaryConfig>({ ...defaultSalaryConfig });
  const alwaysOnTop = ref(true);
  const themeMode = ref<ThemeMode>("light");
  const amountMode = ref<AmountMode>("rolling");
  const locale = ref<Locale>("zh-CN");
  const hasCompletedOnboarding = ref(false);
  const isSettingsReady = ref(false);
  const settingsSaveError = ref("");
  let storePromise: Promise<SettingsStoreAdapter> | null = null;

  const getStore = () => {
    storePromise ??= storeLoader();
    return storePromise;
  };

  const resetToDefaults = () => {
    config.value = {
      ...defaultSalaryConfig,
      workdays: [...defaultSalaryConfig.workdays],
    };
    alwaysOnTop.value = true;
    themeMode.value = "light";
    amountMode.value = "rolling";
    locale.value = "zh-CN";
    hasCompletedOnboarding.value = false;
  };

  const persistWindowPosition = async (
    store: SettingsStoreAdapter,
    key: string,
    position: WindowPosition | undefined,
  ) => {
    const usablePosition = sanitizeWindowPosition(position);
    if (usablePosition) {
      await store.set(key, usablePosition);
      return;
    }

    // Nothing worth keeping: also clears a value an older build poisoned with the
    // minimize sentinel, so the settings file stops advertising a lost window.
    await store.delete?.(key);
  };

  // Clears a stored position an older build poisoned with the Windows minimize sentinel.
  // Doing it at load makes the repair deterministic: waiting for the next save would leave
  // the bad value visible in salary-settings.json until the user happened to move the window.
  const purgeUnusableWindowPosition = async (
    store: SettingsStoreAdapter,
    key: string,
    savedPosition: unknown,
  ) => {
    if (savedPosition === undefined || sanitizeWindowPosition(savedPosition))
      return false;

    await store.delete?.(key);

    return true;
  };

  const persistRecoveredConfig = async (
    store: SettingsStoreAdapter,
    recoveredConfig: SalaryConfig,
  ) => {
    try {
      await store.set(settingsStoreKeys.config, recoveredConfig);
      await store.set(settingsStoreKeys.settingsVersion, settingsSchemaVersion);
      await store.save();
    } catch (error) {
      console.error("Failed to persist repaired settings", error);
      settingsSaveError.value = "settings.saveFailed";
    }
  };

  const persistDefaultSettings = async () => {
    try {
      const store = await getStore();
      const windowPreferences = resolveWindowPreferences({});
      await store.set(settingsStoreKeys.config, config.value);
      await store.set(settingsStoreKeys.alwaysOnTop, alwaysOnTop.value);
      await store.set(settingsStoreKeys.themeMode, themeMode.value);
      await store.set(settingsStoreKeys.amountMode, amountMode.value);
      await store.set(settingsStoreKeys.locale, locale.value);
      await store.set(settingsStoreKeys.isMiniMode, windowPreferences.isMiniMode);
      await store.set(settingsStoreKeys.fullSize, windowPreferences.fullSize);
      await store.set(settingsStoreKeys.miniSize, windowPreferences.miniSize);
      await store.set(
        settingsStoreKeys.miniOpacityPercent,
        windowPreferences.miniOpacityPercent,
      );
      await store.set(
        settingsStoreKeys.hasCompletedOnboarding,
        hasCompletedOnboarding.value,
      );
      await store.set(settingsStoreKeys.settingsVersion, settingsSchemaVersion);
      await store.save();
    } catch (error) {
      console.error("Failed to replace unreadable settings with defaults", error);
      settingsSaveError.value = "settings.saveFailed";
    }
  };

  const loadSettings = async () => {
    try {
      const store = await getStore();
      const savedConfig = await store.get<Partial<SalaryConfig>>(
        settingsStoreKeys.config,
      );
      const savedTop = await store.get<boolean>(settingsStoreKeys.alwaysOnTop);
      const savedTheme = await store.get<ThemeMode>(settingsStoreKeys.themeMode);
      const savedAmountMode = await store.get<AmountMode>(settingsStoreKeys.amountMode);
      const savedIsMiniMode = await store.get<boolean>(settingsStoreKeys.isMiniMode);
      const savedFullSize = await store.get<WindowSize>(settingsStoreKeys.fullSize);
      const savedMiniSize = await store.get<WindowSize>(settingsStoreKeys.miniSize);
      const savedMiniOpacityPercent = await store.get<number>(
        settingsStoreKeys.miniOpacityPercent,
      );
      const savedMainPosition = await store.get<WindowPosition>(
        settingsStoreKeys.mainPosition,
      );
      const savedMiniPosition = await store.get<WindowPosition>(
        settingsStoreKeys.miniPosition,
      );
      const savedSettingsVersion = await store.get<number>(
        settingsStoreKeys.settingsVersion,
      );
      const savedHasCompletedOnboarding = await store.get<boolean>(
        settingsStoreKeys.hasCompletedOnboarding,
      );

      const recoveredConfig = recoverVersionedSalaryConfig({
        config: savedConfig,
        schemaVersion: savedSettingsVersion,
      });
      config.value = recoveredConfig.config;
      hasCompletedOnboarding.value = resolveOnboardingState(
        savedConfig,
        savedHasCompletedOnboarding,
      );
      if (recoveredConfig.recoveryReason) {
        await persistRecoveredConfig(store, recoveredConfig.config);
      }

      if (typeof savedTop === "boolean") {
        alwaysOnTop.value = savedTop;
      }

      if (savedTheme === "dark" || savedTheme === "light") {
        themeMode.value = savedTheme;
      }

      if (savedAmountMode === "plain" || savedAmountMode === "rolling") {
        amountMode.value = savedAmountMode;
      }

      const savedLocale = await store.get<string>(settingsStoreKeys.locale);
      locale.value = detectLocale(savedLocale);

      try {
        const purged = [
          await purgeUnusableWindowPosition(
            store,
            settingsStoreKeys.mainPosition,
            savedMainPosition,
          ),
          await purgeUnusableWindowPosition(
            store,
            settingsStoreKeys.miniPosition,
            savedMiniPosition,
          ),
        ].some(Boolean);

        if (purged) await store.save();
      } catch (error) {
        // A failed cleanup must not cost the user their settings; the value is inert anyway.
        console.error("Failed to clear an unusable stored window position", error);
      }

      return resolveWindowPreferences({
        savedIsMiniMode,
        savedFullSize,
        savedMiniSize,
        savedMiniOpacityPercent,
        savedMainPosition,
        savedMiniPosition,
        savedSettingsVersion,
      });
    } catch (error) {
      console.error("Failed to load settings, falling back to defaults", error);
      resetToDefaults();
      await persistDefaultSettings();
      return resolveWindowPreferences({});
    } finally {
      isSettingsReady.value = true;
    }
  };

  const saveSettings = async ({
    isMiniMode,
    fullSize,
    miniSize,
    miniOpacityPercent,
    mainPosition,
    miniPosition,
  }: PersistedWindowState) => {
    if (!isSettingsReady.value) return;

    try {
      const store = await getStore();
      const configIssues = validateSalaryConfig(config.value, getT());
      const shouldPersistSalaryConfig = configIssues.length <= 0;
      if (shouldPersistSalaryConfig) {
        await store.set(settingsStoreKeys.config, config.value);
      } else {
        console.error("Skipped saving invalid salary settings", configIssues);
      }

      await store.set(settingsStoreKeys.alwaysOnTop, alwaysOnTop.value);
      await store.set(settingsStoreKeys.fullSize, fullSize);
      await store.set(settingsStoreKeys.isMiniMode, isMiniMode);
      await store.set(settingsStoreKeys.themeMode, themeMode.value);
      await store.set(settingsStoreKeys.amountMode, amountMode.value);
      await store.set(settingsStoreKeys.locale, locale.value);
      await store.set(settingsStoreKeys.miniSize, miniSize);
      await store.set(settingsStoreKeys.miniOpacityPercent, miniOpacityPercent);
      // Last gate before disk: never let a minimize sentinel or corrupt coordinate land in the
      // settings file, and clear a value poisoned by an older build so it stops being visible.
      await persistWindowPosition(store, settingsStoreKeys.mainPosition, mainPosition);
      await persistWindowPosition(store, settingsStoreKeys.miniPosition, miniPosition);
      await store.set(
        settingsStoreKeys.hasCompletedOnboarding,
        hasCompletedOnboarding.value,
      );
      await store.set(settingsStoreKeys.settingsVersion, settingsSchemaVersion);
      await store.save();
      settingsSaveError.value = "";

      if (shouldPersistSalaryConfig) {
        const savedConfig = await store.get<Partial<SalaryConfig>>(
          settingsStoreKeys.config,
        );
        const verifiedConfig = migrateSalaryConfig(savedConfig);
        if (
          serializeSalaryConfig(verifiedConfig) !== serializeSalaryConfig(config.value)
        ) {
          console.error("Saved salary settings did not match the in-memory config");
        }
      }
    } catch (error) {
      console.error("Failed to save settings", error);
      settingsSaveError.value = "settings.saveFailed";
    }
  };

  return {
    amountMode,
    alwaysOnTop,
    config,
    hasCompletedOnboarding,
    isSettingsReady,
    loadSettings,
    locale,
    saveSettings,
    settingsSaveError,
    themeMode,
  };
}

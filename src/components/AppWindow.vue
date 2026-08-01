<script setup lang="ts">
// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md
import { X } from "@lucide/vue";
import type { AmountMode } from "../composables/useSalarySettings";
import type { DashboardMiddleStat } from "../composables/useDashboardModel";
import type { SalaryConfig, SalaryConfigIssue, SalarySnapshot } from "../lib/salary";
import type { ThemeMode } from "../lib/window-mode";
import type { UpdaterStatus } from "#updater";
import MainDashboard from "./MainDashboard.vue";
import { useI18n } from "../composables/useI18n";
import OnboardingPanel from "./OnboardingPanel.vue";
import SalaryInfoSheet from "./SalaryInfoSheet.vue";
import SettingsPanel from "./SettingsPanel.vue";
import WindowTitlebar from "./WindowTitlebar.vue";

type ResizeDirection =
  | "East"
  | "North"
  | "NorthEast"
  | "NorthWest"
  | "South"
  | "SouthEast"
  | "SouthWest"
  | "West";

const { t } = useI18n();

withDefaults(
  defineProps<{
    alwaysOnTop: boolean;
    amountMode: AmountMode;
    appName: string;
    autostartEnabled: boolean;
    autostartError: string;
    config: SalaryConfig;
    currencySymbol: string;
    dailyEarnText: string;
    earnedText: string;
    firstConfigIssue: string;
    hasConfigIssues: boolean;
    hasIssue: (field: SalaryConfigIssue["field"]) => boolean;
    isAutostartUpdating: boolean;
    isThemeSwitching: boolean;
    isWorkingStatus?: boolean;
    middleStat: DashboardMiddleStat;
    salaryModeLabel: string;
    settingsSaveError?: string;
    shouldShowOnboarding: boolean;
    showDesktopFeatures?: boolean;
    showOnboardingAction?: boolean;
    showSalaryInfo: boolean;
    showSettings: boolean;
    snapshot: SalarySnapshot;
    statusText: string;
    themeMode: ThemeMode;
    updateStatus: UpdaterStatus;
    workedTimeText: string;
  }>(),
  {
    settingsSaveError: "",
    showDesktopFeatures: true,
    showOnboardingAction: false,
  },
);

const emit = defineEmits<{
  close: [];
  completeOnboarding: [];
  dragStart: [event: MouseEvent];
  minimize: [];
  openOnboarding: [];
  resizeStart: [direction: ResizeDirection];
  setMiniMode: [value: boolean];
  toggleAlwaysOnTop: [];
  toggleMiniMode: [];
  toggleSettings: [];
  toggleTheme: [];
  "update:alwaysOnTop": [value: boolean];
  "update:amountMode": [value: AmountMode];
  "update:autostartEnabled": [value: boolean];
  "update:config": [config: SalaryConfig];
  "update:currencySymbol": [symbol: string];
  "update:showSalaryInfo": [value: boolean];
  "update:showSettings": [value: boolean];
  "update:themeMode": [mode: ThemeMode];
}>();
</script>

<template>
  <!-- eslint-disable vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
  <div class="app-window" :aria-label="appName">
    <WindowTitlebar
      :always-on-top="alwaysOnTop"
      :has-config-issues="hasConfigIssues"
      :is-working-status="isWorkingStatus"
      :show-desktop-actions="showDesktopFeatures"
      :status-text="statusText"
      :theme-mode="themeMode"
      @close="emit('close')"
      @drag-start="emit('dragStart', $event)"
      @minimize="emit('minimize')"
      @toggle-always-on-top="emit('toggleAlwaysOnTop')"
      @toggle-mini-mode="emit('toggleMiniMode')"
      @toggle-settings="emit('toggleSettings')"
      @toggle-theme="emit('toggleTheme')"
    />

    <MainDashboard
      :amount-mode="amountMode"
      :daily-earn-text="dailyEarnText"
      :earned-text="earnedText"
      :middle-stat="middleStat"
      :snapshot="snapshot"
      :suspend-amount-pulse="isThemeSwitching"
      :worked-time-text="workedTimeText"
      @open-salary-info="emit('update:showSalaryInfo', true)"
      @set-mini-mode="emit('setMiniMode', $event)"
    />

    <Transition name="settings-sheet">
      <div
        v-if="showSettings"
        class="settings-overlay settings-overlay--top"
        @click.self="emit('update:showSettings', false)"
        @mousedown.left.self="emit('dragStart', $event)"
      >
        <section
          class="settings-sheet settings-sheet--top"
          :aria-label="t('settings.title')"
        >
          <header
            class="settings-sheet__header"
            @mousedown.left="emit('dragStart', $event)"
          >
            <div>
              <strong>{{ t("settings.title") }}</strong>
            </div>
            <button
              class="sheet-close-button"
              :title="t('settings.close')"
              type="button"
              @click="emit('update:showSettings', false)"
              @mousedown.left.stop
            >
              <X :size="16" />
            </button>
          </header>
          <div class="settings-sheet__body">
            <SettingsPanel
              :amount-mode="amountMode"
              :autostart-enabled="autostartEnabled"
              :autostart-error="autostartError"
              :config="config"
              :currency-symbol="currencySymbol"
              :first-issue="firstConfigIssue"
              :has-issue="hasIssue"
              :is-autostart-updating="isAutostartUpdating"
              :settings-save-error="settingsSaveError"
              :show-desktop-features="showDesktopFeatures"
              :show-onboarding-action="showOnboardingAction"
              :update-status="updateStatus"
              @open-onboarding="emit('openOnboarding')"
              @update:amount-mode="emit('update:amountMode', $event)"
              @update:autostart-enabled="emit('update:autostartEnabled', $event)"
              @update:config="emit('update:config', $event)"
              @update:currency-symbol="emit('update:currencySymbol', $event)"
            />
          </div>
        </section>
      </div>
    </Transition>

    <Transition name="settings-sheet">
      <div
        v-if="showSalaryInfo"
        class="settings-overlay"
        @click.self="emit('update:showSalaryInfo', false)"
        @mousedown.left.self="emit('dragStart', $event)"
      >
        <SalaryInfoSheet
          :mode-label="salaryModeLabel"
          :snapshot="snapshot"
          @close="emit('update:showSalaryInfo', false)"
          @drag-start="emit('dragStart', $event)"
        />
      </div>
    </Transition>

    <OnboardingPanel
      v-if="shouldShowOnboarding"
      :autostart-enabled="autostartEnabled"
      :config="config"
      :show-desktop-features="showDesktopFeatures"
      :theme-mode="themeMode"
      @complete="emit('completeOnboarding')"
      @drag-start="emit('dragStart', $event)"
      @resize-start="emit('resizeStart', $event)"
      @update:autostart-enabled="emit('update:autostartEnabled', $event)"
      @update:config="emit('update:config', $event)"
      @update:theme-mode="emit('update:themeMode', $event)"
    />
  </div>
</template>

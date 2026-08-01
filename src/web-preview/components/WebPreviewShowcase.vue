<script setup lang="ts">
// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md
import { watch } from "vue";
import { appName } from "../../lib/app-meta";
import AppWindow from "../../components/AppWindow.vue";
import WebPreviewMiniLayer from "./WebPreviewMiniLayer.vue";
import { useWebPreviewState } from "../useWebPreviewState";

const {
  activeView,
  alwaysOnTop,
  amountMode,
  autostartEnabled,
  autostartError,
  completeWebOnboarding,
  config,
  currencySymbol,
  dailyEarnText,
  earnedText,
  firstConfigIssue,
  hasConfigIssues,
  hasIssue,
  isAutostartUpdating,
  isSettingsReady,
  isThemeSwitching,
  middleStat,
  miniLayerStyle,
  miniOpacityPercent,
  miniPosition,
  miniSize,
  miniStyle,
  openOnboarding,
  previewFrameClass,
  salaryModeLabel,
  setMiniMode,
  setThemeMode,
  shellClass,
  shouldShowOnboarding,
  showMiniOpacityPanel,
  showSalaryInfo,
  showSettings,
  showWebMiniOpacityPanel,
  snapshot,
  startWebMiniDrag,
  statusText,
  themeMode,
  toggleAlwaysOnTop,
  toggleMiniMode,
  toggleTheme,
  updateMiniOpacityPercent,
  workedTimeText,
} = useWebPreviewState();

const emit = defineEmits<{
  shellClassChange: [value: string];
  themeReady: [];
}>();

watch(
  shellClass,
  (value) => {
    if (isSettingsReady.value) emit("shellClassChange", value);
  },
  { immediate: true },
);
watch(
  isSettingsReady,
  (ready) => {
    if (!ready) return;
    emit("shellClassChange", shellClass.value);
    emit("themeReady");
  },
  { immediate: true },
);
</script>

<template>
  <div
    id="paydance-preview"
    class="web-preview__showcase"
    :class="{ 'is-mini': activeView === 'mini' }"
  >
    <div
      v-if="activeView !== 'mini'"
      class="app-shell web-preview__frame h-full w-full select-none p-0"
      :class="previewFrameClass"
      @contextmenu.prevent
    >
      <AppWindow
        v-model:always-on-top="alwaysOnTop"
        v-model:amount-mode="amountMode"
        v-model:config="config"
        v-model:currency-symbol="currencySymbol"
        v-model:show-salary-info="showSalaryInfo"
        v-model:show-settings="showSettings"
        :app-name="appName"
        :autostart-enabled="autostartEnabled"
        :autostart-error="autostartError"
        :daily-earn-text="dailyEarnText"
        :earned-text="earnedText"
        :first-config-issue="firstConfigIssue"
        :has-config-issues="hasConfigIssues"
        :has-issue="hasIssue"
        :is-autostart-updating="isAutostartUpdating"
        :is-theme-switching="isThemeSwitching"
        :middle-stat="middleStat"
        :salary-mode-label="salaryModeLabel"
        :should-show-onboarding="shouldShowOnboarding"
        :show-desktop-features="false"
        :show-onboarding-action="true"
        :update-status="{ kind: 'unavailable' }"
        :snapshot="snapshot"
        :status-text="statusText"
        :theme-mode="themeMode"
        :worked-time-text="workedTimeText"
        @close="showSettings = false"
        @complete-onboarding="completeWebOnboarding"
        @drag-start="showWebMiniOpacityPanel = false"
        @minimize="showSettings = false"
        @open-onboarding="openOnboarding"
        @set-mini-mode="setMiniMode"
        @toggle-always-on-top="toggleAlwaysOnTop"
        @toggle-mini-mode="toggleMiniMode"
        @toggle-settings="showSettings = !showSettings"
        @toggle-theme="toggleTheme"
        @update:autostart-enabled="autostartEnabled = $event"
        @update:theme-mode="setThemeMode"
      />
    </div>

    <WebPreviewMiniLayer
      v-else
      :amount-mode="amountMode"
      :earned-text="earnedText"
      :mini-layer-style="miniLayerStyle"
      :mini-opacity-percent="miniOpacityPercent"
      :mini-position="miniPosition"
      :mini-size="miniSize"
      :mini-style="miniStyle"
      :shell-class="shellClass"
      :show-web-mini-opacity-panel="showWebMiniOpacityPanel"
      @drag-start="startWebMiniDrag"
      @opacity-menu="showMiniOpacityPanel"
      @restore="setMiniMode(false)"
      @update-opacity="updateMiniOpacityPercent"
    />
  </div>
</template>

<script setup lang="ts">
// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md
import { computed } from "vue";
import type { SalaryConfig, SalaryConfigIssue } from "../lib/salary";
import {
  useI18n,
  type Locale,
  localeLabels,
  supportedLocales,
} from "../composables/useI18n";
import type { UpdaterStatus } from "#updater";
import type { Messages } from "../i18n/types";
import CurrencySymbolField from "./settings/CurrencySymbolField.vue";
import LunchBreakFields from "./settings/LunchBreakFields.vue";
import SalaryAmountFields from "./settings/SalaryAmountFields.vue";
import SalaryModeControl from "./settings/SalaryModeControl.vue";
import SettingsAboutFooter from "./settings/SettingsAboutFooter.vue";
import SettingsOnboardingAction from "./settings/SettingsOnboardingAction.vue";
import WorkdayPicker from "./settings/WorkdayPicker.vue";
import WorkTimeFields from "./settings/WorkTimeFields.vue";
import SegmentedControl from "./ui/SegmentedControl.vue";
import SettingsGroup from "./ui/SettingsGroup.vue";
import SwitchRow from "./ui/SwitchRow.vue";

const { locale, setLocale, t } = useI18n();

const props = withDefaults(
  defineProps<{
    amountMode: "rolling" | "plain";
    autostartEnabled: boolean;
    autostartError: string;
    config: SalaryConfig;
    currencySymbol: string;
    firstIssue: string;
    hasIssue: (field: SalaryConfigIssue["field"]) => boolean;
    isAutostartUpdating: boolean;
    settingsSaveError?: string;
    showDesktopFeatures?: boolean;
    showOnboardingAction?: boolean;
    updateStatus: UpdaterStatus;
  }>(),
  {
    settingsSaveError: "",
    showDesktopFeatures: true,
    showOnboardingAction: false,
  },
);

const emit = defineEmits<{
  openOnboarding: [];
  "update:autostartEnabled": [enabled: boolean];
  "update:amountMode": [mode: "rolling" | "plain"];
  "update:config": [config: SalaryConfig];
  "update:currencySymbol": [symbol: string];
  "update:locale": [locale: Locale];
}>();

const amountModeOptions = computed(
  () =>
    [
      { label: t.value("amountMode.rolling"), value: "rolling" },
      { label: t.value("amountMode.plain"), value: "plain" },
    ] as const,
);

const settingsSaveErrorText = computed(() =>
  props.settingsSaveError ? t.value(props.settingsSaveError as keyof Messages) : "",
);

const langOptions = computed(() =>
  supportedLocales.map((loc) => ({
    label: localeLabels[loc],
    value: loc,
  })),
);

const updateLocale = (val: string) => {
  const next = val as Locale;
  setLocale(next);
  emit("update:locale", next);
};

const updateAmountMode = (mode: string) => {
  emit("update:amountMode", mode as "rolling" | "plain");
};

const updateConfig = <Key extends keyof SalaryConfig>(
  key: Key,
  value: SalaryConfig[Key],
) => {
  emit("update:config", { ...props.config, [key]: value });
};
</script>

<template>
  <section class="settings-panel">
    <div v-if="firstIssue" class="settings-alert">
      {{ firstIssue }}
    </div>

    <div v-if="settingsSaveErrorText" class="settings-save-error" role="status">
      {{ settingsSaveErrorText }}
    </div>

    <SettingsGroup :title="t('settings.salaryMode')">
      <SalaryModeControl
        density="settings"
        :invalid="hasIssue('salaryType')"
        :model-value="config.salaryType"
        @update:model-value="updateConfig('salaryType', $event)"
      />
    </SettingsGroup>

    <SettingsGroup :title="t('settings.salary')">
      <SalaryAmountFields
        density="settings"
        :config="config"
        :has-issue="hasIssue"
        @update:config="emit('update:config', $event)"
      />
    </SettingsGroup>

    <SettingsGroup :title="t('settings.workdays')">
      <WorkdayPicker
        density="settings"
        :invalid="hasIssue('workdays')"
        :workdays="config.workdays"
        @update:workdays="updateConfig('workdays', $event)"
      />
    </SettingsGroup>

    <SettingsGroup :title="t('settings.workTime')">
      <WorkTimeFields
        density="settings"
        :config="config"
        :has-issue="hasIssue"
        @update:config="emit('update:config', $event)"
      />
    </SettingsGroup>

    <SettingsGroup>
      <LunchBreakFields
        density="settings"
        variant="settings"
        :config="config"
        :has-issue="hasIssue"
        @update:config="emit('update:config', $event)"
      />
    </SettingsGroup>

    <SettingsGroup :title="t('settings.currency')">
      <CurrencySymbolField
        :model-value="currencySymbol"
        @update:model-value="emit('update:currencySymbol', $event)"
      />
    </SettingsGroup>

    <SettingsGroup :title="t('settings.amountAnimation')">
      <SegmentedControl
        :columns="2"
        :label="t('settings.amountAnimationDesc')"
        :model-value="amountMode"
        :options="amountModeOptions"
        @update:model-value="updateAmountMode"
      />
    </SettingsGroup>

    <SettingsGroup :title="t('settings.language')">
      <SegmentedControl
        :columns="2"
        :label="t('settings.language')"
        :model-value="locale"
        :options="langOptions"
        @update:model-value="updateLocale"
      />
    </SettingsGroup>

    <SettingsGroup v-if="showDesktopFeatures" :title="t('settings.startup')">
      <template #action>
        <SwitchRow
          :label="t('settings.autostart')"
          title-action
          :disabled="isAutostartUpdating"
          :model-value="autostartEnabled"
          @update:model-value="emit('update:autostartEnabled', $event)"
        />
      </template>
      <p v-if="autostartError" class="settings-inline-error">
        {{ autostartError }}
      </p>
    </SettingsGroup>

    <SettingsGroup v-if="showOnboardingAction" :title="t('settings.onboarding')">
      <template #action>
        <SettingsOnboardingAction @open="emit('openOnboarding')" />
      </template>
    </SettingsGroup>

    <SettingsAboutFooter :update-status="updateStatus" />
  </section>
</template>

<style scoped>
.settings-panel {
  display: grid;
  flex: 0 0 auto;
  gap: clamp(11px, 2.6cqh, 14px);
  border-top: 1px solid var(--line);
  background: var(--panel-soft);
  padding: clamp(15px, 3.6cqw, 19px);
}

.settings-alert {
  border: 1px solid rgb(245 158 11 / 0.26);
  border-radius: var(--ui-radius-sm, 10px);
  background: rgb(245 158 11 / 0.12);
  padding: clamp(8px, 2cqh, 11px) var(--ui-pad-sm, 11px);
  color: var(--text);
  font-size: var(--ui-font-sm, 14px);
  font-weight: 600;
  text-align: left;
}

.settings-inline-error {
  margin: 0;
  color: var(--danger);
  font-size: var(--ui-font-xs, 12px);
  font-weight: 600;
  text-align: left;
}

.settings-save-error {
  border: 1px solid rgb(231 76 60 / 0.28);
  border-radius: var(--ui-radius-sm, 10px);
  background: rgb(231 76 60 / 0.1);
  padding: clamp(8px, 2cqh, 11px) var(--ui-pad-sm, 11px);
  color: var(--danger);
  font-size: var(--ui-font-sm, 14px);
  font-weight: 650;
  text-align: left;
}
</style>

<script setup lang="ts">
// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md
import { computed, useId } from "vue";
import { parseNumberInput } from "../../lib/number-input";
import type { SalaryConfig, SalaryConfigIssue } from "../../lib/salary";
import { createGetSalaryAmountLabel } from "../../lib/settings-form";
import { defaultCurrencySymbol } from "../../lib/currency";
import { useCurrency } from "../../composables/useCurrency";
import { useI18n } from "../../composables/useI18n";

const { t } = useI18n();
const { currencySymbol } = useCurrency();

const props = defineProps<{
  config: SalaryConfig;
  density: "settings" | "onboarding";
  hasIssue: (field: SalaryConfigIssue["field"]) => boolean;
}>();

const emit = defineEmits<{
  "update:config": [config: SalaryConfig];
}>();

const salaryAmountLabel = computed(() =>
  createGetSalaryAmountLabel(t.value)(props.config.salaryType),
);

// "元" / "CNY" is only correct while the user is on the default symbol. Once they pick another
// one, that symbol is the honest unit; when they hide the symbol entirely there is nothing to
// show instead, so the localized word stays.
const amountUnit = computed(() =>
  currencySymbol.value && currencySymbol.value !== defaultCurrencySymbol
    ? currencySymbol.value
    : t.value("salaryAmount.unitYuan"),
);
const idPrefix = useId();

const updateConfig = <Key extends keyof SalaryConfig>(
  key: Key,
  value: SalaryConfig[Key],
) => {
  emit("update:config", { ...props.config, [key]: value });
};

const updateNumberConfig = <Key extends keyof SalaryConfig>(key: Key, event: Event) => {
  const value = parseNumberInput((event.target as HTMLInputElement).value);
  if (value === null) return;
  updateConfig(key, value as SalaryConfig[Key]);
};
</script>

<template>
  <div class="field-grid" :class="`field-grid--${density}`">
    <label
      v-if="config.salaryType === 'monthly'"
      class="field"
      :for="`${idPrefix}-monthly-salary`"
      :class="{ 'is-invalid': hasIssue('monthlySalary') }"
    >
      <span>{{ salaryAmountLabel }}</span>
      <span class="field-input-wrap">
        <input
          :id="`${idPrefix}-monthly-salary`"
          :value="config.monthlySalary"
          min="0"
          step="100"
          type="number"
          @input="updateNumberConfig('monthlySalary', $event)"
        />
        <span class="field-unit">{{ amountUnit }}</span>
      </span>
    </label>
    <label
      v-if="config.salaryType === 'daily'"
      class="field"
      :for="`${idPrefix}-daily-salary`"
      :class="{ 'is-invalid': hasIssue('dailySalary') }"
    >
      <span>{{ salaryAmountLabel }}</span>
      <span class="field-input-wrap">
        <input
          :id="`${idPrefix}-daily-salary`"
          :value="config.dailySalary"
          min="0"
          step="50"
          type="number"
          @input="updateNumberConfig('dailySalary', $event)"
        />
        <span class="field-unit">{{ amountUnit }}</span>
      </span>
    </label>
    <label
      v-if="config.salaryType === 'hourly'"
      class="field"
      :for="`${idPrefix}-hourly-rate`"
      :class="{ 'is-invalid': hasIssue('hourlyRate') }"
    >
      <span>{{ salaryAmountLabel }}</span>
      <span class="field-input-wrap">
        <input
          :id="`${idPrefix}-hourly-rate`"
          :value="config.hourlyRate"
          min="0"
          step="5"
          type="number"
          @input="updateNumberConfig('hourlyRate', $event)"
        />
        <span class="field-unit">{{ amountUnit }}</span>
      </span>
    </label>
    <label
      v-if="config.salaryType === 'monthly'"
      class="field"
      :for="`${idPrefix}-work-days-per-month`"
      :class="{ 'is-invalid': hasIssue('workDaysPerMonth') }"
    >
      <span>{{ t("salaryAmount.workDaysPerMonth") }}</span>
      <span class="field-input-wrap">
        <input
          :id="`${idPrefix}-work-days-per-month`"
          :value="config.workDaysPerMonth"
          min="1"
          step="0.5"
          type="number"
          @input="updateNumberConfig('workDaysPerMonth', $event)"
        />
        <span class="field-unit">{{ t("salaryAmount.unitDays") }}</span>
      </span>
    </label>
  </div>
</template>

<style scoped>
.field-grid {
  display: grid;
  --field-value-weight: 600;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.field-grid--settings {
  gap: var(--ui-gap-sm, 10px);
}

.field-grid--onboarding {
  gap: clamp(12px, 2.7cqh, 15px);
}

.field {
  display: grid;
  gap: var(--ui-gap-xs, 6px);
}

.field-grid--onboarding .field {
  gap: clamp(7px, 1.8cqh, 9px);
}

.field > span {
  color: var(--muted);
  font-size: var(--ui-font-sm, 14px);
  font-weight: 500;
}

.field-grid--onboarding .field > span {
  font-size: var(--ui-font-xs, 13px);
  font-weight: 650;
}

.field-input-wrap {
  display: grid;
  height: clamp(34px, 8.2cqh, 40px);
  min-width: 0;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--ui-radius-sm, 10px);
  background: var(--panel);
  color-scheme: inherit;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease;
}

.field-grid--onboarding .field-input-wrap {
  height: clamp(38px, 9cqh, 44px);
}

.field input {
  width: 100%;
  height: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  color-scheme: inherit;
  color: var(--text);
  font-family: var(--font-dashboard);
  font-size: var(--ui-font-sm, 14px);
  font-weight: var(--field-value-weight);
  font-variant-numeric: tabular-nums;
  caret-color: var(--text);
  outline: none;
  padding: 0 clamp(9px, 2.2cqw, 13px);
}

.field input[type="number"] {
  padding-left: clamp(10px, 2.4cqw, 14px);
  padding-right: clamp(4px, 1cqw, 7px);
}

.field-unit {
  display: inline-flex;
  min-width: clamp(34px, 7.5cqw, 44px);
  height: 100%;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  font-family: var(--font-dashboard);
  font-size: var(--ui-font-xs, 13px);
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  white-space: nowrap;
}

.field-input-wrap:focus-within {
  border-color: var(--field-focus-border);
  box-shadow: 0 0 0 3px var(--field-focus-ring);
}

.field.is-invalid .field-input-wrap {
  border-color: rgb(245 158 11 / 0.68);
  box-shadow: 0 0 0 3px rgb(245 158 11 / 0.12);
}
</style>

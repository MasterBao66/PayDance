<script setup lang="ts">
// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md
import { computed } from "vue";
import {
  maxCurrencySymbolLength,
  sanitizeCurrencySymbol,
  withCurrencySymbol,
} from "../../lib/currency";
import { useI18n } from "../../composables/useI18n";

const { t } = useI18n();

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

// Shows the field exactly as the dashboard will render it, so "hidden" is self-explanatory:
// clearing the input makes the preview collapse to the bare number.
const previewText = computed(() => withCurrencySymbol(props.modelValue, "88.68"));

// The settings group heading is the visible label, so the input carries it as an aria-label
// rather than repeating it on screen.
const fieldLabel = computed(() => t.value("settings.currency"));

const updateSymbol = (value: string) => {
  emit("update:modelValue", sanitizeCurrencySymbol(value));
};
</script>

<template>
  <div class="currency-field">
    <span class="field-input-wrap">
      <input
        :aria-label="fieldLabel"
        autocomplete="off"
        :maxlength="maxCurrencySymbolLength"
        :placeholder="t('currency.placeholder')"
        spellcheck="false"
        type="text"
        :value="modelValue"
        @input="updateSymbol(($event.target as HTMLInputElement).value)"
      />
      <span class="field-unit" aria-hidden="true">{{ previewText }}</span>
    </span>

    <p class="currency-field__hint">{{ t("currency.hint") }}</p>
  </div>
</template>

<style scoped>
.currency-field {
  display: grid;
  gap: var(--ui-gap-xs, 6px);
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
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.field-input-wrap:focus-within {
  border-color: var(--field-focus-border);
  box-shadow: 0 0 0 3px var(--field-focus-ring);
}

.currency-field input {
  width: 100%;
  height: 100%;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--text);
  font-family: var(--font-dashboard);
  font-size: var(--ui-font-sm, 14px);
  font-weight: 600;
  caret-color: var(--text);
  outline: none;
  padding: 0 clamp(9px, 2.2cqw, 13px);
}

.field-unit {
  display: inline-flex;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  padding-right: clamp(9px, 2.2cqw, 13px);
  color: var(--muted);
  font-family: var(--font-dashboard);
  font-size: var(--ui-font-xs, 13px);
  font-weight: 650;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  white-space: nowrap;
}

.currency-field__hint {
  margin: 0;
  color: var(--muted);
  font-size: var(--ui-font-xs, 12px);
  font-weight: 500;
  text-align: left;
}
</style>

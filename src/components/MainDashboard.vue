<script setup lang="ts">
// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md
import type { AmountMode } from "../composables/useSalarySettings";
import type { DashboardMiddleStat } from "../composables/useDashboardModel";
import type { SalarySnapshot } from "../lib/salary";
import { computed } from "vue";
import { useCurrency } from "../composables/useCurrency";
import { useI18n } from "../composables/useI18n";
import { withCurrencySymbol } from "../lib/currency";
import IncomeProgress from "./IncomeProgress.vue";
import RollingAmount from "./RollingAmount.vue";
import StatsPanel from "./StatsPanel.vue";

const { t } = useI18n();
const { currencySymbol } = useCurrency();

const props = defineProps<{
  amountMode: AmountMode;
  dailyEarnText: string;
  earnedText: string;
  middleStat: DashboardMiddleStat;
  snapshot: SalarySnapshot;
  suspendAmountPulse: boolean;
  workedTimeText: string;
}>();

const emit = defineEmits<{
  openSalaryInfo: [];
  setMiniMode: [value: boolean];
}>();

// Every digit inside RollingAmount is aria-hidden, and this button's own label replaces its
// content for assistive tech. Without the amount here, a screen reader user can reach the
// control that shows today's earnings and never be told what those earnings are.
const amountAriaLabel = computed(() =>
  t.value("dashboard.tapToMini", {
    amount: withCurrencySymbol(currencySymbol.value, props.earnedText),
  }),
);
</script>

<template>
  <section class="hero-panel">
    <div class="hero-meta">
      <p>{{ t("dashboard.todayEarnings") }}</p>
    </div>

    <button
      class="amount-display"
      :aria-label="amountAriaLabel"
      :title="t('dashboard.doubleClickMini')"
      type="button"
      @dblclick="emit('setMiniMode', true)"
      @keydown.enter.prevent="emit('setMiniMode', true)"
      @keydown.space.prevent="emit('setMiniMode', true)"
    >
      <RollingAmount
        :mode="amountMode"
        :suspend-pulse="suspendAmountPulse"
        :value="earnedText"
      />
    </button>

    <div class="hero-controls">
      <section class="hero-dashboard" :aria-label="t('dashboard.statsLabel')">
        <StatsPanel
          :expected-earn="dailyEarnText"
          :middle-label="middleStat.label"
          :middle-value="middleStat.value"
          :worked-time="workedTimeText"
        />

        <IncomeProgress :is-working="snapshot.isWorking" :progress="snapshot.progress" />
      </section>

      <button
        class="salary-info-button salary-info-button--quiet"
        type="button"
        @click="emit('openSalaryInfo')"
      >
        {{ t("dashboard.salaryInfo") }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.hero-panel {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--hero-top-pad) var(--hero-side-pad) var(--hero-bottom-pad);
  text-align: center;
}

.hero-meta {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  color: var(--muted);
  text-align: center;
}

.hero-meta p {
  width: 100%;
  margin: 0;
  font-size: var(--ui-font-lg);
  font-weight: 700;
}

.amount-display {
  display: grid;
  width: min(100% - clamp(24px, 7cqw, 64px), 390px);
  place-items: center;
  margin-top: var(--hero-amount-gap);
  color: var(--text);
}

.hero-controls {
  display: grid;
  width: min(100%, 424px);
  gap: var(--ui-gap-sm);
  justify-items: stretch;
  margin-top: var(--hero-dashboard-gap);
}

.hero-dashboard {
  display: grid;
  width: 100%;
  gap: clamp(10px, 2.6cqh, 14px);
  border: 1px solid var(--dashboard-border);
  border-radius: clamp(14px, 3.6cqw, 18px);
  background: var(--dashboard-panel);
  box-shadow: var(--dashboard-shadow);
  padding: clamp(12px, 3.2cqh, 16px);
}

:global(.theme-dark) .hero-dashboard {
  background:
    linear-gradient(180deg, rgb(18 18 22 / 0.96), rgb(12 12 15 / 0.94)),
    var(--dashboard-panel);
}

.salary-info-button {
  height: clamp(26px, 6.3cqh, 32px);
  justify-self: center;
  margin-top: var(--salary-info-offset);
  border: 1px solid transparent;
  border-radius: 999px;
  background: transparent;
  box-shadow: none;
  padding: 0 clamp(12px, 3cqw, 16px);
  color: var(--muted);
  font-size: var(--ui-font-xs);
  font-weight: 620;
  transition:
    border-color 160ms ease,
    background-color 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.salary-info-button:hover {
  border-color: rgb(217 119 6 / 0.2);
  background: rgb(245 158 11 / 0.08);
  color: var(--income-accent);
}

:global(.theme-light) .salary-info-button:hover {
  color: var(--income-accent);
}

:global(.theme-dark) .salary-info-button:hover {
  border-color: rgb(245 158 11 / 0.22);
  background: rgb(245 158 11 / 0.08);
  color: var(--income-accent-bright);
}

.salary-info-button:active {
  transform: scale(0.98);
}
</style>

<script setup lang="ts">
// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { useCurrency } from "../composables/useCurrency";
import { withCurrencySymbol } from "../lib/currency";

const { currencySymbol } = useCurrency();

const props = withDefaults(
  defineProps<{
    value: string;
    mode?: "rolling" | "plain";
    suspendPulse?: boolean;
    variant?: "hero" | "mini";
  }>(),
  {
    mode: "rolling",
    suspendPulse: false,
    variant: "hero",
  },
);

const digitRows = Array.from({ length: 10 }, (_, digit) => String(digit));
const isTicking = ref(false);
let pulseTimer = 0;

const chars = computed(() =>
  [...props.value].map((char, index) => ({
    id: index,
    char,
    digit: /^\d$/.test(char) ? Number(char) : null,
  })),
);

const valueParts = computed(() => {
  const [integerPart = "0", fractionPart = "00"] = props.value.split(".");

  return {
    fraction: fractionPart,
    hasFraction: props.value.includes("."),
    integer: integerPart,
  };
});

const createChars = (value: string, offset = 0) =>
  [...value].map((char, index) => ({
    id: offset + index,
    char,
    digit: /^\d$/.test(char) ? Number(char) : null,
  }));

const integerChars = computed(() => createChars(valueParts.value.integer));
const fractionChars = computed(() =>
  createChars(valueParts.value.fraction, valueParts.value.integer.length + 1),
);

watch(
  () => props.value,
  (value, previousValue) => {
    if (!previousValue || value === previousValue) return;
    if (props.suspendPulse) return;

    window.clearTimeout(pulseTimer);
    isTicking.value = false;

    requestAnimationFrame(() => {
      isTicking.value = true;
      pulseTimer = window.setTimeout(() => {
        isTicking.value = false;
      }, 220);
    });
  },
);

watch(
  () => props.suspendPulse,
  (suspendPulse) => {
    if (!suspendPulse) return;

    window.clearTimeout(pulseTimer);
    isTicking.value = false;
  },
);

onBeforeUnmount(() => {
  window.clearTimeout(pulseTimer);
});
</script>

<template>
  <span
    class="rolling-amount"
    :class="[`rolling-amount--${variant}`, { 'is-ticking': isTicking }]"
    :aria-label="withCurrencySymbol(currencySymbol, value)"
  >
    <span
      v-if="currencySymbol"
      class="rolling-amount__currency"
      aria-hidden="true"
      v-text="currencySymbol"
    />
    <span v-if="variant === 'hero'" class="rolling-amount__value" aria-hidden="true">
      <span class="rolling-amount__integer">
        <span
          v-for="item in integerChars"
          :key="item.id"
          class="rolling-amount__char"
          :class="{ 'is-digit': item.digit !== null, 'is-plain': mode === 'plain' }"
        >
          <span
            v-if="item.digit !== null && mode === 'rolling'"
            class="rolling-amount__digit-strip"
            :style="{ transform: `translate3d(0, -${item.digit}em, 0)` }"
          >
            <span v-for="digit in digitRows" :key="digit">{{ digit }}</span>
          </span>
          <span v-else>{{ item.char }}</span>
        </span>
      </span>
      <span v-if="valueParts.hasFraction" class="rolling-amount__fraction">
        <span class="rolling-amount__separator">.</span>
        <span
          v-for="item in fractionChars"
          :key="item.id"
          class="rolling-amount__char"
          :class="{ 'is-digit': item.digit !== null, 'is-plain': mode === 'plain' }"
        >
          <span
            v-if="item.digit !== null && mode === 'rolling'"
            class="rolling-amount__digit-strip"
            :style="{ transform: `translate3d(0, -${item.digit}em, 0)` }"
          >
            <span v-for="digit in digitRows" :key="digit">{{ digit }}</span>
          </span>
          <span v-else>{{ item.char }}</span>
        </span>
      </span>
    </span>
    <span v-else class="rolling-amount__value" aria-hidden="true">
      <span
        v-for="item in chars"
        :key="item.id"
        class="rolling-amount__char"
        :class="{ 'is-digit': item.digit !== null, 'is-plain': mode === 'plain' }"
      >
        <span
          v-if="item.digit !== null && mode === 'rolling'"
          class="rolling-amount__digit-strip"
          :style="{ transform: `translate3d(0, -${item.digit}em, 0)` }"
        >
          <span v-for="digit in digitRows" :key="digit">{{ digit }}</span>
        </span>
        <span v-else>{{ item.char }}</span>
      </span>
    </span>
  </span>
</template>

<style scoped>
.rolling-amount {
  display: inline-flex;
  max-width: 100%;
  align-items: baseline;
  justify-content: center;
  gap: 0.18em;
  color: var(--text);
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0;
  transform-origin: center bottom;
  transition:
    filter 220ms ease,
    transform 220ms ease;
}

.rolling-amount__currency {
  flex: 0 0 auto;
  color: var(--text);
  font-size: 1em;
  font-weight: inherit;
  line-height: 1;
  transition: color 220ms ease;
}

.rolling-amount__value {
  display: inline-flex;
  max-width: 100%;
  overflow: hidden;
  align-items: baseline;
  line-height: 1;
  white-space: nowrap;
}

.rolling-amount__integer,
.rolling-amount__fraction {
  display: inline-flex;
  align-items: baseline;
}

.rolling-amount__char {
  display: inline-grid;
  height: 1em;
  min-width: 0.48em;
  place-items: center;
  overflow: hidden;
  line-height: 1;
}

.rolling-amount__char.is-digit {
  width: 0.62em;
}

.rolling-amount__char.is-plain {
  width: auto;
}

.rolling-amount__digit-strip {
  display: grid;
  will-change: transform;
  transition: transform 260ms cubic-bezier(0.16, 0.84, 0.28, 1);
}

.rolling-amount__digit-strip span {
  height: 1em;
  line-height: 1;
}

.rolling-amount--hero {
  font-size: clamp(52px, min(15.4cqw, 18.8cqh), 84px);
  font-weight: 760;
}

.rolling-amount--hero .rolling-amount__currency {
  color: var(--muted);
  font-size: 0.74em;
  transform: translateY(-0.08em);
}

.rolling-amount--hero .rolling-amount__fraction {
  color: var(--text);
  font-size: 0.72em;
  font-weight: 720;
  opacity: 0.88;
}

.rolling-amount--hero .rolling-amount__separator {
  display: inline-grid;
  height: 1em;
  place-items: center;
  color: var(--text);
  opacity: 0.78;
}

.rolling-amount--mini {
  font-size: clamp(19px, min(15vw, 60vh), 30px);
  font-weight: 750;
}

.rolling-amount--mini .rolling-amount__currency {
  color: var(--text);
}

.rolling-amount--hero.is-ticking {
  filter: drop-shadow(0 14px 30px var(--income-accent-glow));
}

.rolling-amount--hero.is-ticking .rolling-amount__currency {
  color: var(--income-accent);
}

@media (prefers-reduced-motion: reduce) {
  .rolling-amount,
  .rolling-amount__currency,
  .rolling-amount__digit-strip {
    transition: none;
  }

  .rolling-amount--hero.is-ticking {
    filter: none;
  }
}
</style>

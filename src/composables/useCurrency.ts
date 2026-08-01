// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { computed, inject, provide, ref, type InjectionKey, type Ref } from "vue";
import { defaultCurrencySymbol, normalizeCurrencySymbol } from "../lib/currency";

// The symbol is needed by the hero amount, the mini window, the stats strip, the salary sheet
// and the settings unit label — five components at four different depths. Mirroring the i18n
// provide/inject already used by those same components keeps this out of every intermediate
// component's prop list.

const CURRENCY_KEY: InjectionKey<{ currencySymbol: Ref<string> }> = Symbol("currency");

export function provideCurrency(currencySymbol: Ref<string>) {
  const normalized = computed(() => normalizeCurrencySymbol(currencySymbol.value));
  const ctx = { currencySymbol: normalized };
  provide(CURRENCY_KEY, ctx);

  return ctx;
}

export function useCurrency() {
  // Falling back to the historical symbol keeps every component renderable in isolation,
  // which is how the component tests mount them.
  return inject(CURRENCY_KEY, { currencySymbol: ref(defaultCurrencySymbol) });
}

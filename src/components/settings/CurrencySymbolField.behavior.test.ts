// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { defineComponent, h, ref } from "vue";
import { provideCurrency } from "../../composables/useCurrency";
import { defaultCurrencySymbol } from "../../lib/currency";
import CurrencySymbolField from "./CurrencySymbolField.vue";
import RollingAmount from "../RollingAmount.vue";

const lastEmitted = (events: unknown[][] | undefined) => events?.[events.length - 1];

const mountWithProvidedSymbol = (symbol: string) =>
  mount(
    defineComponent({
      setup() {
        provideCurrency(ref(symbol));
        return () => h(RollingAmount, { value: "128.48", variant: "hero" });
      },
    }),
  );

describe("CurrencySymbolField behavior", () => {
  it("emits what the user typed", async () => {
    const wrapper = mount(CurrencySymbolField, { props: { modelValue: "¥" } });

    await wrapper.get('input[type="text"]').setValue("€");

    expect(lastEmitted(wrapper.emitted("update:modelValue"))).toEqual(["€"]);
  });

  it("treats an emptied field as the hidden choice", async () => {
    // Clearing the input is the only way to hide the symbol now, which is what the hint says.
    const wrapper = mount(CurrencySymbolField, { props: { modelValue: "¥" } });

    await wrapper.get('input[type="text"]').setValue("");

    expect(lastEmitted(wrapper.emitted("update:modelValue"))).toEqual([""]);
  });

  it("sanitizes a pasted symbol before emitting it", async () => {
    const wrapper = mount(CurrencySymbolField, { props: { modelValue: "" } });

    const input = wrapper.get('input[type="text"]');
    await input.setValue("  US$\n");

    expect(lastEmitted(wrapper.emitted("update:modelValue"))).toEqual(["US$"]);
  });

  it("previews the amount exactly as the dashboard will render it", async () => {
    const wrapper = mount(CurrencySymbolField, { props: { modelValue: "€" } });
    expect(wrapper.text()).toContain("€88.68");

    await wrapper.setProps({ modelValue: "" });
    expect(wrapper.text()).toContain("88.68");
    expect(wrapper.text()).not.toContain("€88.68");
  });

  it("keeps an accessible name once the visible label is gone", () => {
    const wrapper = mount(CurrencySymbolField, { props: { modelValue: "¥" } });

    expect(wrapper.get('input[type="text"]').attributes("aria-label")).toBe("货币符号");
  });
});

describe("currency symbol propagation", () => {
  it("renders the provided symbol in the hero amount and its aria label", () => {
    const wrapper = mountWithProvidedSymbol("$");

    expect(wrapper.get(".rolling-amount__currency").text()).toBe("$");
    expect(wrapper.get(".rolling-amount").attributes("aria-label")).toBe("$128.48");
  });

  it("drops the glyph and the aria prefix when the symbol is hidden", () => {
    const wrapper = mountWithProvidedSymbol("");

    expect(wrapper.find(".rolling-amount__currency").exists()).toBe(false);
    expect(wrapper.get(".rolling-amount").attributes("aria-label")).toBe("128.48");
  });

  it("falls back to the historical symbol without a provider", () => {
    const wrapper = mount(RollingAmount, { props: { value: "1.00", variant: "hero" } });

    expect(wrapper.get(".rolling-amount__currency").text()).toBe(defaultCurrencySymbol);
  });
});

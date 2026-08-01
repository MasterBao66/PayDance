// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { describe, expect, it } from "vitest";
import {
  defaultCurrencySymbol,
  maxCurrencySymbolLength,
  normalizeCurrencySymbol,
  sanitizeCurrencySymbol,
  withCurrencySymbol,
} from "./currency";

describe("currency symbol", () => {
  it("falls back to the historical symbol for anything that is not a string", () => {
    // Upgrading from a build without the setting must not silently strip the symbol.
    expect(normalizeCurrencySymbol(undefined)).toBe(defaultCurrencySymbol);
    expect(normalizeCurrencySymbol(null)).toBe(defaultCurrencySymbol);
    expect(normalizeCurrencySymbol(42)).toBe(defaultCurrencySymbol);
    expect(normalizeCurrencySymbol({ symbol: "$" })).toBe(defaultCurrencySymbol);
  });

  it("treats an empty string as the deliberate hidden choice", () => {
    expect(normalizeCurrencySymbol("")).toBe("");
    expect(normalizeCurrencySymbol("   ")).toBe("");
  });

  it("keeps ordinary currency symbols intact", () => {
    for (const symbol of ["¥", "$", "€", "£", "₩", "HK$", "CHF", "R$"]) {
      expect(sanitizeCurrencySymbol(symbol)).toBe(symbol);
    }
  });

  it("strips characters that would corrupt the layout or the settings file", () => {
    expect(sanitizeCurrencySymbol("$\n")).toBe("$");
    expect(sanitizeCurrencySymbol("\u0000$\u001F")).toBe("$");
    expect(sanitizeCurrencySymbol("\u200B\uFEFF€")).toBe("€");
    expect(sanitizeCurrencySymbol("  £  ")).toBe("£");
  });

  it("caps the length by code point so a surrogate pair is never cut in half", () => {
    expect(sanitizeCurrencySymbol("ABCDEFG")).toHaveLength(maxCurrencySymbolLength);
    // Four astral-plane code points are eight UTF-16 units; a naive slice would halve the last.
    expect([...sanitizeCurrencySymbol("𝄞𝄞𝄞𝄞𝄞")]).toHaveLength(maxCurrencySymbolLength);
    expect(sanitizeCurrencySymbol("𝄞𝄞𝄞𝄞𝄞")).not.toContain("\uFFFD");
  });

  it("drops the prefix entirely when the symbol is hidden", () => {
    expect(withCurrencySymbol("$", "12.34")).toBe("$12.34");
    expect(withCurrencySymbol("", "12.34")).toBe("12.34");
  });
});

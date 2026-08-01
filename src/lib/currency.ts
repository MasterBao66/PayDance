// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

// PayDance never converts money, so a currency is only ever a prefix glyph here. Storing the
// symbol itself instead of an ISO code keeps the door open for symbols we never enumerated
// (₺, ₫, R$, CHF…) and lets "no symbol at all" be an ordinary value rather than a special case.

export const defaultCurrencySymbol = "¥";

// Wide enough for "HK$" and "CHF", short enough that the mini window (148px minimum width)
// still has room for the digits that are the entire point of the product.
export const maxCurrencySymbolLength = 4;

// Control characters would corrupt the settings file and the aria-label; newlines would break
// the single-line layout; zero-width and bidi marks would produce an "empty-looking" symbol
// that still eats the length budget. Strip them rather than rejecting, so a paste from a
// spreadsheet still yields something usable instead of silently doing nothing.
const forbiddenCharacters = new RegExp(
  // eslint-disable-next-line no-control-regex
  "[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u2028\u2029\uFEFF]",
  "g",
);

/**
 * Trims a user-supplied symbol down to something safe to render and persist.
 * An empty result is a legitimate value: it means "show the amount with no symbol".
 */
export function sanitizeCurrencySymbol(value: string): string {
  const cleaned = value.replace(forbiddenCharacters, "").trim();

  // Slice by code point: a UTF-16 slice could cut a surrogate pair in half and leave a
  // replacement glyph on screen.
  return [...cleaned].slice(0, maxCurrencySymbolLength).join("");
}

/**
 * Resolves a persisted value. Anything that is not a string predates the setting (or is
 * corrupt), so it falls back to the historical hardcoded symbol rather than to "hidden" —
 * an upgrade must never silently strip the currency from an existing user's dashboard.
 */
export function normalizeCurrencySymbol(value: unknown): string {
  if (typeof value !== "string") return defaultCurrencySymbol;

  return sanitizeCurrencySymbol(value);
}

/** Prefixes an already-formatted amount, collapsing to the bare number when hidden. */
export function withCurrencySymbol(symbol: string, amount: string): string {
  return symbol ? `${symbol}${amount}` : amount;
}

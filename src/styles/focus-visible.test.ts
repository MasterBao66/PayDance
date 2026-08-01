// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const styleSource = readFileSync(new URL("../style.css", import.meta.url), "utf8");

describe("global focus styles", () => {
  it("provides a visible keyboard focus ring for interactive controls", () => {
    expect(styleSource).toContain(":focus-visible");
    expect(styleSource).toContain("outline:");
    expect(styleSource).toContain("--focus-ring");
    expect(styleSource).toContain(':where(button, [role="button"]):focus-visible');
    expect(styleSource).not.toContain('button, input, [role="button"]');
  });

  it("never strips the focus ring from controls that have no replacement ring", () => {
    // Text fields opt out because their wrapper draws `.field-input-wrap:focus-within`.
    // Checkboxes, radios, ranges and selects have no wrapper, so the blanket
    // `input:not([type="range"])` reset used to leave keyboard users with no indicator at all.
    expect(styleSource).not.toContain(':where(input:not([type="range"])');
    expect(styleSource).toContain(
      ':where(input:is([type="checkbox"], [type="radio"])):focus-visible',
    );
  });

  it("degrades the always-on-top window's endless animations under reduced motion", () => {
    expect(styleSource).toContain("@media (prefers-reduced-motion: reduce)");
    expect(styleSource).toContain("animation-iteration-count: 1 !important");
  });
});

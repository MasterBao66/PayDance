// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { describe, expect, it } from "vitest";
import { settingsSchemaVersion } from "./settings-migration";
import {
  currentSettingsSchemaVersion,
  defaultMiniOpacityPercent,
  fullWindowMinSize,
  maxMiniOpacityPercent,
  miniDefaultSize,
  miniMinSize,
  minMiniOpacityPercent,
  fullWindowSize,
  isUsableWindowPosition,
  isWindowPositionVisible,
  maxWindowDimension,
  minimizedWindowCoordinate,
  type WindowSize,
  normalizeFullSize,
  normalizeMiniOpacityPercent,
  normalizeMiniSize,
  resolveVisibleWindowPosition,
  resolveWindowPreferences,
  sanitizeWindowPosition,
  windowSettingsSchemaVersion,
} from "./window-mode";

describe("window mode preferences", () => {
  it("uses a compact mini window default for v0.4", () => {
    expect(miniDefaultSize).toEqual({ width: 176, height: 54 });
    expect(miniMinSize).toEqual({ width: 148, height: 44 });
  });

  it("clamps mini window size to the supported minimum", () => {
    expect(normalizeMiniSize({ width: 80, height: 20 })).toEqual({
      width: 148,
      height: 44,
    });
  });

  it("clamps full window size to the supported minimum", () => {
    expect(normalizeFullSize({ width: 80, height: 20 })).toEqual(fullWindowMinSize);
  });

  it("uses a calm translucent mini opacity by default", () => {
    expect(minMiniOpacityPercent).toBe(10);
    expect(maxMiniOpacityPercent).toBe(100);
    expect(defaultMiniOpacityPercent).toBe(85);
  });

  it("clamps mini window opacity to the supported range", () => {
    expect(normalizeMiniOpacityPercent(undefined)).toBe(defaultMiniOpacityPercent);
    expect(normalizeMiniOpacityPercent(4)).toBe(10);
    expect(normalizeMiniOpacityPercent(108)).toBe(100);
    expect(normalizeMiniOpacityPercent(73.4)).toBe(73);
  });

  it("migrates old saved mini sizes to the new compact default", () => {
    expect(
      resolveWindowPreferences({
        savedIsMiniMode: true,
        savedMiniSize: { width: 256, height: 84 },
        savedSettingsVersion: currentSettingsSchemaVersion - 1,
      }),
    ).toEqual({
      isMiniMode: true,
      miniSize: miniDefaultSize,
      fullSize: { width: 480, height: 460 },
      miniOpacityPercent: defaultMiniOpacityPercent,
    });
  });

  it("preserves saved mini sizes from the current schema", () => {
    expect(
      resolveWindowPreferences({
        savedIsMiniMode: true,
        savedMiniSize: { width: 220, height: 64 },
        savedMiniOpacityPercent: 64,
        savedSettingsVersion: currentSettingsSchemaVersion,
      }),
    ).toEqual({
      isMiniMode: true,
      miniSize: { width: 220, height: 64 },
      fullSize: { width: 480, height: 460 },
      miniOpacityPercent: 64,
    });
  });

  it("preserves saved mini sizes from newer app settings schema versions", () => {
    expect(
      resolveWindowPreferences({
        savedIsMiniMode: true,
        savedMiniSize: { width: 210, height: 58 },
        savedMiniOpacityPercent: 7,
        savedSettingsVersion: currentSettingsSchemaVersion + 1,
      }),
    ).toEqual({
      isMiniMode: true,
      miniSize: { width: 210, height: 58 },
      fullSize: { width: 480, height: 460 },
      miniOpacityPercent: 10,
    });
  });

  it("preserves saved full window size from the current schema", () => {
    expect(
      resolveWindowPreferences({
        savedIsMiniMode: false,
        savedMiniSize: { width: 210, height: 58 },
        savedFullSize: { width: 720, height: 540 },
        savedSettingsVersion: currentSettingsSchemaVersion,
      }),
    ).toEqual({
      isMiniMode: false,
      miniSize: { width: 210, height: 58 },
      fullSize: { width: 720, height: 540 },
      miniOpacityPercent: defaultMiniOpacityPercent,
    });
  });

  it("clamps restored window positions back into a visible monitor work area", () => {
    expect(
      resolveVisibleWindowPosition({
        fallbackPosition: { x: 80, y: 80 },
        position: { x: 1_700, y: 120 },
        size: { width: 480, height: 460 },
        workAreas: [{ x: 0, y: 0, width: 1_920, height: 1_080 }],
      }),
    ).toEqual({ x: 1_424, y: 120 });
  });

  it("preserves a saved position on a secondary monitor to the left", () => {
    expect(
      resolveVisibleWindowPosition({
        fallbackPosition: { x: 80, y: 80 },
        position: { x: -2_000, y: 120 },
        size: { width: 480, height: 460 },
        workAreas: [
          { x: 0, y: 0, width: 1_920, height: 1_080, scaleFactor: 1 },
          { x: -2_560, y: 0, width: 2_560, height: 1_440, scaleFactor: 1.25 },
        ],
      }),
    ).toEqual({ x: -2_000, y: 120 });
  });

  it("converts logical window size and margin for a high-DPI work area", () => {
    expect(
      resolveVisibleWindowPosition({
        fallbackPosition: { x: 80, y: 80 },
        position: { x: 1_700, y: 900 },
        size: { width: 480, height: 460 },
        workAreas: [{ x: 0, y: 0, width: 1_920, height: 1_080, scaleFactor: 1.5 }],
      }),
    ).toEqual({ x: 1_176, y: 366 });
  });

  it("falls back to the primary work area when the saved monitor is disconnected", () => {
    expect(
      resolveVisibleWindowPosition({
        fallbackPosition: { x: 80, y: 80 },
        position: { x: 2_400, y: 120 },
        size: { width: 480, height: 460 },
        workAreas: [{ x: 0, y: 0, width: 1_920, height: 1_080 }],
      }),
    ).toEqual({ x: 80, y: 80 });
  });
});

describe("window settings schema gate", () => {
  it("stays at or below the shared settings schema version it is compared against", () => {
    // resolveWindowPreferences gates on `savedSettingsVersion >= windowSettingsSchemaVersion`,
    // but the stored `settingsVersion` key only ever holds settingsSchemaVersion. If this gate
    // ever exceeded that value it would fail for every install and reset all window sizes.
    expect(windowSettingsSchemaVersion).toBeLessThanOrEqual(settingsSchemaVersion);
  });

  it("discards window sizes saved before the gate version", () => {
    const preferences = resolveWindowPreferences({
      savedFullSize: { width: 720, height: 540 },
      savedSettingsVersion: windowSettingsSchemaVersion - 1,
    });

    expect(preferences.fullSize).toEqual(fullWindowSize);
  });

  it("keeps window sizes for every version the app actually writes", () => {
    const preferences = resolveWindowPreferences({
      savedFullSize: { width: 720, height: 540 },
      savedSettingsVersion: settingsSchemaVersion,
    });

    expect(preferences.fullSize).toEqual({ width: 720, height: 540 });
  });
});

describe("window size normalization against corrupt stored values", () => {
  it("falls back to defaults for non-finite and non-numeric sizes", () => {
    expect(normalizeFullSize({ width: Number.NaN, height: Number.NaN })).toEqual(
      fullWindowSize,
    );
    expect(
      normalizeFullSize({
        width: Number.POSITIVE_INFINITY,
        height: Number.NEGATIVE_INFINITY,
      }),
    ).toEqual(fullWindowSize);
    expect(
      normalizeFullSize({ width: "abc", height: 460 } as unknown as Partial<WindowSize>),
    ).toEqual(fullWindowSize);
    // Only the corrupt axis falls back; a valid height is preserved.
    expect(normalizeMiniSize({ width: Number.NaN, height: 60 })).toEqual({
      width: miniDefaultSize.width,
      height: 60,
    });
  });

  it("caps absurd sizes that would otherwise survive every save and load", () => {
    expect(normalizeFullSize({ width: 1e9, height: 1e9 })).toEqual({
      width: maxWindowDimension,
      height: maxWindowDimension,
    });
    expect(normalizeMiniSize({ width: 1e9, height: 1e9 })).toEqual({
      width: maxWindowDimension,
      height: maxWindowDimension,
    });
  });

  it("still honours ordinary saved sizes", () => {
    expect(normalizeFullSize({ width: 640, height: 520 })).toEqual({
      width: 640,
      height: 520,
    });
    expect(normalizeMiniSize({ width: 200, height: 70 })).toEqual({
      width: 200,
      height: 70,
    });
  });
});

// Windows parks minimized windows at (-32000, -32000). A full-screen game that minimizes the
// app made that sentinel reach the settings file, which left the window unreachable.
describe("minimized window sentinel positions", () => {
  const workAreas = [{ x: 0, y: 0, width: 1_920, height: 1_040, scaleFactor: 1 }];
  const fullSize = { width: 480, height: 460 };

  it("rejects the Windows minimize sentinel as a window position", () => {
    expect(minimizedWindowCoordinate).toBe(-32_000);
    expect(
      isUsableWindowPosition({
        x: minimizedWindowCoordinate,
        y: minimizedWindowCoordinate,
      }),
    ).toBe(false);
    expect(sanitizeWindowPosition({ x: -32_000, y: -32_000 })).toBeUndefined();
    // Only one axis parked is still a minimized window.
    expect(sanitizeWindowPosition({ x: -32_000, y: 240 })).toBeUndefined();
  });

  it("keeps real positions including negative secondary-monitor coordinates", () => {
    expect(sanitizeWindowPosition({ x: -1_820, y: 140 })).toEqual({ x: -1_820, y: 140 });
    expect(sanitizeWindowPosition({ x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
    expect(sanitizeWindowPosition({ x: 240.6, y: 139.2 })).toEqual({ x: 241, y: 139 });
  });

  it("rejects corrupt and non-numeric stored coordinates", () => {
    for (const position of [
      { x: Number.NaN, y: 10 },
      { x: 10, y: Number.POSITIVE_INFINITY },
      { x: Number.NEGATIVE_INFINITY, y: 10 },
      { x: "80", y: 80 },
      { x: 80 },
      { x: null, y: null },
      {},
      null,
      undefined,
      "80,80",
      [80, 80],
      { x: 1e9, y: 1e9 },
    ]) {
      expect(sanitizeWindowPosition(position)).toBeUndefined();
    }
  });

  it("restores a sentinel position to the visible fallback instead of offscreen", () => {
    expect(
      resolveVisibleWindowPosition({
        fallbackPosition: { x: 80, y: 80 },
        position: { x: -32_000, y: -32_000 },
        size: fullSize,
        workAreas,
      }),
    ).toEqual({ x: 80, y: 80 });
  });

  it("still recovers a sentinel position when no monitor can be enumerated", () => {
    expect(
      resolveVisibleWindowPosition({
        fallbackPosition: { x: 80, y: 80 },
        position: { x: -32_000, y: -32_000 },
        size: fullSize,
        workAreas: [],
      }),
    ).toEqual({ x: 80, y: 80 });
  });

  it("leaves the window alone when nothing was ever saved", () => {
    expect(
      resolveVisibleWindowPosition({
        fallbackPosition: { x: 80, y: 80 },
        position: undefined,
        size: fullSize,
        workAreas,
      }),
    ).toBeUndefined();
  });

  it("drops sentinel positions while loading stored preferences", () => {
    const preferences = resolveWindowPreferences({
      savedMainPosition: { x: -32_000, y: -32_000 },
      savedMiniPosition: { x: -32_000, y: -32_000 },
      savedSettingsVersion: currentSettingsSchemaVersion,
    });

    expect(preferences.mainPosition).toBeUndefined();
    expect(preferences.miniPosition).toBeUndefined();
  });

  it("keeps valid stored positions while loading preferences", () => {
    const preferences = resolveWindowPreferences({
      savedMainPosition: { x: 320, y: 200 },
      savedMiniPosition: { x: -1_800, y: 60 },
      savedSettingsVersion: currentSettingsSchemaVersion,
    });

    expect(preferences.mainPosition).toEqual({ x: 320, y: 200 });
    expect(preferences.miniPosition).toEqual({ x: -1_800, y: 60 });
  });

  it("treats a sentinel or fully offscreen window as not visible", () => {
    expect(
      isWindowPositionVisible({
        position: { x: -32_000, y: -32_000 },
        size: fullSize,
        workAreas,
      }),
    ).toBe(false);
    expect(
      isWindowPositionVisible({
        position: { x: 4_000, y: 80 },
        size: fullSize,
        workAreas,
      }),
    ).toBe(false);
    expect(
      isWindowPositionVisible({ position: undefined, size: fullSize, workAreas }),
    ).toBe(false);
  });

  it("treats a partly offscreen window as visible so it is never yanked back", () => {
    expect(
      isWindowPositionVisible({
        position: { x: 1_800, y: 900 },
        size: fullSize,
        workAreas,
      }),
    ).toBe(true);
    expect(
      isWindowPositionVisible({
        position: { x: -200, y: 40 },
        size: fullSize,
        workAreas,
      }),
    ).toBe(true);
    // Without monitor information we cannot prove the window is lost.
    expect(
      isWindowPositionVisible({
        position: { x: 320, y: 200 },
        size: fullSize,
        workAreas: [],
      }),
    ).toBe(true);
  });
});

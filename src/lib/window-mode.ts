// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

export type ThemeMode = "light" | "dark";

export type WindowSize = {
  width: number;
  height: number;
};

export type WindowPosition = {
  x: number;
  y: number;
};

export type WindowWorkArea = WindowPosition &
  WindowSize & {
    scaleFactor?: number;
  };

export const windowSettingsSchemaVersion = 2;
export const currentSettingsSchemaVersion = windowSettingsSchemaVersion;

export const fullWindowSize: WindowSize = { width: 480, height: 460 };
export const fullWindowMinSize: WindowSize = { width: 430, height: 410 };
export const miniDefaultSize: WindowSize = { width: 176, height: 54 };
export const miniMinSize: WindowSize = { width: 148, height: 44 };
export const miniResizeEdgeSize = 10;
export const minMiniOpacityPercent = 10;
export const maxMiniOpacityPercent = 100;
export const defaultMiniOpacityPercent = 85;

// No display is anywhere near this large, so a bigger stored value is corruption. It matters
// because an unbounded size is valid JSON and would survive every save/load round trip.
export const maxWindowDimension = 10_000;

// `??` alone would only replace null and undefined: NaN, Infinity and non-numeric JSON would
// flow into Math.max, and Math.max(430, NaN) is NaN, which no later clamp can rescue.
const normalizeDimension = (value: unknown, fallback: number, minimum: number) => {
  const numericValue =
    typeof value === "number" && Number.isFinite(value) ? Math.round(value) : fallback;

  return Math.min(maxWindowDimension, Math.max(minimum, numericValue));
};

export const normalizeMiniSize = (
  size: Partial<WindowSize> | null | undefined,
): WindowSize => ({
  width: normalizeDimension(size?.width, miniDefaultSize.width, miniMinSize.width),
  height: normalizeDimension(size?.height, miniDefaultSize.height, miniMinSize.height),
});

export const normalizeFullSize = (
  size: Partial<WindowSize> | null | undefined,
): WindowSize => ({
  width: normalizeDimension(size?.width, fullWindowSize.width, fullWindowMinSize.width),
  height: normalizeDimension(
    size?.height,
    fullWindowSize.height,
    fullWindowMinSize.height,
  ),
});

const defaultRestoreMargin = 16;

// Windows parks a minimized window at a sentinel position far outside every monitor
// (classically -32000, -32000) and reports it through WM_WINDOWPOSCHANGED, which tao
// forwards verbatim as a Moved event. Coordinates in that band describe window state,
// not a place the user put the window, so they must never reach persisted settings.
export const minimizedWindowCoordinate = -32_000;
const sentinelCoordinateCeiling = -30_000;
const maxCoordinateMagnitude = 1_000_000;

const isUsableCoordinate = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isFinite(value) &&
  value > sentinelCoordinateCeiling &&
  Math.abs(value) <= maxCoordinateMagnitude;

export const isUsableWindowPosition = (position: unknown): position is WindowPosition => {
  if (typeof position !== "object" || position === null) return false;

  const { x, y } = position as Partial<WindowPosition>;

  return isUsableCoordinate(x) && isUsableCoordinate(y);
};

export const sanitizeWindowPosition = (position: unknown): WindowPosition | undefined =>
  isUsableWindowPosition(position)
    ? { x: Math.round(position.x), y: Math.round(position.y) }
    : undefined;

const clampValue = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const resolveScaleFactor = (workArea: WindowWorkArea) =>
  typeof workArea.scaleFactor === "number" &&
  Number.isFinite(workArea.scaleFactor) &&
  workArea.scaleFactor > 0
    ? workArea.scaleFactor
    : 1;

const containsPoint = (workArea: WindowWorkArea, position: WindowPosition) =>
  position.x >= workArea.x &&
  position.x < workArea.x + workArea.width &&
  position.y >= workArea.y &&
  position.y < workArea.y + workArea.height;

const resolveOverlapArea = (
  workArea: WindowWorkArea,
  position: WindowPosition,
  size: WindowSize,
) => {
  const scaleFactor = resolveScaleFactor(workArea);
  const physicalWidth = Math.round(size.width * scaleFactor);
  const physicalHeight = Math.round(size.height * scaleFactor);
  const overlapWidth = Math.max(
    0,
    Math.min(position.x + physicalWidth, workArea.x + workArea.width) -
      Math.max(position.x, workArea.x),
  );
  const overlapHeight = Math.max(
    0,
    Math.min(position.y + physicalHeight, workArea.y + workArea.height) -
      Math.max(position.y, workArea.y),
  );

  return overlapWidth * overlapHeight;
};

export function resolveVisibleWindowPosition({
  fallbackPosition,
  position,
  restoreMargin = defaultRestoreMargin,
  size,
  workAreas,
}: {
  fallbackPosition: WindowPosition;
  position: WindowPosition | undefined;
  restoreMargin?: number;
  size: WindowSize;
  workAreas: WindowWorkArea[];
}): WindowPosition | undefined {
  if (!position) return undefined;

  // A stored position can be a minimize sentinel or otherwise corrupt. Drop it here so a
  // poisoned value falls back to a visible spot instead of being restored verbatim.
  const usablePosition = sanitizeWindowPosition(position);

  const primaryArea = workAreas[0];
  if (!primaryArea) return usablePosition ?? fallbackPosition;

  const containingArea = usablePosition
    ? workAreas.find((workArea) => containsPoint(workArea, usablePosition))
    : undefined;
  const overlappingAreas = usablePosition
    ? workAreas
        .map((workArea) => ({
          overlapArea: resolveOverlapArea(workArea, usablePosition, size),
          workArea,
        }))
        .filter(({ overlapArea }) => overlapArea > 0)
        .sort((left, right) => right.overlapArea - left.overlapArea)
    : [];
  const targetArea = containingArea ?? overlappingAreas[0]?.workArea ?? primaryArea;
  const targetPosition =
    usablePosition && (containingArea || overlappingAreas.length > 0)
      ? usablePosition
      : fallbackPosition;
  const scaleFactor = resolveScaleFactor(targetArea);
  const physicalMargin = Math.round(restoreMargin * scaleFactor);
  const physicalWidth = Math.round(size.width * scaleFactor);
  const physicalHeight = Math.round(size.height * scaleFactor);
  const minX = targetArea.x + physicalMargin;
  const minY = targetArea.y + physicalMargin;
  const maxX = Math.max(
    minX,
    targetArea.x + targetArea.width - physicalWidth - physicalMargin,
  );
  const maxY = Math.max(
    minY,
    targetArea.y + targetArea.height - physicalHeight - physicalMargin,
  );

  return {
    x: clampValue(targetPosition.x, minX, maxX),
    y: clampValue(targetPosition.y, minY, maxY),
  };
}

// True when at least part of the window would land on a monitor work area. Used to decide
// whether a window needs rescuing, so a deliberately half-offscreen window is left alone.
export function isWindowPositionVisible({
  position,
  size,
  workAreas,
}: {
  position: WindowPosition | undefined;
  size: WindowSize;
  workAreas: WindowWorkArea[];
}): boolean {
  const usablePosition = sanitizeWindowPosition(position);
  if (!usablePosition) return false;
  // With no monitor information we cannot prove the window is lost, so do not fight the OS.
  if (workAreas.length === 0) return true;

  return workAreas.some(
    (workArea) => resolveOverlapArea(workArea, usablePosition, size) > 0,
  );
}

export const normalizeMiniOpacityPercent = (value: unknown) => {
  const numericValue =
    typeof value === "number" && Number.isFinite(value)
      ? Math.round(value)
      : defaultMiniOpacityPercent;

  return Math.min(maxMiniOpacityPercent, Math.max(minMiniOpacityPercent, numericValue));
};

export type StoredWindowPreferences = {
  savedIsMiniMode?: boolean;
  savedMiniSize?: Partial<WindowSize> | null;
  savedFullSize?: Partial<WindowSize> | null;
  savedMiniOpacityPercent?: number;
  savedMainPosition?: WindowPosition;
  savedMiniPosition?: WindowPosition;
  savedSettingsVersion?: number;
};

export function resolveWindowPreferences({
  savedIsMiniMode,
  savedMiniSize,
  savedFullSize,
  savedMiniOpacityPercent,
  savedMainPosition,
  savedMiniPosition,
  savedSettingsVersion,
}: StoredWindowPreferences): {
  isMiniMode: boolean;
  miniSize: WindowSize;
  fullSize: WindowSize;
  miniOpacityPercent: number;
  mainPosition?: WindowPosition;
  miniPosition?: WindowPosition;
} {
  const isCompatibleSchema =
    typeof savedSettingsVersion === "number" &&
    savedSettingsVersion >= windowSettingsSchemaVersion;

  return {
    isMiniMode: savedIsMiniMode === true,
    miniSize: isCompatibleSchema ? normalizeMiniSize(savedMiniSize) : miniDefaultSize,
    fullSize: isCompatibleSchema ? normalizeFullSize(savedFullSize) : fullWindowSize,
    miniOpacityPercent: isCompatibleSchema
      ? normalizeMiniOpacityPercent(savedMiniOpacityPercent)
      : defaultMiniOpacityPercent,
    mainPosition: sanitizeWindowPosition(savedMainPosition),
    miniPosition: sanitizeWindowPosition(savedMiniPosition),
  };
}

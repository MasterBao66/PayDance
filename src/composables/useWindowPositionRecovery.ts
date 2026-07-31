// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { PhysicalPosition } from "@tauri-apps/api/dpi";
import { availableMonitors, primaryMonitor } from "@tauri-apps/api/window";
import type { Ref } from "vue";
import {
  isWindowPositionVisible,
  resolveVisibleWindowPosition,
  sanitizeWindowPosition,
  type WindowPosition,
  type WindowSize,
  type WindowWorkArea,
} from "../lib/window-mode";

type PositionRecoveryWindow = {
  isMinimized?: () => Promise<boolean>;
  outerPosition: () => Promise<PhysicalPosition>;
  setPosition: (position: PhysicalPosition) => Promise<void>;
  unminimize?: () => Promise<void>;
};

export const fallbackMainPosition: WindowPosition = { x: 80, y: 80 };

const readMonitorWorkAreas = async (): Promise<WindowWorkArea[]> => {
  try {
    const monitors = await availableMonitors();
    const primary = await primaryMonitor().catch(() => null);
    const primaryIndex = primary
      ? monitors.findIndex(
          (monitor) =>
            monitor.position.x === primary.position.x &&
            monitor.position.y === primary.position.y &&
            monitor.size.width === primary.size.width &&
            monitor.size.height === primary.size.height,
        )
      : -1;
    const orderedMonitors =
      primaryIndex > 0
        ? [
            monitors[primaryIndex],
            ...monitors.filter((_, index) => index !== primaryIndex),
          ]
        : monitors;

    return orderedMonitors.map((monitor) => ({
      height: monitor.workArea.size.height,
      scaleFactor: monitor.scaleFactor,
      width: monitor.workArea.size.width,
      x: monitor.workArea.position.x,
      y: monitor.workArea.position.y,
    }));
  } catch {
    return [];
  }
};

export function useWindowPositionRecovery({
  appWindow,
  fullSize,
  isMiniMode,
  mainPosition,
  miniPosition,
  miniSize,
}: {
  appWindow: PositionRecoveryWindow;
  fullSize: Ref<WindowSize>;
  isMiniMode: Ref<boolean>;
  mainPosition: Ref<WindowPosition | undefined>;
  miniPosition: Ref<WindowPosition | undefined>;
  miniSize: Ref<WindowSize>;
}) {
  const activePosition = () => (isMiniMode.value ? miniPosition : mainPosition);

  const readWindowPosition = (miniMode = isMiniMode.value) => {
    const position = miniMode
      ? (miniPosition.value ?? mainPosition.value)
      : mainPosition.value;

    return position ? { ...position } : undefined;
  };

  const isWindowMinimized = async () => {
    try {
      return (await appWindow.isMinimized?.()) === true;
    } catch {
      return false;
    }
  };

  // Returns false when the incoming position is a minimize sentinel or otherwise unusable,
  // so callers can skip both the state update and the settings write.
  const recordWindowPosition = (position: WindowPosition) => {
    const usablePosition = sanitizeWindowPosition(position);
    if (!usablePosition) return false;

    activePosition().value = usablePosition;

    return true;
  };

  const captureWindowPosition = async () => {
    // A minimized window reports the sentinel position, which would overwrite the real one.
    if (await isWindowMinimized()) return false;

    return recordWindowPosition(await appWindow.outerPosition());
  };

  const moveWindowTo = async (position: WindowPosition) => {
    recordWindowPosition(position);
    await appWindow.setPosition(new PhysicalPosition(position.x, position.y));
  };

  const restoreWindowPosition = async (
    savedPosition: WindowPosition | undefined = readWindowPosition(),
  ) => {
    if (!savedPosition) return;

    const visiblePosition = resolveVisibleWindowPosition({
      fallbackPosition: fallbackMainPosition,
      position: savedPosition,
      size: isMiniMode.value ? miniSize.value : fullSize.value,
      workAreas: await readMonitorWorkAreas(),
    });

    if (visiblePosition) {
      await moveWindowTo(visiblePosition);
    }
  };

  // Rescues a window the user cannot reach any more: minimized by a full-screen game, left at
  // the minimize sentinel, or stranded on a monitor that is gone. Runs whenever the window is
  // shown from the tray or a second launch, and deliberately does nothing when the window is
  // already at least partly on screen so it never overrides where the user put it.
  const ensureWindowOnScreen = async () => {
    try {
      await appWindow.unminimize?.();
    } catch {
      // A window that cannot be unminimized is still worth repositioning.
    }

    const size = isMiniMode.value ? miniSize.value : fullSize.value;
    const workAreas = await readMonitorWorkAreas();
    const currentPosition = sanitizeWindowPosition(
      await appWindow.outerPosition().catch(() => undefined),
    );

    if (
      currentPosition &&
      isWindowPositionVisible({ position: currentPosition, size, workAreas })
    ) {
      recordWindowPosition(currentPosition);
      return false;
    }

    const visiblePosition = resolveVisibleWindowPosition({
      fallbackPosition: fallbackMainPosition,
      position: currentPosition ?? readWindowPosition() ?? fallbackMainPosition,
      size,
      workAreas,
    });

    if (!visiblePosition) return false;

    await moveWindowTo(visiblePosition);

    return true;
  };

  return {
    captureWindowPosition,
    ensureWindowOnScreen,
    readWindowPosition,
    recordWindowPosition,
    restoreWindowPosition,
  };
}

// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { PhysicalPosition } from "@tauri-apps/api/dpi";
import { availableMonitors, primaryMonitor } from "@tauri-apps/api/window";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useWindowPositionRecovery } from "./useWindowPositionRecovery";

vi.mock("@tauri-apps/api/window", () => ({
  availableMonitors: vi.fn(),
  primaryMonitor: vi.fn(),
}));

const createWindow = () => ({
  isMinimized: vi.fn(async () => false),
  outerPosition: vi.fn(async () => new PhysicalPosition(0, 0)),
  setPosition: vi.fn(async (position: PhysicalPosition) => {
    void position;
  }),
  unminimize: vi.fn(async () => undefined),
});

describe("useWindowPositionRecovery", () => {
  beforeEach(() => {
    const primary = {
      name: "Primary",
      position: new PhysicalPosition(0, 0),
      scaleFactor: 1,
      size: { height: 1_080, width: 1_920 },
      workArea: {
        position: new PhysicalPosition(0, 0),
        size: { height: 1_040, width: 1_920 },
      },
    };
    vi.mocked(availableMonitors).mockResolvedValue([primary] as never);
    vi.mocked(primaryMonitor).mockResolvedValue(primary as never);
  });

  it("records movement in the active mode without overwriting the other mode", () => {
    const mainPosition = ref({ x: 100, y: 120 });
    const miniPosition = ref({ x: 700, y: 80 });
    const isMiniMode = ref(true);
    const { recordWindowPosition } = useWindowPositionRecovery({
      appWindow: createWindow(),
      fullSize: ref({ height: 460, width: 480 }),
      isMiniMode,
      mainPosition,
      miniPosition,
      miniSize: ref({ height: 54, width: 176 }),
    });

    recordWindowPosition(new PhysicalPosition(900, 140));

    expect(mainPosition.value).toEqual({ x: 100, y: 120 });
    expect(miniPosition.value).toEqual({ x: 900, y: 140 });

    isMiniMode.value = false;
    recordWindowPosition(new PhysicalPosition(220, 180));

    expect(mainPosition.value).toEqual({ x: 220, y: 180 });
    expect(miniPosition.value).toEqual({ x: 900, y: 140 });
  });

  it("restores the active mode with a physical position and monitor work area", async () => {
    const appWindow = createWindow();
    const isMiniMode = ref(true);
    const mainPosition = ref({ x: 120, y: 160 });
    const miniPosition = ref({ x: 1_860, y: 1_000 });
    const { restoreWindowPosition } = useWindowPositionRecovery({
      appWindow,
      fullSize: ref({ height: 460, width: 480 }),
      isMiniMode,
      mainPosition,
      miniPosition,
      miniSize: ref({ height: 54, width: 176 }),
    });

    await restoreWindowPosition();

    const restoredPosition = appWindow.setPosition.mock.calls[0]?.[0];
    expect(restoredPosition).toBeInstanceOf(PhysicalPosition);
    expect(restoredPosition).toMatchObject({ x: 1_728, y: 970 });
    expect(mainPosition.value).toEqual({ x: 120, y: 160 });
    expect(miniPosition.value).toEqual({ x: 1_728, y: 970 });
  });

  it("captures the outgoing mode position before a mode transition", async () => {
    const appWindow = createWindow();
    appWindow.outerPosition.mockResolvedValue(new PhysicalPosition(640, 360));
    const mainPosition = ref({ x: 120, y: 160 });
    const miniPosition = ref({ x: 900, y: 80 });
    const { captureWindowPosition } = useWindowPositionRecovery({
      appWindow,
      fullSize: ref({ height: 460, width: 480 }),
      isMiniMode: ref(false),
      mainPosition,
      miniPosition,
      miniSize: ref({ height: 54, width: 176 }),
    });

    await captureWindowPosition();

    expect(mainPosition.value).toEqual({ x: 640, y: 360 });
    expect(miniPosition.value).toEqual({ x: 900, y: 80 });
  });

  it("uses the actual primary monitor for disconnected-display fallback", async () => {
    const secondary = {
      name: "Secondary",
      position: new PhysicalPosition(-1_920, 0),
      scaleFactor: 1,
      size: { height: 1_080, width: 1_920 },
      workArea: {
        position: new PhysicalPosition(-1_920, 0),
        size: { height: 1_040, width: 1_920 },
      },
    };
    const primary = {
      name: "Primary",
      position: new PhysicalPosition(0, 0),
      scaleFactor: 1,
      size: { height: 1_080, width: 1_920 },
      workArea: {
        position: new PhysicalPosition(0, 0),
        size: { height: 1_040, width: 1_920 },
      },
    };
    vi.mocked(availableMonitors).mockResolvedValue([secondary, primary] as never);
    vi.mocked(primaryMonitor).mockResolvedValue(primary as never);
    const appWindow = createWindow();
    const { restoreWindowPosition } = useWindowPositionRecovery({
      appWindow,
      fullSize: ref({ height: 460, width: 480 }),
      isMiniMode: ref(false),
      mainPosition: ref({ x: 4_000, y: 120 }),
      miniPosition: ref(undefined),
      miniSize: ref({ height: 54, width: 176 }),
    });

    await restoreWindowPosition();

    expect(appWindow.setPosition.mock.calls[0]?.[0]).toMatchObject({ x: 80, y: 80 });
  });
});

// A full-screen game minimizes the app; Windows reports (-32000, -32000) through onMoved and
// outerPosition. Persisting that left users with a window they could not get back.
describe("useWindowPositionRecovery minimize sentinel handling", () => {
  const minimized = new PhysicalPosition(-32_000, -32_000);

  beforeEach(() => {
    const primary = {
      name: "Primary",
      position: new PhysicalPosition(0, 0),
      scaleFactor: 1,
      size: { height: 1_080, width: 1_920 },
      workArea: {
        position: new PhysicalPosition(0, 0),
        size: { height: 1_040, width: 1_920 },
      },
    };
    vi.mocked(availableMonitors).mockResolvedValue([primary] as never);
    vi.mocked(primaryMonitor).mockResolvedValue(primary as never);
  });

  const createRecovery = (appWindow = createWindow(), isMiniMode = ref(false)) => {
    const mainPosition = ref<{ x: number; y: number } | undefined>({ x: 300, y: 220 });
    const miniPosition = ref<{ x: number; y: number } | undefined>({ x: 900, y: 80 });

    return {
      appWindow,
      mainPosition,
      miniPosition,
      recovery: useWindowPositionRecovery({
        appWindow,
        fullSize: ref({ height: 460, width: 480 }),
        isMiniMode,
        mainPosition,
        miniPosition,
        miniSize: ref({ height: 54, width: 176 }),
      }),
    };
  };

  it("refuses to record the minimize sentinel reported by onMoved", () => {
    const { mainPosition, recovery } = createRecovery();

    expect(recovery.recordWindowPosition(minimized)).toBe(false);
    expect(mainPosition.value).toEqual({ x: 300, y: 220 });
  });

  it("still records a real move", () => {
    const { mainPosition, recovery } = createRecovery();

    expect(recovery.recordWindowPosition(new PhysicalPosition(640, 360))).toBe(true);
    expect(mainPosition.value).toEqual({ x: 640, y: 360 });
  });

  it("does not capture a position while the window is minimized", async () => {
    const appWindow = createWindow();
    appWindow.isMinimized.mockResolvedValue(true);
    appWindow.outerPosition.mockResolvedValue(minimized);
    const { mainPosition, recovery } = createRecovery(appWindow);

    expect(await recovery.captureWindowPosition()).toBe(false);
    expect(mainPosition.value).toEqual({ x: 300, y: 220 });
    expect(appWindow.outerPosition).not.toHaveBeenCalled();
  });

  it("rescues a window parked at the sentinel back to its last known position", async () => {
    const appWindow = createWindow();
    appWindow.outerPosition.mockResolvedValue(minimized);
    const { recovery } = createRecovery(appWindow);

    expect(await recovery.ensureWindowOnScreen()).toBe(true);
    expect(appWindow.unminimize).toHaveBeenCalled();
    expect(appWindow.setPosition.mock.calls[0]?.[0]).toMatchObject({ x: 300, y: 220 });
  });

  it("rescues to the default spot when no good position was ever saved", async () => {
    const appWindow = createWindow();
    appWindow.outerPosition.mockResolvedValue(minimized);
    const mainPosition = ref<{ x: number; y: number } | undefined>(undefined);
    const { ensureWindowOnScreen } = useWindowPositionRecovery({
      appWindow,
      fullSize: ref({ height: 460, width: 480 }),
      isMiniMode: ref(false),
      mainPosition,
      miniPosition: ref(undefined),
      miniSize: ref({ height: 54, width: 176 }),
    });

    expect(await ensureWindowOnScreen()).toBe(true);
    expect(appWindow.setPosition.mock.calls[0]?.[0]).toMatchObject({ x: 80, y: 80 });
    expect(mainPosition.value).toEqual({ x: 80, y: 80 });
  });

  it("rescues a window stranded on a monitor that is gone", async () => {
    const appWindow = createWindow();
    appWindow.outerPosition.mockResolvedValue(new PhysicalPosition(4_000, 120));
    const { recovery } = createRecovery(appWindow);

    expect(await recovery.ensureWindowOnScreen()).toBe(true);
    expect(appWindow.setPosition.mock.calls[0]?.[0]).toMatchObject({ x: 80, y: 80 });
  });

  it("leaves a reachable window exactly where the user put it", async () => {
    const appWindow = createWindow();
    appWindow.outerPosition.mockResolvedValue(new PhysicalPosition(1_850, 980));
    const { mainPosition, recovery } = createRecovery(appWindow);

    expect(await recovery.ensureWindowOnScreen()).toBe(false);
    expect(appWindow.setPosition).not.toHaveBeenCalled();
    // A partly offscreen window is still the user's choice, but it is worth remembering.
    expect(mainPosition.value).toEqual({ x: 1_850, y: 980 });
  });
});

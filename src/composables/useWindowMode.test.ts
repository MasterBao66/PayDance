// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { ref } from "vue";
import { describe, expect, it } from "vitest";
import { fullWindowSize, miniDefaultSize } from "../lib/window-mode";
import { useWindowMode } from "./useWindowMode";

const createManagedWindow = ({
  failSkipTaskbar = false,
}: { failSkipTaskbar?: boolean } = {}) => {
  const alwaysOnTopCalls: boolean[] = [];
  const sizeCalls: Array<{ width: number; height: number }> = [];
  const skipTaskbarCalls: boolean[] = [];

  return {
    alwaysOnTopCalls,
    sizeCalls,
    skipTaskbarCalls,
    window: {
      setAlwaysOnTop: async (value: boolean) => {
        alwaysOnTopCalls.push(value);
      },
      setMinSize: async () => {},
      setResizable: async () => {},
      setSize: async (size: { width: number; height: number }) => {
        sizeCalls.push({ width: size.width, height: size.height });
      },
      setSkipTaskbar: async (skip: boolean) => {
        skipTaskbarCalls.push(skip);
        if (failSkipTaskbar) throw new Error("permission denied");
      },
    },
  };
};

const lastCall = <Value>(calls: Value[]) => calls[calls.length - 1];

describe("useWindowMode", () => {
  it("keeps the full-window topmost preference when mini mode applies topmost", async () => {
    const managedWindow = createManagedWindow();
    const isMiniMode = ref(false);
    const miniSize = ref({ ...miniDefaultSize });
    const fullSize = ref({ ...fullWindowSize });
    const alwaysOnTop = ref(false);
    const { applyWindowMode } = useWindowMode(
      managedWindow.window,
      isMiniMode,
      miniSize,
      fullSize,
      alwaysOnTop,
    );

    isMiniMode.value = true;
    await applyWindowMode();

    expect(lastCall(managedWindow.alwaysOnTopCalls)).toBe(true);
    expect(alwaysOnTop.value).toBe(false);

    isMiniMode.value = false;
    await applyWindowMode();

    expect(lastCall(managedWindow.alwaysOnTopCalls)).toBe(false);
  });

  it("updates full-window topmost preference from mini mode while keeping mini mode topmost", async () => {
    const managedWindow = createManagedWindow();
    const isMiniMode = ref(true);
    const miniSize = ref({ ...miniDefaultSize });
    const fullSize = ref({ ...fullWindowSize });
    const alwaysOnTop = ref(true);
    const { setAlwaysOnTop } = useWindowMode(
      managedWindow.window,
      isMiniMode,
      miniSize,
      fullSize,
      alwaysOnTop,
    );

    await setAlwaysOnTop(false);

    expect(alwaysOnTop.value).toBe(false);
    expect(lastCall(managedWindow.alwaysOnTopCalls)).toBe(true);
  });

  it("restores the saved full-window size when leaving mini mode", async () => {
    const managedWindow = createManagedWindow();
    const isMiniMode = ref(false);
    const miniSize = ref({ ...miniDefaultSize });
    const fullSize = ref({ width: 720, height: 540 });
    const alwaysOnTop = ref(true);
    const { applyWindowMode } = useWindowMode(
      managedWindow.window,
      isMiniMode,
      miniSize,
      fullSize,
      alwaysOnTop,
    );

    await applyWindowMode();

    expect(lastCall(managedWindow.sizeCalls)).toEqual({ width: 720, height: 540 });
    expect(lastCall(managedWindow.alwaysOnTopCalls)).toBe(true);
  });

  it("drops the taskbar button in mini mode and restores it in full mode", async () => {
    const managedWindow = createManagedWindow();
    const isMiniMode = ref(true);
    const miniSize = ref({ ...miniDefaultSize });
    const fullSize = ref({ ...fullWindowSize });
    const alwaysOnTop = ref(false);
    const { applyWindowMode } = useWindowMode(
      managedWindow.window,
      isMiniMode,
      miniSize,
      fullSize,
      alwaysOnTop,
    );

    await applyWindowMode();
    expect(lastCall(managedWindow.skipTaskbarCalls)).toBe(true);

    isMiniMode.value = false;
    await applyWindowMode();
    expect(lastCall(managedWindow.skipTaskbarCalls)).toBe(false);
  });

  it("re-asserts the mini-mode taskbar state without touching geometry", async () => {
    // Windows re-creates the taskbar button on every show, so hiding to the tray and coming
    // back would restore it even though the window never left mini mode.
    const managedWindow = createManagedWindow();
    const isMiniMode = ref(true);
    const miniSize = ref({ ...miniDefaultSize });
    const fullSize = ref({ ...fullWindowSize });
    const alwaysOnTop = ref(false);
    const { reapplyTaskbarVisibility } = useWindowMode(
      managedWindow.window,
      isMiniMode,
      miniSize,
      fullSize,
      alwaysOnTop,
    );

    await reapplyTaskbarVisibility();

    expect(managedWindow.skipTaskbarCalls).toEqual([true]);
    expect(managedWindow.sizeCalls).toEqual([]);

    isMiniMode.value = false;
    await reapplyTaskbarVisibility();

    expect(managedWindow.skipTaskbarCalls).toEqual([true, false]);
  });

  it("still resizes when the window rejects the taskbar call", async () => {
    const managedWindow = createManagedWindow({ failSkipTaskbar: true });
    const isMiniMode = ref(true);
    const miniSize = ref({ ...miniDefaultSize });
    const fullSize = ref({ ...fullWindowSize });
    const alwaysOnTop = ref(false);
    const { applyWindowMode } = useWindowMode(
      managedWindow.window,
      isMiniMode,
      miniSize,
      fullSize,
      alwaysOnTop,
    );

    await expect(applyWindowMode()).resolves.toBeUndefined();
    expect(lastCall(managedWindow.sizeCalls)).toEqual(miniDefaultSize);
  });

  it("keeps the native mini window topmost after changing the saved full-window preference", async () => {
    const managedWindow = createManagedWindow();
    const isMiniMode = ref(true);
    const miniSize = ref({ ...miniDefaultSize });
    const fullSize = ref({ ...fullWindowSize });
    const alwaysOnTop = ref(false);
    const { setAlwaysOnTop } = useWindowMode(
      managedWindow.window,
      isMiniMode,
      miniSize,
      fullSize,
      alwaysOnTop,
    );

    await setAlwaysOnTop(true);
    await setAlwaysOnTop(false);

    expect(alwaysOnTop.value).toBe(false);
    expect(managedWindow.alwaysOnTopCalls).toEqual([true, true]);
  });
});

// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import MiniOpacityPanel from "./MiniOpacityPanel.vue";

const tauriMocks = vi.hoisted(() => ({
  emitTo: vi.fn(),
  hide: vi.fn(),
  listeners: new Map<string, (event: { payload: unknown }) => void>(),
  listen: vi.fn(),
}));

vi.mock("@tauri-apps/api/event", () => ({
  emitTo: tauriMocks.emitTo,
}));

vi.mock("@tauri-apps/api/window", () => ({
  getCurrentWindow: () => ({
    hide: tauriMocks.hide,
    listen: tauriMocks.listen,
  }),
}));

describe("MiniOpacityPanel behavior", () => {
  beforeEach(() => {
    tauriMocks.emitTo.mockReset();
    tauriMocks.hide.mockReset();
    tauriMocks.listeners.clear();
    tauriMocks.listen.mockReset();
    tauriMocks.listen.mockImplementation(async (event, callback) => {
      tauriMocks.listeners.set(event, callback);
      return vi.fn();
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("opens as a compact themed slider and separates preview from commit", async () => {
    const wrapper = mount(MiniOpacityPanel);
    await nextTick();

    tauriMocks.listeners.get("mini-opacity-panel-open")?.({
      payload: { themeMode: "dark", value: 63, locale: "zh-CN" },
    });
    await nextTick();

    expect(wrapper.classes()).toContain("theme-dark");
    expect(wrapper.text()).toContain("63%");

    const slider = wrapper.get('input[type="range"]');
    expect(slider.attributes("min")).toBe("10");
    expect(slider.attributes("max")).toBe("100");
    expect(slider.attributes("aria-label")).toBe("迷你悬浮透明度");
    expect(slider.attributes("aria-valuetext")).toBe("迷你悬浮透明度 63%");

    (slider.element as HTMLInputElement).value = "42";
    await slider.trigger("input");
    expect(tauriMocks.emitTo).toHaveBeenLastCalledWith("main", "mini-opacity-change", {
      commit: false,
      value: 42,
    });

    await slider.trigger("change");
    expect(tauriMocks.emitTo).toHaveBeenLastCalledWith("main", "mini-opacity-change", {
      commit: true,
      value: 42,
    });
  });

  // This window's startup bails out before settings are read, so the language can only ever
  // reach it through the payload the main window sends when it opens the panel.
  it("follows the language the main window sends with the open payload", async () => {
    const wrapper = mount(MiniOpacityPanel);
    await nextTick();

    tauriMocks.listeners.get("mini-opacity-panel-open")?.({
      payload: { themeMode: "light", value: 50, locale: "en" },
    });
    await nextTick();

    expect(wrapper.get('input[type="range"]').attributes("aria-label")).toBe(
      "Mini floating window opacity",
    );
    expect(wrapper.text()).toContain("Opacity");

    tauriMocks.listeners.get("mini-opacity-panel-open")?.({
      payload: { themeMode: "light", value: 50, locale: "zh-CN" },
    });
    await nextTick();

    expect(wrapper.get('input[type="range"]').attributes("aria-label")).toBe(
      "迷你悬浮透明度",
    );
  });
});

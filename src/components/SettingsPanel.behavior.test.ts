// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

// @vitest-environment happy-dom
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { defaultCurrencySymbol } from "../lib/currency";
import { defaultSalaryConfig } from "../lib/salary";

vi.mock("#updater", () => ({
  downloadAndInstall: vi.fn(async () => ({ kind: "upToDate" })),
}));

vi.mock("#opener", () => ({
  openExternalUrl: vi.fn(async () => {}),
}));

import SettingsPanel from "./SettingsPanel.vue";

const mountSettingsPanel = (
  config = defaultSalaryConfig,
  hasIssue: () => boolean = () => false,
  showOnboardingAction = false,
) =>
  mount(SettingsPanel, {
    props: {
      amountMode: "rolling",
      autostartEnabled: false,
      autostartError: "",
      config: { ...config, workdays: [...config.workdays] },
      currencySymbol: defaultCurrencySymbol,
      firstIssue: "",
      hasIssue,
      isAutostartUpdating: false,
      showDesktopFeatures: true,
      showOnboardingAction,
      updateStatus: { kind: "upToDate" },
    },
  });

describe("SettingsPanel behavior", () => {
  it("shows only the inputs required by the selected salary mode", async () => {
    const wrapper = mountSettingsPanel();

    expect(wrapper.findAll('input[type="number"]').length).toBeGreaterThanOrEqual(2);

    await wrapper.setProps({
      config: {
        ...defaultSalaryConfig,
        salaryType: "daily",
        workdays: [...defaultSalaryConfig.workdays],
      },
    });

    expect(wrapper.findAll('input[type="number"]').length).toBeGreaterThanOrEqual(1);
    expect(wrapper.text()).toContain("日薪");
    expect(wrapper.text()).not.toContain("每月工作天数");
  });

  it("emits shared workday updates from the weekday control", async () => {
    const wrapper = mountSettingsPanel();
    const saturdayButton = wrapper
      .findAll(".weekday-control button")
      .find((button) => button.text() === "六");

    await saturdayButton?.trigger("click");

    expect(wrapper.emitted("update:config")?.[0]?.[0]).toMatchObject({
      workdays: [1, 2, 3, 4, 5, 6],
    });
  });

  it("hides the first-time setup action by default", () => {
    const wrapper = mountSettingsPanel();

    expect(wrapper.find(".onboarding-action-button").exists()).toBe(false);
  });

  it("opens the first-time setup when the Web Preview enables it", async () => {
    const wrapper = mountSettingsPanel(
      { ...defaultSalaryConfig, workdays: [...defaultSalaryConfig.workdays] },
      () => false,
      true,
    );

    await wrapper.get(".onboarding-action-button").trigger("click");

    expect(wrapper.emitted("openOnboarding")).toHaveLength(1);
  });

  it("keeps the first-time setup title and action in one title row", () => {
    const wrapper = mountSettingsPanel(
      { ...defaultSalaryConfig, workdays: [...defaultSalaryConfig.workdays] },
      () => false,
      true,
    );
    const actionButton = wrapper.get(".onboarding-action-button");
    const titleRow = actionButton.element.parentElement;

    expect(titleRow?.classList.contains("group-title--split")).toBe(true);
    expect(titleRow?.querySelector("strong")?.textContent).toContain("首次启动向导");
  });
});

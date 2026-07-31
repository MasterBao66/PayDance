// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { describe, expect, it } from "vitest";
import {
  calculateSalarySnapshot,
  createWorkSpans,
  defaultSalaryConfig,
  validateSalaryConfig,
  type SalaryConfig,
} from "./salary";

const vt = (key: string) => {
  const map: Record<string, string> = {
    "validation.salaryTypeError": "薪资模式错误",
    "validation.monthlyPositive": "月薪需大于 0",
    "validation.dailyPositive": "日薪需大于 0",
    "validation.hourlyPositive": "时薪需大于 0",
    "validation.workDaysPositive": "工作天数需大于 0",
    "validation.workdaysMinOne": "至少选 1 天",
    "validation.workdaysError": "工作日错误",
    "validation.startTimeError": "上班时间错误",
    "validation.endTimeError": "下班时间错误",
    "validation.timeSameError": "时间不能相同",
    "validation.lunchStartError": "午休开始错误",
    "validation.lunchEndError": "午休结束错误",
    "validation.nightLunchOutside": "夜班午休需在工时内",
    "validation.lunchOutside": "午休需在工时内",
  };
  return map[key] ?? key;
};

const at = (time: string) => new Date(`2026-05-11T${time}:00`);

const config: SalaryConfig = {
  ...defaultSalaryConfig,
  salaryType: "monthly",
  monthlySalary: 21750,
  dailySalary: 1000,
  hourlyRate: 125,
  workDaysPerMonth: 21.75,
  workdays: [1, 2, 3, 4, 5],
  startTime: "09:00",
  endTime: "18:00",
  lunchStart: "12:00",
  lunchEnd: "13:00",
  enableLunchBreak: true,
};

describe("calculateSalarySnapshot", () => {
  it("calculates rates from monthly salary and effective work hours", () => {
    const snapshot = calculateSalarySnapshot(at("10:00"), config);

    expect(snapshot.dailySalary).toBe(1000);
    expect(snapshot.workMsToday).toBe(8 * 3_600_000);
    expect(snapshot.hourlyRate).toBe(125);
    expect(snapshot.minuteRate).toBeCloseTo(125 / 60);
    expect(snapshot.secondRate).toBeCloseTo(125 / 3600);
    expect(snapshot.status).toBe("working");
  });

  it("calculates rates from daily salary mode", () => {
    const snapshot = calculateSalarySnapshot(at("10:00"), {
      ...config,
      salaryType: "daily",
      monthlySalary: 1,
      dailySalary: 800,
    });

    expect(snapshot.dailySalary).toBe(800);
    expect(snapshot.hourlyRate).toBe(100);
    expect(snapshot.earnedToday).toBeCloseTo(100);
  });

  it("calculates rates from hourly salary mode", () => {
    const snapshot = calculateSalarySnapshot(at("10:00"), {
      ...config,
      salaryType: "hourly",
      monthlySalary: 1,
      hourlyRate: 90,
    });

    expect(snapshot.dailySalary).toBe(720);
    expect(snapshot.hourlyRate).toBe(90);
    expect(snapshot.earnedToday).toBeCloseTo(90);
  });

  it("returns rest day status and zero earnings outside configured workdays", () => {
    const snapshot = calculateSalarySnapshot(new Date("2026-05-10T10:00:00"), config);

    expect(snapshot.status).toBe("rest-day");
    expect(snapshot.earnedToday).toBe(0);
    expect(snapshot.workMsToday).toBe(0);
  });

  it("keeps earned amount at zero before work starts", () => {
    const snapshot = calculateSalarySnapshot(at("08:59"), config);

    expect(snapshot.earnedToday).toBe(0);
    expect(snapshot.progress).toBe(0);
    expect(snapshot.isWorking).toBe(false);
    expect(snapshot.status).toBe("before-work");
    expect(snapshot.nextTransitionMs).toBe(60_000);
  });

  it("holds progress during lunch break", () => {
    const beforeLunch = calculateSalarySnapshot(at("12:00"), config);
    const duringLunch = calculateSalarySnapshot(at("12:30"), config);

    expect(beforeLunch.elapsedWorkMs).toBe(3 * 3_600_000);
    expect(duringLunch.elapsedWorkMs).toBe(beforeLunch.elapsedWorkMs);
    expect(duringLunch.isWorking).toBe(false);
    expect(duringLunch.status).toBe("lunch-break");
    expect(duringLunch.nextTransitionMs).toBe(30 * 60_000);
  });

  it("returns full daily salary after work ends", () => {
    const snapshot = calculateSalarySnapshot(at("18:01"), config);

    expect(snapshot.earnedToday).toBe(1000);
    expect(snapshot.progress).toBe(1);
    expect(snapshot.isWorking).toBe(false);
    expect(snapshot.status).toBe("after-work");
    expect(snapshot.nextTransitionMs).toBe(0);
  });

  it("reports time until the final work end while working", () => {
    const snapshot = calculateSalarySnapshot(at("10:00"), config);

    expect(snapshot.status).toBe("working");
    expect(snapshot.nextTransitionMs).toBe(8 * 3_600_000);
  });

  it("returns after-work exactly at the configured end time", () => {
    const snapshot = calculateSalarySnapshot(at("18:00"), config);

    expect(snapshot.earnedToday).toBe(1000);
    expect(snapshot.progress).toBe(1);
    expect(snapshot.isWorking).toBe(false);
    expect(snapshot.status).toBe("after-work");
  });

  it("ignores invalid lunch fields when lunch break is disabled", () => {
    const snapshot = calculateSalarySnapshot(at("13:30"), {
      ...config,
      enableLunchBreak: false,
      lunchStart: "broken",
      lunchEnd: "also-broken",
    });

    expect(snapshot.workMsToday).toBe(9 * 3_600_000);
    expect(snapshot.earnedToday).toBeCloseTo(500);
  });

  it("returns invalid config status for invalid active salary amount", () => {
    const snapshot = calculateSalarySnapshot(at("10:00"), {
      ...config,
      salaryType: "daily",
      dailySalary: 0,
    });

    expect(snapshot.status).toBe("invalid-config");
    expect(snapshot.earnedToday).toBe(0);
  });

  it("calculates earnings for overnight shifts after midnight", () => {
    const snapshot = calculateSalarySnapshot(new Date("2026-05-12T02:00:00"), {
      ...config,
      salaryType: "daily",
      dailySalary: 800,
      workdays: [1],
      startTime: "22:00",
      endTime: "06:00",
      enableLunchBreak: false,
    });

    expect(snapshot.status).toBe("working");
    expect(snapshot.workMsToday).toBe(8 * 3_600_000);
    expect(snapshot.elapsedWorkMs).toBe(4 * 3_600_000);
    expect(snapshot.earnedToday).toBe(400);
    expect(snapshot.progress).toBe(0.5);
    expect(snapshot.nextTransitionMs).toBe(4 * 3_600_000);
  });

  it("keeps overnight shifts in after-work status after the next-day end time", () => {
    const snapshot = calculateSalarySnapshot(new Date("2026-05-12T06:01:00"), {
      ...config,
      salaryType: "daily",
      dailySalary: 800,
      workdays: [1],
      startTime: "22:00",
      endTime: "06:00",
      enableLunchBreak: false,
    });

    expect(snapshot.status).toBe("after-work");
    expect(snapshot.earnedToday).toBe(800);
    expect(snapshot.progress).toBe(1);
    expect(snapshot.nextTransitionMs).toBe(0);
  });

  it("prefers the completed previous overnight shift before the next overnight shift starts", () => {
    const snapshot = calculateSalarySnapshot(new Date("2026-05-12T06:01:00"), {
      ...config,
      salaryType: "daily",
      dailySalary: 800,
      workdays: [1, 2, 3, 4, 5],
      startTime: "22:00",
      endTime: "06:00",
      enableLunchBreak: false,
    });

    expect(snapshot.status).toBe("after-work");
    expect(snapshot.earnedToday).toBe(800);
    expect(snapshot.progress).toBe(1);
    expect(snapshot.nextTransitionMs).toBe(0);
  });

  it("keeps a workday overnight shift active after crossing into a rest day", () => {
    const snapshot = calculateSalarySnapshot(new Date("2026-05-16T02:00:00"), {
      ...config,
      salaryType: "daily",
      dailySalary: 800,
      workdays: [5],
      startTime: "22:00",
      endTime: "06:00",
      enableLunchBreak: false,
    });

    expect(snapshot.status).toBe("working");
    expect(snapshot.elapsedWorkMs).toBe(4 * 3_600_000);
    expect(snapshot.earnedToday).toBe(400);
  });

  it("keeps a completed workday overnight shift after crossing into a rest day", () => {
    const snapshot = calculateSalarySnapshot(new Date("2026-05-16T06:01:00"), {
      ...config,
      salaryType: "daily",
      dailySalary: 800,
      workdays: [5],
      startTime: "22:00",
      endTime: "06:00",
      enableLunchBreak: false,
    });

    expect(snapshot.status).toBe("after-work");
    expect(snapshot.earnedToday).toBe(800);
  });

  it("marks daytime shifts as night work only after entering the 22:00 work segment", () => {
    const longShiftConfig = {
      ...config,
      workdays: [1],
      startTime: "09:30",
      endTime: "02:30",
      enableLunchBreak: false,
    };

    const beforeNight = calculateSalarySnapshot(
      new Date("2026-05-11T21:59:00"),
      longShiftConfig,
    );
    const atNightStart = calculateSalarySnapshot(
      new Date("2026-05-11T22:00:00"),
      longShiftConfig,
    );
    const afterMidnight = calculateSalarySnapshot(
      new Date("2026-05-12T00:30:00"),
      longShiftConfig,
    );

    expect(beforeNight.status).toBe("working");
    expect(beforeNight.isNightWork).toBe(false);
    expect(atNightStart.status).toBe("working");
    expect(atNightStart.isNightWork).toBe(true);
    expect(afterMidnight.status).toBe("working");
    expect(afterMidnight.isNightWork).toBe(true);
  });

  it("marks completed shifts as night work when they included work after 22:00", () => {
    const normalDay = calculateSalarySnapshot(new Date("2026-05-11T18:30:00"), {
      ...config,
      startTime: "09:30",
      endTime: "18:00",
      enableLunchBreak: false,
    });
    const completedNight = calculateSalarySnapshot(new Date("2026-05-12T02:31:00"), {
      ...config,
      workdays: [1],
      startTime: "09:30",
      endTime: "02:30",
      enableLunchBreak: false,
    });

    expect(normalDay.status).toBe("after-work");
    expect(normalDay.isNightWork).toBe(false);
    expect(completedNight.status).toBe("after-work");
    expect(completedNight.isNightWork).toBe(true);
  });
});

describe("createWorkSpans", () => {
  it("returns a single span when lunch is disabled", () => {
    const spans = createWorkSpans(at("10:00"), {
      ...config,
      enableLunchBreak: false,
    });

    expect(spans).toHaveLength(1);
    expect(spans[0][0].getHours()).toBe(9);
    expect(spans[0][1].getHours()).toBe(18);
  });

  it("returns no spans when enabled lunch time is invalid", () => {
    const spans = createWorkSpans(at("10:00"), {
      ...config,
      lunchStart: "08:00",
      lunchEnd: "08:30",
    });

    expect(spans).toHaveLength(0);
  });

  it("returns an overnight span that ends the next day", () => {
    const spans = createWorkSpans(new Date("2026-05-11T23:00:00"), {
      ...config,
      workdays: [1],
      startTime: "22:00",
      endTime: "06:00",
      enableLunchBreak: false,
    });

    expect(spans).toHaveLength(1);
    expect(spans[0][0].getDate()).toBe(11);
    expect(spans[0][0].getHours()).toBe(22);
    expect(spans[0][1].getDate()).toBe(12);
    expect(spans[0][1].getHours()).toBe(6);
  });

  it("returns overnight spans split by an after-midnight lunch break", () => {
    const spans = createWorkSpans(new Date("2026-05-11T23:00:00"), {
      ...config,
      workdays: [1],
      startTime: "22:00",
      endTime: "06:00",
      lunchStart: "01:00",
      lunchEnd: "02:00",
      enableLunchBreak: true,
    });

    expect(spans).toHaveLength(2);
    const secondSpan = spans[1];
    expect(secondSpan).toBeDefined();
    if (!secondSpan) throw new Error("Expected second overnight work span");

    expect(spans[0][0].getHours()).toBe(22);
    expect(spans[0][1].getDate()).toBe(12);
    expect(spans[0][1].getHours()).toBe(1);
    expect(secondSpan[0].getDate()).toBe(12);
    expect(secondSpan[0].getHours()).toBe(2);
    expect(secondSpan[1].getHours()).toBe(6);
  });
});

describe("validateSalaryConfig", () => {
  it("uses the current first-launch defaults", () => {
    expect(defaultSalaryConfig).toMatchObject({
      salaryType: "monthly",
      monthlySalary: 10_000,
      dailySalary: 360,
      hourlyRate: 45,
      workDaysPerMonth: 22,
      enableLunchBreak: false,
    });
  });

  it("accepts the default configuration", () => {
    expect(validateSalaryConfig(defaultSalaryConfig, vt)).toHaveLength(0);
  });

  it("reports invalid monthly salary, work days, and work time", () => {
    const issues = validateSalaryConfig(
      {
        ...config,
        salaryType: "monthly",
        monthlySalary: 0,
        workDaysPerMonth: 0,
        startTime: "18:00",
        endTime: "18:00",
      },
      vt,
    );

    expect(issues.map((issue) => issue.field)).toEqual([
      "monthlySalary",
      "workDaysPerMonth",
      "workTime",
    ]);
  });

  it("accepts overnight work time and lunch inside the overnight shift", () => {
    expect(
      validateSalaryConfig(
        {
          ...config,
          startTime: "22:00",
          endTime: "06:00",
          lunchStart: "01:00",
          lunchEnd: "02:00",
          enableLunchBreak: true,
        },
        vt,
      ),
    ).toHaveLength(0);
  });

  it("reports invalid daily salary only in daily mode", () => {
    expect(
      validateSalaryConfig(
        {
          ...config,
          salaryType: "daily",
          dailySalary: 0,
          monthlySalary: 1000,
        },
        vt,
      ),
    ).toContainEqual({
      field: "dailySalary",
      message: "日薪需大于 0",
    });

    expect(
      validateSalaryConfig(
        {
          ...config,
          salaryType: "monthly",
          dailySalary: 0,
          monthlySalary: 1000,
        },
        vt,
      ),
    ).not.toContainEqual({
      field: "dailySalary",
      message: "日薪需大于 0",
    });
  });

  it("reports invalid hourly salary only in hourly mode", () => {
    expect(
      validateSalaryConfig(
        {
          ...config,
          salaryType: "hourly",
          hourlyRate: 0,
          monthlySalary: 1000,
        },
        vt,
      ),
    ).toContainEqual({
      field: "hourlyRate",
      message: "时薪需大于 0",
    });
  });

  it("reports missing workdays", () => {
    expect(validateSalaryConfig({ ...config, workdays: [] }, vt)).toContainEqual({
      field: "workdays",
      message: "至少选 1 天",
    });
  });

  it("reports lunch break outside work time only when enabled", () => {
    const invalidLunch = {
      ...config,
      lunchStart: "08:00",
      lunchEnd: "08:30",
    };

    expect(validateSalaryConfig(invalidLunch, vt)).toContainEqual({
      field: "workTime",
      message: "午休需在工时内",
    });

    expect(
      validateSalaryConfig({ ...invalidLunch, enableLunchBreak: false }, vt),
    ).toHaveLength(0);
  });

  it("uses concise messages for invalid monthly salary and same work time", () => {
    const issues = validateSalaryConfig(
      {
        ...config,
        salaryType: "monthly",
        monthlySalary: 0,
        workDaysPerMonth: 0,
        startTime: "18:00",
        endTime: "18:00",
      },
      vt,
    );

    expect(issues).toContainEqual({
      field: "monthlySalary",
      message: "月薪需大于 0",
    });
    expect(issues).toContainEqual({
      field: "workDaysPerMonth",
      message: "工作天数需大于 0",
    });
    expect(issues).toContainEqual({
      field: "workTime",
      message: "时间不能相同",
    });
  });

  it("uses a concise overnight lunch message", () => {
    expect(
      validateSalaryConfig(
        {
          ...config,
          startTime: "22:00",
          endTime: "06:00",
          lunchStart: "20:00",
          lunchEnd: "21:00",
          enableLunchBreak: true,
        },
        vt,
      ),
    ).toContainEqual({
      field: "workTime",
      message: "夜班午休需在工时内",
    });
  });
});

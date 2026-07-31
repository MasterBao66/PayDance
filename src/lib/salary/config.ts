// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

export type SalaryType = "monthly" | "daily" | "hourly";

export type SalaryStatus =
  | "invalid-config"
  | "rest-day"
  | "before-work"
  | "working"
  | "lunch-break"
  | "after-work";

export type SalaryConfig = {
  salaryType: SalaryType;
  monthlySalary: number;
  dailySalary: number;
  hourlyRate: number;
  workDaysPerMonth: number;
  workdays: number[];
  startTime: string;
  endTime: string;
  lunchStart: string;
  lunchEnd: string;
  enableLunchBreak: boolean;
};

export type SalarySnapshot = {
  earnedToday: number;
  dailySalary: number;
  hourlyRate: number;
  minuteRate: number;
  secondRate: number;
  progress: number;
  isWorking: boolean;
  status: SalaryStatus;
  workMsToday: number;
  elapsedWorkMs: number;
  nextTransitionMs: number;
  isNightWork: boolean;
};

export type SalaryConfigIssue = {
  field: keyof SalaryConfig | "workTime";
  message: string;
};

export const defaultSalaryConfig: SalaryConfig = {
  salaryType: "monthly",
  monthlySalary: 10000,
  dailySalary: 360,
  hourlyRate: 45,
  workDaysPerMonth: 22,
  workdays: [1, 2, 3, 4, 5],
  startTime: "09:30",
  endTime: "18:30",
  lunchStart: "12:00",
  lunchEnd: "13:30",
  enableLunchBreak: false,
};

export const emptySnapshot: SalarySnapshot = {
  earnedToday: 0,
  dailySalary: 0,
  hourlyRate: 0,
  minuteRate: 0,
  secondRate: 0,
  progress: 0,
  isWorking: false,
  status: "invalid-config",
  workMsToday: 0,
  elapsedWorkMs: 0,
  nextTransitionMs: 0,
  isNightWork: false,
};

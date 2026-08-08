// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import type { SalaryConfig, SalaryConfigIssue, SalaryType } from "./config";
import {
  normalizeBreakEnd,
  normalizeTimeInsideWorkWindow,
  normalizeWorkEnd,
  parseTimeToMinutes,
} from "./time";
import type { Messages } from "../../i18n/types";

const salaryTypes: SalaryType[] = ["monthly", "daily", "hourly"];

const hasPositiveNumber = (value: number) => Number.isFinite(value) && value > 0;

const isValidWorkday = (day: number) => Number.isInteger(day) && day >= 0 && day <= 6;

export function isOvernightWorkConfig(config: SalaryConfig) {
  const start = parseTimeToMinutes(config.startTime);
  const end = parseTimeToMinutes(config.endTime);

  return Number.isFinite(start) && Number.isFinite(end) && end < start;
}

export type ValidateT = (
  key: keyof Messages,
  params?: Record<string, string | number>,
) => string;

export function validateSalaryConfig(
  config: SalaryConfig,
  t: ValidateT,
): SalaryConfigIssue[] {
  const issues: SalaryConfigIssue[] = [];
  const start = parseTimeToMinutes(config.startTime);
  const end = parseTimeToMinutes(config.endTime);
  const salaryType = config.salaryType ?? "monthly";

  if (!salaryTypes.includes(salaryType)) {
    issues.push({ field: "salaryType", message: t("validation.salaryTypeError") });
  }

  if (salaryType === "monthly" && !hasPositiveNumber(config.monthlySalary)) {
    issues.push({ field: "monthlySalary", message: t("validation.monthlyPositive") });
  }

  if (salaryType === "daily" && !hasPositiveNumber(config.dailySalary)) {
    issues.push({ field: "dailySalary", message: t("validation.dailyPositive") });
  }

  if (salaryType === "hourly" && !hasPositiveNumber(config.hourlyRate)) {
    issues.push({ field: "hourlyRate", message: t("validation.hourlyPositive") });
  }

  if (salaryType === "monthly" && !hasPositiveNumber(config.workDaysPerMonth)) {
    issues.push({
      field: "workDaysPerMonth",
      message: t("validation.workDaysPositive"),
    });
  }

  if (!Array.isArray(config.workdays) || config.workdays.length <= 0) {
    issues.push({ field: "workdays", message: t("validation.workdaysMinOne") });
  } else if (!config.workdays.every(isValidWorkday)) {
    issues.push({ field: "workdays", message: t("validation.workdaysError") });
  }

  if (!Number.isFinite(start)) {
    issues.push({ field: "startTime", message: t("validation.startTimeError") });
  }

  if (!Number.isFinite(end)) {
    issues.push({ field: "endTime", message: t("validation.endTimeError") });
  }

  if (Number.isFinite(start) && Number.isFinite(end) && start === end) {
    issues.push({ field: "workTime", message: t("validation.timeSameError") });
  }

  if (!config.enableLunchBreak) {
    return issues;
  }

  const lunchStart = parseTimeToMinutes(config.lunchStart);
  const lunchEnd = parseTimeToMinutes(config.lunchEnd);

  if (!Number.isFinite(lunchStart)) {
    issues.push({ field: "lunchStart", message: t("validation.lunchStartError") });
  }

  if (!Number.isFinite(lunchEnd)) {
    issues.push({ field: "lunchEnd", message: t("validation.lunchEndError") });
  }

  if (
    Number.isFinite(start) &&
    Number.isFinite(end) &&
    start !== end &&
    Number.isFinite(lunchStart) &&
    Number.isFinite(lunchEnd)
  ) {
    const workEnd = normalizeWorkEnd(start, end);
    const normalizedLunchStart = normalizeTimeInsideWorkWindow(lunchStart, start);
    const normalizedLunchEnd = normalizeBreakEnd(normalizedLunchStart, lunchEnd);

    if (!(
      start < normalizedLunchStart &&
      normalizedLunchStart < normalizedLunchEnd &&
      normalizedLunchEnd < workEnd
    )) {
      issues.push({
        field: "workTime",
        message: t(
          end < start ? "validation.nightLunchOutside" : "validation.lunchOutside",
        ),
      });
    }
  }

  return issues;
}

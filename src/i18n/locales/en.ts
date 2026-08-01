// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import type { Messages } from "../types";

const en: Messages = {
  // ── App meta ────────────────────────────────────────────────────────────
  "app.name": "PayDance",
  "app.tagline": "Desktop Real-Time Salary Dashboard",

  // ── Dashboard ───────────────────────────────────────────────────────────
  "dashboard.todayEarnings": "Today's Earnings",
  "dashboard.tapToMini":
    "Today's earnings {amount}. Double-click or press Enter to enter mini floating mode",
  "dashboard.doubleClickMini": "Double-click for mini floating mode",
  "dashboard.statsLabel": "Today's Dashboard",
  "dashboard.salaryInfo": "Salary Info",

  // ── Salary info sheet ──────────────────────────────────────────────────
  "salaryInfo.title": "Salary Info",
  "salaryInfo.close": "Close salary info",
  "salaryInfo.dailyRate": "Daily",
  "salaryInfo.hourlyRate": "Hourly",
  "salaryInfo.minuteRate": "Per Minute",
  "salaryInfo.secondRate": "Per Second",
  "salaryInfo.subtitleSuffix": "Breakdown",

  // ── Status labels ──────────────────────────────────────────────────────
  "status.invalidConfig": "Needs Setup",
  "status.working": "Working",
  "status.nightWork": "Night Shift",
  "status.afterWork": "Off Work",
  "status.nightWorkDone": "Night Done",
  "status.beforeWork": "Not Yet",
  "status.lunchBreak": "Lunch Break",
  "status.restDay": "Day Off",

  // ── Stats panel ────────────────────────────────────────────────────────
  "stats.worked": "Worked",
  "stats.estimated": "Est. Today",
  "stats.untilWork": "Until Work",
  "stats.untilResume": "Until Resume",
  "stats.todayDone": "Done",
  "stats.untilOff": "Until Off",
  "stats.progress": "Today's Progress",

  // ── Settings ────────────────────────────────────────────────────────────
  "settings.title": "Settings",
  "settings.close": "Close settings",
  "settings.salaryMode": "Salary Mode",
  "settings.salary": "Salary",
  "settings.workdays": "Workdays",
  "settings.workTime": "Work Hours",
  "settings.lunchBreak": "Lunch Break",
  "settings.amountAnimation": "Animation",
  "settings.amountAnimationDesc": "Amount display animation",
  "settings.currency": "Currency symbol",
  "settings.startup": "Startup",
  "settings.autostart": "Launch at startup",
  "settings.autostartError": "Failed to update autostart setting",
  "settings.language": "Language",
  "settings.onboarding": "First-time setup",
  "settings.openOnboarding": "Open first-time setup",
  "settings.saveFailed": "Settings could not be saved. Please try again.",

  // ── Settings → salary mode ─────────────────────────────────────────────
  "salaryMode.label": "Salary type",
  "salaryMode.monthly": "Monthly",
  "salaryMode.daily": "Daily",
  "salaryMode.hourly": "Hourly",
  "salaryMode.monthlyLong": "Monthly Salary",
  "salaryMode.dailyLong": "Daily Wage",
  "salaryMode.hourlyLong": "Hourly Rate",

  // ── Settings → salary amounts ──────────────────────────────────────────
  "salaryAmount.workDaysPerMonth": "Work days per month",
  "salaryAmount.unitYuan": "CNY",
  "salaryAmount.unitDays": "days",
  "salaryAmount.monthlySalary": "Monthly Salary",
  "salaryAmount.dailySalary": "Daily Wage",
  "salaryAmount.hourlyRate": "Hourly Rate",

  // ── Settings → work time ───────────────────────────────────────────────
  "workTime.start": "Start",
  "workTime.end": "End",

  // ── Settings → lunch break ─────────────────────────────────────────────
  "lunchBreak.heading": "Lunch Break",
  "lunchBreak.toggle": "Deduct lunch break",
  "lunchBreak.toggleOnboarding": "Deduct lunch break",
  "lunchBreak.start": "Start",
  "lunchBreak.end": "End",

  // ── Settings → workdays ────────────────────────────────────────────────
  "workdays.label": "Workdays",
  "workdays.mon": "Mon",
  "workdays.tue": "Tue",
  "workdays.wed": "Wed",
  "workdays.thu": "Thu",
  "workdays.fri": "Fri",
  "workdays.sat": "Sat",
  "workdays.sun": "Sun",

  // ── Settings → amount mode ─────────────────────────────────────────────
  "amountMode.rolling": "Rolling",
  "amountMode.plain": "Instant",

  // ── Settings → currency symbol ─────────────────────────────────────────
  "currency.placeholder": "e.g. ¥ $ € £",
  "currency.hint": "Leave empty to hide the symbol. Up to 4 characters.",

  // ── Settings → about footer ────────────────────────────────────────────
  "about.appVersion": "Version",
  "about.labelSeparator": ": ",
  "about.appAuthor": "Author",
  "about.openRepo": "Open GitHub repository",
  "about.repoError": "Unable to open GitHub repository. Please try again later.",

  // ── Onboarding ─────────────────────────────────────────────────────────
  "onboarding.ariaLabel": "First-Time Setup",
  "onboarding.stepSalaryMode": "Salary Mode",
  "onboarding.stepWorkTime": "Work Hours",
  "onboarding.stepPreferences": "Preferences",
  "onboarding.back": "Back",
  "onboarding.next": "Next",
  "onboarding.start": "Start",

  // ── Onboarding → preferences ───────────────────────────────────────────
  "preferences.language": "Language",
  "preferences.theme": "Theme",
  "preferences.light": "Light",
  "preferences.dark": "Dark",
  "preferences.autostart": "Launch at startup",
  "preferences.alwaysOnTop": "Always on top",
  "preferences.startInMini": "Start in mini mode",

  // ── Title bar ──────────────────────────────────────────────────────────
  "titlebar.openSettings": "Open settings",
  "titlebar.settings": "Settings",
  "titlebar.toggleMini": "Toggle mini floating mode",
  "titlebar.miniMode": "Mini floating mode",
  "titlebar.switchToLight": "Switch to light mode",
  "titlebar.switchToDark": "Switch to dark mode",
  "titlebar.lightMode": "Light mode",
  "titlebar.darkMode": "Dark mode",
  "titlebar.cancelTop": "Cancel always on top",
  "titlebar.alwaysOnTop": "Always on top",
  "titlebar.cancelTopTitle": "Cancel top",
  "titlebar.alwaysOnTopTitle": "Always on top",
  "titlebar.minimize": "Minimize window",
  "titlebar.minimizeTitle": "Minimize",
  "titlebar.closeToTray": "Close to tray",

  // ── Mini window ────────────────────────────────────────────────────────
  "mini.ariaLabel":
    "Mini floating amount {amount}. Press Enter to restore full window. Right-click for transparency.",
  "mini.restoreTitle": "Double-click to restore",

  // ── Mini opacity ──────────────────────────────────────────────────────
  "opacity.header": "Opacity",
  "opacity.ariaLabel": "Mini floating window opacity",

  // ── Validation ─────────────────────────────────────────────────────────
  "validation.salaryTypeError": "Invalid salary type",
  "validation.monthlyPositive": "Monthly salary must be greater than 0",
  "validation.dailyPositive": "Daily wage must be greater than 0",
  "validation.hourlyPositive": "Hourly rate must be greater than 0",
  "validation.workDaysPositive": "Work days must be greater than 0",
  "validation.workdaysMinOne": "Select at least 1 workday",
  "validation.workdaysError": "Invalid workday selection",
  "validation.startTimeError": "Invalid start time",
  "validation.endTimeError": "Invalid end time",
  "validation.timeSameError": "Start and end times cannot be the same",
  "validation.lunchStartError": "Invalid lunch start time",
  "validation.lunchEndError": "Invalid lunch end time",
  "validation.nightLunchOutside": "Night shift lunch break must fall within work hours",
  "validation.lunchOutside": "Lunch break must fall within work hours",

  // ── Autostart ──────────────────────────────────────────────────────────
  "autostart.error": "Failed to update autostart setting",

  // ── Updater ────────────────────────────────────────────────────────────
  "updater.newVersion": "New version available",
  "updater.downloading": "Downloading…",
  "updater.failed": "Update failed",
  "updater.clickToDownload": "Click to download",
  "updater.retry": "Click to retry",
  "updater.installPrompt": "A new version has been downloaded. Restart now to install?",

  // ── Web Preview ────────────────────────────────────────────────────────
  "web.heroHeadline1": "See Your Pay",
  "web.heroHeadline2": "Tick Up Live",
  "web.heroLead": "A wage board that tracks today’s earnings.",
  "web.downloadWindows": "Download for Windows",
  "web.downloadShort": "Desktop",
  "web.featureRealtime": "Today’s Pay",
  "web.featureRealtimeDesc": "Ticks up as you work",
  "web.featureFocus": "Mini Window",
  "web.featureFocusDesc": "Made for the corner",
  "web.featurePrivacy": "Local Data",
  "web.featurePrivacyDesc": "Saved on this device",
  "web.featureAriaLabel": "Key features",
  "web.topbarAriaLabel": "Product info",
  "web.versionLabel": "Current version",
  "web.actionsAriaLabel": "Actions",
  "web.footerAriaLabel": "Attribution",
  "web.opacityLabel": "Opacity",
  "web.opacityAriaLabel": "Mini floating window opacity",
};

export default en;

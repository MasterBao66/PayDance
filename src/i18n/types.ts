// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

// ---------------------------------------------------------------------------
// PayDance i18n — shared message interface
//
// Every translatable string in the app must have a key in this interface.
// Both zh-CN.ts and en.ts must export a value satisfying this type exactly.
// ---------------------------------------------------------------------------

export interface Messages {
  // ── App meta ────────────────────────────────────────────────────────────
  "app.name": string;
  "app.tagline": string;

  // ── Dashboard ───────────────────────────────────────────────────────────
  "dashboard.todayEarnings": string;
  "dashboard.tapToMini": string;
  "dashboard.doubleClickMini": string;
  "dashboard.statsLabel": string;
  "dashboard.salaryInfo": string;

  // ── Salary info sheet ──────────────────────────────────────────────────
  "salaryInfo.title": string;
  "salaryInfo.close": string;
  "salaryInfo.dailyRate": string;
  "salaryInfo.hourlyRate": string;
  "salaryInfo.minuteRate": string;
  "salaryInfo.secondRate": string;
  "salaryInfo.subtitleSuffix": string;

  // ── Status labels ──────────────────────────────────────────────────────
  "status.invalidConfig": string;
  "status.working": string;
  "status.nightWork": string;
  "status.afterWork": string;
  "status.nightWorkDone": string;
  "status.beforeWork": string;
  "status.lunchBreak": string;
  "status.restDay": string;

  // ── Stats panel ────────────────────────────────────────────────────────
  "stats.worked": string;
  "stats.estimated": string;
  "stats.untilWork": string;
  "stats.untilResume": string;
  "stats.todayDone": string;
  "stats.untilOff": string;
  "stats.progress": string;

  // ── Settings ────────────────────────────────────────────────────────────
  "settings.title": string;
  "settings.close": string;
  "settings.salaryMode": string;
  "settings.salary": string;
  "settings.workdays": string;
  "settings.workTime": string;
  "settings.lunchBreak": string;
  "settings.amountAnimation": string;
  "settings.amountAnimationDesc": string;
  "settings.currency": string;
  "settings.startup": string;
  "settings.autostart": string;
  "settings.autostartError": string;
  "settings.language": string;
  "settings.onboarding": string;
  "settings.openOnboarding": string;
  "settings.saveFailed": string;

  // ── Settings → salary mode ─────────────────────────────────────────────
  "salaryMode.label": string;
  "salaryMode.monthly": string;
  "salaryMode.daily": string;
  "salaryMode.hourly": string;
  "salaryMode.monthlyLong": string;
  "salaryMode.dailyLong": string;
  "salaryMode.hourlyLong": string;

  // ── Settings → salary amounts ──────────────────────────────────────────
  "salaryAmount.workDaysPerMonth": string;
  "salaryAmount.unitYuan": string;
  "salaryAmount.unitDays": string;
  "salaryAmount.monthlySalary": string;
  "salaryAmount.dailySalary": string;
  "salaryAmount.hourlyRate": string;

  // ── Settings → work time ───────────────────────────────────────────────
  "workTime.start": string;
  "workTime.end": string;

  // ── Settings → lunch break ─────────────────────────────────────────────
  "lunchBreak.heading": string;
  "lunchBreak.toggle": string;
  "lunchBreak.toggleOnboarding": string;
  "lunchBreak.start": string;
  "lunchBreak.end": string;

  // ── Settings → workdays ────────────────────────────────────────────────
  "workdays.label": string;
  "workdays.mon": string;
  "workdays.tue": string;
  "workdays.wed": string;
  "workdays.thu": string;
  "workdays.fri": string;
  "workdays.sat": string;
  "workdays.sun": string;

  // ── Settings → amount mode ─────────────────────────────────────────────
  "amountMode.rolling": string;
  "amountMode.plain": string;

  // ── Settings → currency symbol ─────────────────────────────────────────
  "currency.placeholder": string;
  "currency.hint": string;

  // ── Settings → about footer ────────────────────────────────────────────
  "about.appVersion": string;
  "about.labelSeparator": string;
  "about.appAuthor": string;
  "about.openRepo": string;
  "about.repoError": string;

  // ── Onboarding ─────────────────────────────────────────────────────────
  "onboarding.ariaLabel": string;
  "onboarding.stepSalaryMode": string;
  "onboarding.stepWorkTime": string;
  "onboarding.stepPreferences": string;
  "onboarding.back": string;
  "onboarding.next": string;
  "onboarding.start": string;

  // ── Onboarding → preferences ───────────────────────────────────────────
  "preferences.language": string;
  "preferences.theme": string;
  "preferences.light": string;
  "preferences.dark": string;
  "preferences.autostart": string;
  "preferences.alwaysOnTop": string;
  "preferences.startInMini": string;

  // ── Title bar ──────────────────────────────────────────────────────────
  "titlebar.openSettings": string;
  "titlebar.settings": string;
  "titlebar.toggleMini": string;
  "titlebar.miniMode": string;
  "titlebar.switchToLight": string;
  "titlebar.switchToDark": string;
  "titlebar.lightMode": string;
  "titlebar.darkMode": string;
  "titlebar.cancelTop": string;
  "titlebar.alwaysOnTop": string;
  "titlebar.cancelTopTitle": string;
  "titlebar.alwaysOnTopTitle": string;
  "titlebar.minimize": string;
  "titlebar.minimizeTitle": string;
  "titlebar.closeToTray": string;

  // ── Mini window ────────────────────────────────────────────────────────
  "mini.ariaLabel": string;
  "mini.restoreTitle": string;

  // ── Mini opacity ──────────────────────────────────────────────────────
  "opacity.header": string;
  "opacity.ariaLabel": string;

  // ── Validation ─────────────────────────────────────────────────────────
  "validation.salaryTypeError": string;
  "validation.monthlyPositive": string;
  "validation.dailyPositive": string;
  "validation.hourlyPositive": string;
  "validation.workDaysPositive": string;
  "validation.workdaysMinOne": string;
  "validation.workdaysError": string;
  "validation.startTimeError": string;
  "validation.endTimeError": string;
  "validation.timeSameError": string;
  "validation.lunchStartError": string;
  "validation.lunchEndError": string;
  "validation.nightLunchOutside": string;
  "validation.lunchOutside": string;

  // ── Autostart ──────────────────────────────────────────────────────────
  "autostart.error": string;

  // ── Updater ────────────────────────────────────────────────────────────
  "updater.newVersion": string;
  "updater.downloading": string;
  "updater.failed": string;
  "updater.clickToDownload": string;
  "updater.retry": string;
  "updater.installPrompt": string;

  // ── Web Preview ────────────────────────────────────────────────────────
  "web.heroHeadline1": string;
  "web.heroHeadline2": string;
  "web.heroLead": string;
  "web.downloadWindows": string;
  "web.downloadShort": string;
  "web.featureRealtime": string;
  "web.featureRealtimeDesc": string;
  "web.featureFocus": string;
  "web.featureFocusDesc": string;
  "web.featurePrivacy": string;
  "web.featurePrivacyDesc": string;
  "web.featureAriaLabel": string;
  "web.topbarAriaLabel": string;
  "web.versionLabel": string;
  "web.actionsAriaLabel": string;
  "web.footerAriaLabel": string;
  "web.opacityLabel": string;
  "web.opacityAriaLabel": string;
}

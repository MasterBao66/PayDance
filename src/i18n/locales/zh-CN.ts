// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import type { Messages } from "../types";

const zhCN: Messages = {
  // ── App meta ────────────────────────────────────────────────────────────
  "app.name": "薪跳",
  "app.tagline": "桌面实时工资看板",

  // ── Dashboard ───────────────────────────────────────────────────────────
  "dashboard.todayEarnings": "今日入账",
  "dashboard.tapToMini": "今日入账 {amount}，双击或按 Enter 进入迷你悬浮模式",
  "dashboard.doubleClickMini": "双击进入迷你悬浮模式",
  "dashboard.statsLabel": "今日收入看板",
  "dashboard.salaryInfo": "薪资说明",

  // ── Salary info sheet ──────────────────────────────────────────────────
  "salaryInfo.title": "薪资说明",
  "salaryInfo.close": "关闭薪资说明",
  "salaryInfo.dailyRate": "日薪",
  "salaryInfo.hourlyRate": "时薪",
  "salaryInfo.minuteRate": "分薪",
  "salaryInfo.secondRate": "秒薪",
  "salaryInfo.subtitleSuffix": "换算",

  // ── Status labels ──────────────────────────────────────────────────────
  "status.invalidConfig": "配置待修正",
  "status.working": "正在上班",
  "status.nightWork": "正在夜班",
  "status.afterWork": "已下班",
  "status.nightWorkDone": "夜班已完成",
  "status.beforeWork": "未到上班",
  "status.lunchBreak": "午休中",
  "status.restDay": "今日休息",

  // ── Stats panel ────────────────────────────────────────────────────────
  "stats.worked": "已工作",
  "stats.estimated": "今日预计",
  "stats.untilWork": "距离上班",
  "stats.untilResume": "距离复工",
  "stats.todayDone": "今日完成",
  "stats.untilOff": "距离下班",
  "stats.progress": "今日进度",

  // ── Settings ────────────────────────────────────────────────────────────
  "settings.title": "设置",
  "settings.close": "关闭设置",
  "settings.salaryMode": "薪资模式",
  "settings.salary": "薪资",
  "settings.workdays": "每周工作日",
  "settings.workTime": "工作时间",
  "settings.lunchBreak": "午休",
  "settings.amountAnimation": "金额变换",
  "settings.amountAnimationDesc": "金额数字变化方式",
  "settings.currency": "货币符号",
  "settings.startup": "启动",
  "settings.autostart": "开机自动启动",
  "settings.autostartError": "自启动设置失败",
  "settings.language": "语言",
  "settings.onboarding": "首次启动向导",
  "settings.openOnboarding": "打开首次启动向导",
  "settings.saveFailed": "设置未能保存，请重试。",

  // ── Settings → salary mode ─────────────────────────────────────────────
  "salaryMode.label": "薪资输入方式",
  "salaryMode.monthly": "月薪",
  "salaryMode.daily": "日薪",
  "salaryMode.hourly": "时薪",
  "salaryMode.monthlyLong": "月薪模式",
  "salaryMode.dailyLong": "日薪模式",
  "salaryMode.hourlyLong": "时薪模式",

  // ── Settings → salary amounts ──────────────────────────────────────────
  "salaryAmount.workDaysPerMonth": "每月工作天数",
  "salaryAmount.unitYuan": "元",
  "salaryAmount.unitDays": "天",
  "salaryAmount.monthlySalary": "月薪",
  "salaryAmount.dailySalary": "日薪",
  "salaryAmount.hourlyRate": "时薪",

  // ── Settings → work time ───────────────────────────────────────────────
  "workTime.start": "上班",
  "workTime.end": "下班",

  // ── Settings → lunch break ─────────────────────────────────────────────
  "lunchBreak.heading": "午休",
  "lunchBreak.toggle": "剔除午休",
  "lunchBreak.toggleOnboarding": "剔除午休",
  "lunchBreak.start": "开始",
  "lunchBreak.end": "结束",

  // ── Settings → workdays ────────────────────────────────────────────────
  "workdays.label": "每周工作日",
  "workdays.mon": "一",
  "workdays.tue": "二",
  "workdays.wed": "三",
  "workdays.thu": "四",
  "workdays.fri": "五",
  "workdays.sat": "六",
  "workdays.sun": "日",

  // ── Settings → amount mode ─────────────────────────────────────────────
  "amountMode.rolling": "滚动变换",
  "amountMode.plain": "直接变换",

  // ── Settings → currency symbol ─────────────────────────────────────────
  "currency.placeholder": "如 ¥ $ € £",
  "currency.hint": "留空即不显示货币符号，最多 4 个字符",

  // ── Settings → about footer ────────────────────────────────────────────
  "about.appVersion": "版本",
  "about.labelSeparator": "：",
  "about.appAuthor": "作者",
  "about.openRepo": "打开 GitHub 仓库",
  "about.repoError": "无法打开 GitHub 仓库，请稍后重试。",

  // ── Onboarding ─────────────────────────────────────────────────────────
  "onboarding.ariaLabel": "首次配置",
  "onboarding.stepSalaryMode": "薪资模式",
  "onboarding.stepWorkTime": "工作时间",
  "onboarding.stepPreferences": "使用偏好",
  "onboarding.back": "上一步",
  "onboarding.next": "下一步",
  "onboarding.start": "开始",

  // ── Onboarding → preferences ───────────────────────────────────────────
  "preferences.language": "语言",
  "preferences.theme": "主题",
  "preferences.light": "浅色",
  "preferences.dark": "深色",
  "preferences.autostart": "开机自动启动",
  "preferences.alwaysOnTop": "窗口始终置顶",
  "preferences.startInMini": "进入迷你悬浮模式",

  // ── Title bar ──────────────────────────────────────────────────────────
  "titlebar.openSettings": "打开设置",
  "titlebar.settings": "设置",
  "titlebar.toggleMini": "切换迷你悬浮模式",
  "titlebar.miniMode": "迷你悬浮模式",
  "titlebar.switchToLight": "切换到浅色模式",
  "titlebar.switchToDark": "切换到深色模式",
  "titlebar.lightMode": "浅色模式",
  "titlebar.darkMode": "深色模式",
  "titlebar.cancelTop": "取消窗口置顶",
  "titlebar.alwaysOnTop": "窗口置顶",
  "titlebar.cancelTopTitle": "取消置顶",
  "titlebar.alwaysOnTopTitle": "窗口置顶",
  "titlebar.minimize": "最小化窗口",
  "titlebar.minimizeTitle": "最小化",
  "titlebar.closeToTray": "关闭到托盘",

  // ── Mini window ────────────────────────────────────────────────────────
  "mini.ariaLabel": "迷你悬浮金额 {amount}，按 Enter 恢复完整窗口，右键调整透明度",
  "mini.restoreTitle": "双击恢复完整窗口",

  // ── Mini opacity ──────────────────────────────────────────────────────
  "opacity.header": "透明度",
  "opacity.ariaLabel": "迷你悬浮透明度",

  // ── Validation ─────────────────────────────────────────────────────────
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

  // ── Autostart ──────────────────────────────────────────────────────────
  "autostart.error": "自启动设置失败",

  // ── Updater ────────────────────────────────────────────────────────────
  "updater.newVersion": "发现新版本",
  "updater.downloading": "下载中…",
  "updater.failed": "更新失败",
  "updater.clickToDownload": "点击下载",
  "updater.retry": "点击重试",
  "updater.installPrompt": "新版本已下载，是否立即重启安装？",

  // ── Web Preview ────────────────────────────────────────────────────────
  "web.heroHeadline1": "看见每一秒的",
  "web.heroHeadline2": "收入跳动",
  "web.heroLead": "具象化你的劳动价值，专注工作，也看见回报",
  "web.downloadWindows": "下载 Windows 版",
  "web.downloadShort": "下载电脑版",
  "web.featureRealtime": "毫秒级更新",
  "web.featureRealtimeDesc": "今日收入实时跳动",
  "web.featureFocus": "安心专注",
  "web.featureFocusDesc": "轻量窗口，静默运行",
  "web.featurePrivacy": "隐私优先",
  "web.featurePrivacyDesc": "所有数据本地处理",
  "web.featureAriaLabel": "产品核心优势",
  "web.topbarAriaLabel": "产品信息",
  "web.versionLabel": "当前版本",
  "web.actionsAriaLabel": "网页端操作",
  "web.footerAriaLabel": "作者归属",
  "web.opacityLabel": "透明度",
  "web.opacityAriaLabel": "迷你悬浮透明度",
};

export default zhCN;

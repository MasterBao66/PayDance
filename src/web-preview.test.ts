// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { readFileSync, statSync } from "node:fs";
import { describe, expect, it } from "vitest";
import appSource from "./App.vue?raw";
import webPreviewAppSource from "./WebPreviewApp.vue?raw";
import webPreviewFeatureStripSource from "./web-preview/WebPreviewFeatureStrip.vue?raw";
import gitHubMarkSource from "./web-preview/components/GitHubMark.vue?raw";
import languageSwitcherSource from "./web-preview/components/LanguageSwitcher.vue?raw";
import webMiniOpacityPanelSource from "./web-preview/components/WebMiniOpacityPanel.vue?raw";
import webPreviewActionsSource from "./web-preview/components/WebPreviewActions.vue?raw";
import webPreviewFooterSource from "./web-preview/components/WebPreviewFooter.vue?raw";
import webPreviewHeroCopySource from "./web-preview/components/WebPreviewHeroCopy.vue?raw";
import webPreviewMiniLayerSource from "./web-preview/components/WebPreviewMiniLayer.vue?raw";
import webPreviewPageSource from "./web-preview/components/WebPreviewPage.vue?raw";
import webPreviewShowcaseSource from "./web-preview/components/WebPreviewShowcase.vue?raw";
import webPreviewTopbarSource from "./web-preview/components/WebPreviewTopbar.vue?raw";
import windows11MarkSource from "./web-preview/components/Windows11Mark.vue?raw";
import webPreviewStateSource from "./web-preview/useWebPreviewState.ts?raw";
import enLocaleSource from "./i18n/locales/en.ts?raw";
import zhLocaleSource from "./i18n/locales/zh-CN.ts?raw";
import runtimeSource from "./platform/runtime.ts?raw";
import appMetaSource from "./lib/app-meta.ts?raw";

const read = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const countLiteralOccurrences = (source: string, value: string) =>
  source.split(value).length - 1;
const pngSize = (path: string) => {
  const source = readFileSync(new URL(`../${path}`, import.meta.url));
  const pngSignature = "89504e470d0a1a0a";

  expect(source.subarray(0, 8).toString("hex")).toBe(pngSignature);

  return {
    width: source.readUInt32BE(16),
    height: source.readUInt32BE(20),
  };
};
const appStyles = read("src/style.css");
const webPreviewStyles = [
  read("src/web-preview/web-preview.css"),
  read("src/web-preview/styles/foundation.css"),
  read("src/web-preview/styles/hero.css"),
  read("src/web-preview/styles/showcase.css"),
  read("src/web-preview/styles/responsive.css"),
].join("\n");
const cssBlockFrom = (source: string, selector: string) =>
  source.match(
    new RegExp(`${selector.split(".").join("\\.")} \\{[\\s\\S]*?\\n\\}`),
  )?.[0] ?? "";
const webPreviewSource = [
  webPreviewAppSource,
  webPreviewPageSource,
  webPreviewTopbarSource,
  languageSwitcherSource,
  webPreviewHeroCopySource,
  webPreviewActionsSource,
  webPreviewShowcaseSource,
  webPreviewMiniLayerSource,
  webMiniOpacityPanelSource,
  webPreviewFooterSource,
  windows11MarkSource,
  gitHubMarkSource,
  webPreviewStyles,
  appMetaSource,
].join("\n");
const cssBlock = (selector: string) => cssBlockFrom(webPreviewStyles, selector);
const featureCssBlock = (selector: string) =>
  cssBlockFrom(webPreviewFeatureStripSource, selector);

describe("PayDance Web Preview", () => {
  it("loads exactly one runtime app at build time", () => {
    expect(runtimeSource).toContain('import.meta.env.MODE === "web"');
    expect(appSource).toContain('from "#runtime-app"');
    expect(appSource).not.toContain('import("./WebPreviewApp.vue")');
    expect(appSource).not.toContain('import("./DesktopApp.vue")');
    expect(read("vite.config.ts")).toContain("#runtime-app");
  });

  it("keeps browser preview storage local and separate from Tauri Store", () => {
    const webSettingsStore = read("src/platform/settings-store.web.ts");
    const desktopSettingsStore = read("src/platform/settings-store.ts");

    expect(webSettingsStore).toContain("createBrowserSettingsStore");
    expect(webSettingsStore).toContain("readBrowserThemeMode");
    expect(webSettingsStore).toContain("window.localStorage");
    expect(webSettingsStore).toContain("paydance-web-preview-settings");
    expect(desktopSettingsStore).toContain('import("@tauri-apps/plugin-store")');
  });

  it("hydrates the saved web theme before enabling visual transitions", () => {
    expect(webPreviewPageSource).toContain("readBrowserThemeMode");
    expect(webPreviewStateSource).toContain("readBrowserThemeMode");
    expect(webPreviewPageSource).toContain("is-theme-booting");
    expect(webPreviewPageSource).toContain("@theme-ready");
    expect(webPreviewShowcaseSource).toContain("themeReady");
    expect(webPreviewShowcaseSource).toContain("isSettingsReady");
    expect(webPreviewStyles).toContain(".web-preview.is-theme-booting");
    expect(webPreviewStyles).toContain("transition: none !important");
  });

  it("presents web preview as a bounded online experience", () => {
    expect(webPreviewSource).toContain("PayDance Web Preview");
    expect(webPreviewSource).toContain('class="web-preview__headline-main"');
    expect(webPreviewSource).toContain('t("web.heroHeadline1")');
    expect(webPreviewSource).toContain('t("web.heroHeadline2")');
    expect(webPreviewSource).toContain('t("web.heroLead")');
    expect(webPreviewSource).toContain('t("web.downloadWindows")');
    expect(webPreviewSource).toContain("pay-dance-v${appVersion}-windows-x64.exe");
    expect(webPreviewSource).toContain(':show-desktop-features="false"');
    expect(webPreviewSource).not.toContain("Web Preview 只用于预览核心体验");
    expect(webPreviewSource).not.toContain("@tauri-apps");
  });

  it("brands the web storefront with the setup poster and current version", () => {
    const favicon = statSync(new URL("../public/favicon.png", import.meta.url));
    const sharePoster = statSync(
      new URL("../docs/posters/poster-02-three-step-setup-v3.png", import.meta.url),
    );
    const chineseHtmlSource = read("index.html");
    const englishHtmlSource = read("en/index.html");
    const sharePosterUrl =
      "https://raw.githubusercontent.com/MrBaoboer/PayDance/main/docs/posters/poster-02-three-step-setup-v3.png";

    expect(webPreviewSource).toContain("productLogoUrl");
    expect(webPreviewSource).toContain("appVersion");
    expect(chineseHtmlSource).toContain('rel="icon"');
    expect(chineseHtmlSource).toContain("%BASE_URL%favicon.png");
    expect(englishHtmlSource).toContain("%BASE_URL%favicon.png");
    expect(favicon.size).toBeGreaterThan(1_000);
    expect(sharePoster.size).toBeGreaterThan(20_000);
    expect(pngSize("docs/posters/poster-02-three-step-setup-v3.png")).toEqual({
      width: 1448,
      height: 1086,
    });
    expect(countLiteralOccurrences(chineseHtmlSource, sharePosterUrl)).toBe(2);
    expect(countLiteralOccurrences(englishHtmlSource, sharePosterUrl)).toBe(2);
    expect(chineseHtmlSource).toContain(
      '<meta property="og:image:width" content="1448" />',
    );
    expect(chineseHtmlSource).toContain(
      '<meta property="og:image:height" content="1086" />',
    );
    expect(chineseHtmlSource).toContain("薪跳 PayDance 三步设置界面");
    expect(englishHtmlSource).toContain("PayDance three-step setup");
    expect(chineseHtmlSource).toContain(
      "<title>薪跳 PayDance — Windows 桌面实时工资看板</title>",
    );
    expect(englishHtmlSource).toContain(
      "<title>PayDance — Real-Time Salary Dashboard for Windows</title>",
    );
    expect(chineseHtmlSource).toContain('"applicationCategory": "UtilitiesApplication"');
    expect(englishHtmlSource).toContain('"applicationCategory": "UtilitiesApplication"');
    expect(webPreviewSource).toContain('class="web-preview__brand"');
    expect(webPreviewSource).toContain('class="web-preview__brand-logo"');
    expect(webPreviewSource).not.toContain("web-preview__brand-icon");
    expect(webPreviewSource).toContain('class="web-preview__version"');
    expect(webPreviewSource).toContain('class="web-preview__status"');
    expect(webPreviewSource).toContain("Web Preview");
    expect(webPreviewSource).toContain('class="web-preview__version-dot"');
    expect(webPreviewSource).toContain("--brand-logo-size: 52px");
    expect(webPreviewSource).toContain("--brand-name-size: 24px");
    expect(webPreviewSource).not.toContain(".web-preview__brand-icon");
    expect(webPreviewSource).not.toContain("clip-path: inset(7% round 15px)");
    expect(webPreviewSource).not.toContain("transform: scale(1.24)");
    expect(webPreviewSource).not.toContain("<strong>v{{ appVersion }}</strong>");
    expect(webPreviewSource).toContain("<strong>{{ appVersion }}</strong>");
    expect(cssBlock(".web-preview__version")).not.toContain("border-radius: 999px");
    expect(cssBlock(".web-preview__version")).not.toContain("background:");
    expect(cssBlock(".web-preview__version")).not.toContain("box-shadow:");
    expect(cssBlock(".web-preview__topbar-right")).toContain("gap: 22px");
    expect(cssBlock(".web-preview__status")).toContain("gap: 8px");
  });

  it("publishes independent Chinese and English SEO entry points", () => {
    const chineseHtmlSource = read("index.html");
    const englishHtmlSource = read("en/index.html");
    const chineseUrl = "https://paydance.vercel.app/";
    const englishUrl = "https://paydance.vercel.app/en/";

    expect(chineseHtmlSource).toContain('<html lang="zh-CN">');
    expect(englishHtmlSource).toContain('<html lang="en">');
    expect(chineseHtmlSource).toContain(`<link rel="canonical" href="${chineseUrl}" />`);
    expect(englishHtmlSource).toContain(`<link rel="canonical" href="${englishUrl}" />`);

    for (const htmlSource of [chineseHtmlSource, englishHtmlSource]) {
      const compactHtml = htmlSource.replace(/\s+/g, " ");

      expect(compactHtml).toContain(
        `<link rel="alternate" hreflang="zh-CN" href="${chineseUrl}" />`,
      );
      expect(compactHtml).toContain(
        `<link rel="alternate" hreflang="en" href="${englishUrl}" />`,
      );
      expect(compactHtml).toContain(
        `<link rel="alternate" hreflang="x-default" href="${chineseUrl}" />`,
      );
      expect(htmlSource).toContain('"softwareVersion": "__PAYDANCE_VERSION__"');
      expect(htmlSource).toContain('"dateModified": "__PAYDANCE_DATE_MODIFIED__"');
    }

    expect(chineseHtmlSource).toContain(
      `<meta property="og:url" content="${chineseUrl}" />`,
    );
    expect(englishHtmlSource).toContain(
      `<meta property="og:url" content="${englishUrl}" />`,
    );
    expect(chineseHtmlSource).toContain('"inLanguage": "zh-CN"');
    expect(englishHtmlSource).toContain('"inLanguage": "en"');
    expect(chineseHtmlSource).not.toContain(
      "PayDance — Real-Time Salary Dashboard for Windows",
    );
    expect(englishHtmlSource).not.toContain("薪跳 PayDance — Windows 桌面实时工资看板");
  });

  it("keeps the brand logo on the product homepage", () => {
    expect(webPreviewPageSource).toContain(
      "const productHomepageUrl = computed(() => localeUrl(locale.value, baseUrl))",
    );
    expect(webPreviewPageSource).toContain(':product-homepage-url="productHomepageUrl"');
    expect(webPreviewTopbarSource).toContain(':href="productHomepageUrl"');
    expect(webPreviewTopbarSource).not.toContain(':href="repositoryUrl"');
  });

  it("uses a segmented language switcher instead of a tiny single-label button", () => {
    expect(webPreviewPageSource).toContain("const { locale } = provideI18n");
    expect(webPreviewPageSource).toContain(':data-locale="locale"');
    expect(webPreviewPageSource).toContain(
      "document.documentElement.lang = locale.value",
    );
    expect(webPreviewPageSource).toContain("resolveWebLocale");
    expect(webPreviewTopbarSource).toContain("<LanguageSwitcher />");
    expect(languageSwitcherSource).toContain("<a");
    expect(languageSwitcherSource).toContain(':href="alternateLocaleUrl"');
    expect(languageSwitcherSource).toContain("localeUrl");
    expect(webPreviewSource).toContain('class="lang-switcher__track"');
    expect(webPreviewSource).toContain('class="lang-switcher__option"');
    expect(webPreviewSource).toContain("'is-active': locale === 'zh-CN'");
    expect(webPreviewSource).toContain("'is-active': locale === 'en'");
    expect(webPreviewSource).not.toContain('{{ locale === "zh-CN" ? "EN" : "中" }}');
    expect(languageSwitcherSource).toContain(
      ":global(.theme-dark.web-preview .lang-switcher__track)",
    );
    expect(languageSwitcherSource).toContain(
      "background: color-mix(in srgb, var(--income-accent) 18%, rgb(18 18 20))",
    );
    expect(languageSwitcherSource).toContain("color: rgb(255 214 154)");
    expect(languageSwitcherSource).not.toContain(
      ":global(.theme-dark.web-preview) .lang-switcher",
    );
  });

  it("uses a more expressive web typography system", () => {
    expect(webPreviewSource).not.toContain("fonts.googleapis.com");
    expect(webPreviewSource).not.toContain("@fontsource");
    expect(webPreviewSource).toContain('font-family: "PayDance Web Sans"');
    expect(webPreviewSource).toContain('font-family: "PayDance Web Serif"');
    expect(webPreviewSource).toContain("paydance-web-sans-subset.woff2");
    expect(webPreviewSource).toContain("paydance-web-serif-subset.woff2");
    expect(webPreviewSource).toContain("--web-font-display");
    expect(webPreviewSource).toContain("--web-font-ui");
    expect(webPreviewSource).toContain("--web-font-action");
    expect(webPreviewSource).toContain("PayDance Web Sans");
    expect(webPreviewSource).toContain("PayDance Web Serif");
    expect(webPreviewSource).toContain(".web-preview__copy");
    expect(webPreviewSource).toContain("font-family: var(--web-font-ui)");
    expect(cssBlock(".web-preview")).not.toContain("font-family:");
  });

  it("keeps bundled Chinese web fonts subsetted for the actual storefront copy", () => {
    const sansFont = statSync(
      new URL("./assets/fonts/paydance-web-sans-subset.woff2", import.meta.url),
    );
    const serifFont = statSync(
      new URL("./assets/fonts/paydance-web-serif-subset.woff2", import.meta.url),
    );

    expect(sansFont.size).toBeLessThan(80_000);
    expect(serifFont.size).toBeLessThan(105_000);
  });

  it("keeps the web headline as two designed lines instead of narrow vertical wrapping", () => {
    expect(webPreviewSource).toContain(
      "width: min(100%, calc(var(--headline-accent-size) * 5.2))",
    );
    expect(webPreviewSource).toContain("--headline-accent-size");
    expect(webPreviewSource).toContain("font-size: var(--headline-accent-size)");
    expect(webPreviewSource).not.toContain(
      "font-size: calc(var(--headline-main-size) * 1.5)",
    );
    expect(webPreviewSource).toContain("white-space: nowrap");
    expect(webPreviewSource).not.toContain("max-width: 7.6em");
  });

  it("adds medium viewport layout rules so copy never collides with the preview", () => {
    expect(webPreviewSource).toContain('.web-preview[data-locale="en"]');
    expect(webPreviewSource).toContain(
      '.web-preview[data-locale="en"] .web-preview__headline-main',
    );
    expect(webPreviewSource).toContain(
      '.web-preview[data-locale="en"] .web-preview__headline-accent',
    );
    expect(webPreviewSource).toContain(
      '.web-preview[data-locale="en"] .web-preview__lead',
    );
    expect(webPreviewStyles).toContain(
      "--headline-accent-size: clamp(46px, 3.85vw, 62px)",
    );
    expect(webPreviewSource).toContain("overflow-wrap: normal");
    expect(webPreviewSource).toContain("@media (max-width: 1180px)");
    expect(webPreviewStyles).toContain("grid-template-columns: 1fr");
    expect(webPreviewSource).not.toContain(
      '@media (max-width: 1180px) {\n  .web-preview[data-locale="en"] .web-preview__hero',
    );
  });

  it("uses short, story-led English storefront copy without overexplaining the product", () => {
    expect(enLocaleSource).toContain('"web.heroHeadline1": "See Your Pay"');
    expect(enLocaleSource).toContain('"web.heroHeadline2": "Tick Up Live"');
    expect(enLocaleSource).toContain(
      '"web.heroLead": "A wage board that tracks today’s earnings."',
    );
    expect(enLocaleSource).toContain('"web.downloadShort": "Desktop"');
    expect(enLocaleSource).toContain('"web.featureRealtime": "Today’s Pay"');
    expect(enLocaleSource).toContain('"web.featureRealtimeDesc": "Ticks up as you work"');
    expect(enLocaleSource).toContain('"web.featureFocus": "Mini Window"');
    expect(enLocaleSource).toContain('"web.featureFocusDesc": "Made for the corner"');
    expect(enLocaleSource).toContain('"web.featurePrivacy": "Local Data"');
    expect(enLocaleSource).toContain('"web.featurePrivacyDesc": "Saved on this device"');
  });

  it("keeps the Chinese storefront copy concise and anchored to the live wage story", () => {
    const htmlSource = read("index.html");

    expect(zhLocaleSource).toContain(
      '"web.heroLead": "具象化你的劳动价值，专注工作，也看见回报"',
    );
    expect(zhLocaleSource).toContain('"web.downloadShort": "下载电脑版"');
    expect(zhLocaleSource).toContain('"web.featureRealtime": "毫秒级更新"');
    expect(zhLocaleSource).toContain('"web.featureRealtimeDesc": "今日收入实时跳动"');
    expect(zhLocaleSource).toContain('"web.featureFocus": "安心专注"');
    expect(zhLocaleSource).toContain('"web.featureFocusDesc": "轻量窗口，静默运行"');
    expect(zhLocaleSource).toContain('"web.featurePrivacy": "隐私优先"');
    expect(zhLocaleSource).toContain('"web.featurePrivacyDesc": "所有数据本地处理"');
    expect(htmlSource).toContain("具象化你的劳动价值，专注工作，也看见回报");
  });

  it("keeps the web hero roomy while preserving the software preview on narrower windows", () => {
    expect(cssBlock(".web-preview")).toContain("--web-max-width: 1280px");
    expect(cssBlock(".web-preview__topbar")).toContain(
      "width: min(100%, var(--web-max-width))",
    );
    expect(cssBlock(".web-preview__hero")).toContain(
      "grid-template-columns: minmax(420px, 500px) minmax(430px, 500px)",
    );
    expect(cssBlock(".web-preview__hero")).toContain(
      "column-gap: clamp(54px, 6vw, 96px)",
    );
    expect(cssBlock(".web-preview__copy")).toContain("gap: clamp(18px, 2.1vw, 28px)");
    expect(webPreviewSource).toContain("@media (max-width: 1120px)");
    expect(webPreviewSource).toContain(
      "grid-template-columns: minmax(330px, 0.9fr) minmax(390px, 460px)",
    );
    expect(webPreviewSource).toContain("@media (max-width: 1180px)");
    expect(webPreviewStyles).toContain("grid-template-columns: 1fr");
    expect(webPreviewSource).toContain("gap: clamp(34px, 5.6vw, 54px)");
    expect(webPreviewStyles).toContain("justify-items: center");
    expect(webPreviewSource).toContain("@media (max-width: 820px)");
  });

  it("uses document-level scrolling for medium and mobile storefront layouts", () => {
    expect(webPreviewPageSource).toContain("is-web-preview-page");
    expect(webPreviewPageSource).toContain("document.documentElement.classList.toggle");
    expect(webPreviewPageSource).toContain("document.body.classList.toggle");
    expect(webPreviewPageSource).toContain("onMounted");
    expect(webPreviewPageSource).toContain("onBeforeUnmount");
    expect(appStyles).toContain("html.is-web-preview-page");
    expect(appStyles).toContain("body.is-web-preview-page");
    expect(appStyles).toContain("html.is-web-preview-page #app");
    expect(appStyles).toContain("overflow-y: auto");
    expect(cssBlock(".web-preview")).toContain("height: auto");
    expect(cssBlock(".web-preview")).toContain("min-height: 100dvh");
    expect(cssBlock(".web-preview")).toContain("overflow-x: clip");
    expect(cssBlock(".web-preview")).toContain("overflow-y: visible");
    expect(cssBlock(".web-preview")).not.toContain("\n  height: 100dvh");
    expect(cssBlock(".web-preview")).not.toContain("overflow-y: auto");
  });

  it("uses the approved single-line lead without changing the hero structure", () => {
    expect(webPreviewSource).toContain('t("web.heroLead")');
    expect(webPreviewSource).not.toContain('class="web-preview__lead-line"');
    expect(webPreviewSource).not.toContain(
      ["<span>把今天", "已经挣到的钱</span>"].join(""),
    );
    expect(cssBlock(".web-preview__lead")).toContain(
      "margin: clamp(10px, 1.05vw, 16px) 0 0",
    );
    expect(cssBlock(".web-preview__lead")).toContain("display: block");
    expect(cssBlock(".web-preview__lead")).not.toContain("gap:");
    expect(webPreviewSource).toContain("max-width: 318px");
    expect(webPreviewSource).toContain("font-size: clamp(14px, 3.65vw, 15.5px)");
    expect(webPreviewSource).toContain("font-weight: 500");
    expect(webPreviewSource).toContain("line-height: 1.62");
  });

  it("keeps mobile actions and the software preview inside the viewport", () => {
    expect(webPreviewSource).toContain("width: min(100%, 390px)");
    expect(webPreviewSource).toContain("max-width: 358px");
    expect(webPreviewSource).toContain("web-preview__action-label-full");
    expect(webPreviewSource).toContain("web-preview__action-label-short");
    expect(webPreviewSource).toContain('t("web.downloadShort")');
    expect(webPreviewSource).not.toContain(">Download<");
    expect(webPreviewSource).toContain(".web-preview__actions");
    expect(webPreviewSource).toContain("flex-wrap: nowrap");
    expect(webPreviewSource).toContain(".web-preview__action-label-full");
    expect(webPreviewSource).toContain(".web-preview__action-label-short");
    expect(webPreviewSource).toContain("flex: 1 1 auto");
    expect(webPreviewSource).toContain("height: clamp(326px, 86vw, 348px)");
    expect(webPreviewSource).toContain(".web-preview__frame .app-window");
    expect(webPreviewSource).toContain("--hero-dashboard-gap: clamp(12px, 3.8cqh, 18px)");
    expect(webPreviewSource).toContain("--salary-info-offset: clamp(14px, 4cqh, 18px)");
    expect(webPreviewSource).toContain(".web-preview__frame .hero-panel");
    expect(webPreviewSource).toContain("justify-content: flex-start");
    expect(webPreviewSource).toContain(
      ".web-preview__frame .hero-panel .salary-info-button",
    );
    expect(webPreviewSource).toContain("height: clamp(24px, 5.4cqh, 28px)");
    expect(webPreviewSource).not.toContain("x: -");
  });

  it("separates the dark web background from the software preview with quiet material layers", () => {
    expect(webPreviewSource).not.toContain("repeating-linear-gradient");
    expect(webPreviewSource).not.toContain("border: 1px dashed");
    expect(cssBlock(".web-preview")).toContain("--web-frame-lift");
    expect(cssBlock(".web-preview")).toContain("--web-page-sheen");
    expect(cssBlock(".web-preview")).toContain("--web-stage-aura");
    expect(cssBlock(".web-preview")).toContain("--web-stage-reflection");
    expect(cssBlock(".web-preview")).toContain("--web-stage-surface");
    expect(cssBlock(".theme-dark.web-preview")).toContain(
      "--web-stage-aura: rgb(245 158 11 / 0.064)",
    );
    expect(cssBlock(".theme-dark.web-preview")).toContain(
      "--web-stage-ring: rgb(255 255 255 / 0.105)",
    );
    expect(cssBlock(".web-preview__hero::before")).toContain("mask-image");
    expect(cssBlock(".web-preview__hero::before")).toContain("var(--web-stage-surface)");
    expect(cssBlock(".web-preview__showcase::after")).toContain(
      "var(--web-stage-surface)",
    );
    expect(featureCssBlock(".web-preview__feature-strip")).toContain("z-index: 2");
    expect(cssBlock(".theme-dark.web-preview .web-preview__frame")).toContain(
      "var(--web-shadow)",
    );
  });

  it("keeps storefront actions stable and recognizable on hover", () => {
    expect(webPreviewSource).not.toContain("ExternalLink");
    expect(webPreviewSource).toContain("github-mark");
    expect(webPreviewSource).toContain('t("web.downloadShort")');
    expect(webPreviewSource).toContain("Windows11Mark");
    expect(webPreviewSource).toContain('class="web-preview__action-label"');
    expect(cssBlock(".web-preview__action-label")).toContain(
      "transform: translateY(-0.75px)",
    );
    expect(cssBlock(".web-preview__action--quiet")).toContain("gap: 3px");
    expect(cssBlock(".web-preview__action")).toContain(
      "transition: box-shadow 160ms ease",
    );
    expect(cssBlock(".web-preview__action")).toContain("align-items: center");
    expect(cssBlock(".web-preview__action")).toContain("line-height: 1");
    expect(cssBlock(".web-preview__action")).toContain("vertical-align: middle");
    expect(cssBlock(".windows11-mark")).toContain("display: block");
    expect(cssBlock(".github-mark")).toContain("display: block");
    expect(webPreviewSource).toContain(".web-preview__action svg");
    expect(cssBlock(".web-preview__action")).not.toContain("background-color 180ms ease");
    expect(webPreviewSource).toContain(".web-preview__action--primary:hover");
    expect(webPreviewSource).toContain(".web-preview__action--quiet:hover");
  });

  it("uses compact feature tags with short descriptions", () => {
    expect(webPreviewSource).toContain("<WebPreviewFeatureStrip />");
    expect(webPreviewFeatureStripSource).toContain('class="web-preview__feature-strip"');
    expect(webPreviewFeatureStripSource).toContain('class="web-preview__chips"');
    expect(webPreviewFeatureStripSource).toContain('class="web-preview__chip"');
    expect(webPreviewFeatureStripSource).toContain("Zap");
    expect(webPreviewFeatureStripSource).toContain("Focus");
    expect(webPreviewFeatureStripSource).toContain("ShieldCheck");
    expect(webPreviewFeatureStripSource).toContain('t("web.featureRealtime")');
    expect(webPreviewFeatureStripSource).toContain('t("web.featureRealtimeDesc")');
    expect(webPreviewFeatureStripSource).toContain('t("web.featureFocus")');
    expect(webPreviewFeatureStripSource).toContain('t("web.featureFocusDesc")');
    expect(webPreviewFeatureStripSource).toContain('t("web.featurePrivacy")');
    expect(webPreviewFeatureStripSource).toContain('t("web.featurePrivacyDesc")');
    expect(webPreviewFeatureStripSource).toContain('class="web-preview__chip-icon"');
    expect(webPreviewFeatureStripSource).toContain('class="web-preview__chip-copy"');
    expect(webPreviewFeatureStripSource).toContain(
      ":global(.theme-dark.web-preview .web-preview__chip-icon)",
    );
    expect(webPreviewFeatureStripSource).not.toContain(
      ":global(.theme-dark.web-preview) .web-preview__chip-icon",
    );
    expect(featureCssBlock(".web-preview__chip-copy")).toContain("white-space: nowrap");
    expect(webPreviewFeatureStripSource.indexOf('t("web.featureRealtime")')).toBeLessThan(
      webPreviewFeatureStripSource.indexOf('t("web.featureFocus")'),
    );
    expect(webPreviewFeatureStripSource.indexOf('t("web.featureFocus")')).toBeLessThan(
      webPreviewFeatureStripSource.indexOf('t("web.featurePrivacy")'),
    );
    expect(featureCssBlock(".web-preview__feature-strip")).toContain(
      "grid-column: 1 / -1",
    );
    expect(featureCssBlock(".web-preview__chip")).toContain("grid-template-columns");
    expect(featureCssBlock(".web-preview__chip")).toContain("text-align: left");
    expect(featureCssBlock(".web-preview__chip")).not.toContain("border:");
    expect(featureCssBlock(".web-preview__chip")).not.toContain("background:");
  });

  it("keeps feature tags compact on desktop and readable on mobile", () => {
    const featureStripBlock = featureCssBlock(".web-preview__feature-strip");
    const chipsBlock = featureCssBlock(".web-preview__chips");
    const chipBlock = featureCssBlock(".web-preview__chip");

    expect(featureStripBlock).toContain("width: 100%");
    expect(chipsBlock).toContain("grid-template-columns: repeat(");
    expect(chipsBlock).toContain(
      "calc(var(--web-chip-base-width) * var(--web-chip-scale))",
    );
    expect(chipsBlock).toContain("--web-chip-scale");
    expect(chipsBlock).not.toContain("flex-wrap");
    expect(chipBlock).toContain(
      "width: calc(var(--web-chip-base-width) * var(--web-chip-scale))",
    );
    expect(chipBlock).toContain("align-items: center");
    expect(featureCssBlock(".web-preview__chips dd")).toContain("white-space: nowrap");
    expect(webPreviewFeatureStripSource).toContain("@media (max-width: 560px)");
    expect(webPreviewFeatureStripSource).toContain("margin-bottom: 24px");
    expect(webPreviewFeatureStripSource).toContain("padding-bottom: 4px");
    expect(webPreviewFeatureStripSource).toContain(
      "grid-template-columns: repeat(3, minmax(0, 1fr))",
    );
    expect(webPreviewFeatureStripSource).toContain("justify-items: center");
    expect(webPreviewFeatureStripSource).toContain("text-align: center");
    expect(webPreviewFeatureStripSource).toContain("display: none");
    expect(webPreviewFeatureStripSource).toContain("@media (max-width: 1180px)");
    expect(webPreviewFeatureStripSource).toContain("--web-chip-base-width: 272px");
    expect(webPreviewFeatureStripSource).toContain("max-width: 920px");
    expect(webPreviewFeatureStripSource).toContain(".web-preview__chips dd");
    expect(webPreviewFeatureStripSource).toContain("max-width: none");
    expect(webPreviewFeatureStripSource).toContain("white-space: nowrap");
    expect(webPreviewFeatureStripSource).not.toContain(
      ':global(.web-preview[data-locale="en"])',
    );
  });

  it("keeps web preview state isolated from the storefront layout component", () => {
    const webPreviewLineCount = webPreviewAppSource.split("\n").length;

    expect(webPreviewAppSource).not.toContain("useWebPreviewState");
    expect(webPreviewAppSource).not.toContain("createBrowserSettingsStore");
    expect(webPreviewAppSource).not.toContain("useDashboardModel");
    expect(webPreviewStateSource).toContain("createBrowserSettingsStore");
    expect(webPreviewStateSource).toContain("useDashboardModel");
    expect(webPreviewSource).toContain("WebPreviewTopbar");
    expect(webPreviewSource).toContain("WebPreviewHeroCopy");
    expect(webPreviewSource).toContain("WebPreviewShowcase");
    expect(webPreviewSource).toContain("WebPreviewFooter");
    expect(webPreviewLineCount).toBeLessThanOrEqual(220);
  });

  it("always opens the browser preview in the full dashboard view", () => {
    expect(webPreviewStateSource).toContain("isMiniMode.value = false");
    expect(webPreviewStateSource).not.toContain(
      "isMiniMode.value = windowPreferences.isMiniMode",
    );
  });

  it("starts with a seven-day demo dashboard and keeps onboarding available", () => {
    const demoConfigSource = read("src/web-preview/demo-config.ts");

    expect(demoConfigSource).toContain("ensureWebPreviewDemoSettings");
    expect(demoConfigSource).toContain("workdays: [0, 1, 2, 3, 4, 5, 6]");
    expect(demoConfigSource).toContain("settingsStoreKeys.hasCompletedOnboarding");
    expect(webPreviewStateSource).toContain(
      "await ensureWebPreviewDemoSettings(previewStore)",
    );
    expect(webPreviewStateSource).toContain("openOnboarding");
    expect(webPreviewStateSource).toContain("completeWebOnboarding");
    expect(webPreviewShowcaseSource).toContain(':show-onboarding-action="true"');
    expect(webPreviewShowcaseSource).toContain('@open-onboarding="openOnboarding"');
    expect(webPreviewShowcaseSource).toContain(
      '@complete-onboarding="completeWebOnboarding"',
    );
  });

  it("keeps Tauri modules out of the browser platform adapters", () => {
    const viteConfig = read("vite.config.ts");
    const webSettingsStore = read("src/platform/settings-store.web.ts");
    const webUpdater = read("src/platform/updater.web.ts");
    const webOpener = read("src/platform/opener.web.ts");

    expect(viteConfig).toContain('"#settings-store"');
    expect(viteConfig).toContain('"#updater"');
    expect(viteConfig).toContain('"#opener"');
    expect(webSettingsStore).not.toContain("@tauri-apps");
    expect(webUpdater).not.toContain("@tauri-apps");
    expect(webOpener).not.toContain("@tauri-apps");
  });

  it("removes auxiliary text around the software preview", () => {
    expect(webPreviewSource).not.toContain("web-preview__showcase-header");
    expect(webPreviewSource).not.toContain("web-preview__notice");
  });

  it("adds a centered author attribution footer", () => {
    expect(webPreviewSource).toContain("appCopyright");
    expect(webPreviewSource).toContain('class="web-preview__footer"');
    expect(webPreviewSource).toContain('class="web-preview__footer-mark"');
  });

  it("uses a compact preview stage for mini floating mode", () => {
    expect(webPreviewSource).toContain("miniLayerStyle");
    expect(webPreviewSource).toContain("--mini-stage-width");
    expect(webPreviewSource).toContain("--mini-stage-height");
    expect(webPreviewSource).toContain(".web-preview__mini-window.theme-light");
    expect(webPreviewSource).toContain(".web-preview__mini-window.theme-dark");
    expect(webPreviewSource).toContain("--mini-panel-rgb: 255 255 255");
    expect(webPreviewSource).toContain("--mini-panel-rgb: 0 0 0");
    expect(webPreviewSource).not.toContain("--mini-stage-contrast");
    expect(webPreviewSource).not.toContain("--mini-stage-merge");
    expect(webPreviewSource).not.toContain("--mini-opacity-percent");
    expect(webPreviewSource).toContain("linear-gradient(145deg, rgb(233 234 237)");
    expect(webPreviewSource).toContain("linear-gradient(145deg, rgb(39 40 45)");
    expect(webPreviewSource).toContain(".web-preview__showcase.is-mini::before");
    expect(webPreviewSource).toContain("--mini-preview-corner: 14px");
    expect(webPreviewSource).toContain(
      "clip-path: inset(0 round var(--mini-preview-corner))",
    );
    expect(webPreviewSource).toContain("backdrop-filter: none");
    expect(webPreviewSource).not.toContain(
      "width: min(100%, 480px);\n  height: 460px;\n  border-radius: 22px;\n  background: color-mix(in srgb, var(--panel) 86%, transparent);",
    );
  });

  it("separates the dark web stage from the dark software preview", () => {
    expect(webPreviewSource).toContain("--web-stage-panel");
    expect(webPreviewSource).toContain("--web-stage-ring");
    expect(webPreviewSource).toContain("--web-stage-aura");
    expect(webPreviewSource).toContain("--web-stage-reflection");
    expect(webPreviewSource).toContain(".theme-dark.web-preview .web-preview__frame");
  });

  it("keeps the dark preview window opaque instead of leaking the page background", () => {
    expect(webPreviewSource).toContain(".web-preview__frame .app-window");
    expect(webPreviewSource).toContain("background: var(--panel)");
    expect(webPreviewSource).toContain("backdrop-filter: none");
  });

  it("stabilizes the preview frame edge during theme switching", () => {
    const frameBlock = cssBlock(".web-preview__frame");

    expect(frameBlock).toContain("border: 0");
    expect(frameBlock).toContain("background-clip: padding-box");
    expect(frameBlock).toContain("contain: paint");
    expect(frameBlock).toContain("inset 0 0 0 1px var(--web-stage-ring)");
    expect(webPreviewSource).toContain(".web-preview__frame.is-theme-syncing");
    expect(webPreviewSource).not.toContain("border: 1px solid var(--web-stage-ring)");
    expect(cssBlock(".theme-dark.web-preview")).toContain(
      "--web-stage-ring: rgb(255 255 255 / 0.105)",
    );
  });

  it("keeps the web preview window close to the desktop default size", () => {
    expect(cssBlock(".web-preview__showcase")).toContain("width: min(100%, 480px)");
    expect(webPreviewSource).toContain("width: min(100%, 480px)");
    expect(webPreviewSource).toContain("height: 460px");
    expect(webPreviewSource).not.toContain("width: min(100%, 720px)");
  });

  it("keeps README focused without a separate recent updates section", () => {
    const readmeSource = read("README.md");

    expect(readmeSource).not.toContain("## 近期改进");
    expect(readmeSource).toContain('<h1 align="center">薪跳 PayDance</h1>');
    expect(readmeSource).toContain("桌面实时工资看板");
    expect(readmeSource).toContain("在线体验");
    expect(readmeSource).toContain("Windows 桌面版");
    expect(readmeSource).toContain("Mr.Baoboer");
    for (const heading of [
      "## 它是什么",
      "## 主要功能",
      "## 获取",
      "## 技术栈",
      "## 开发",
      "## 隐私",
      "## 相关文档",
      "## 许可",
    ]) {
      expect(readmeSource).toContain(heading);
    }
    expect(readmeSource).not.toContain("## 快速下载与安全校验");
    expect(readmeSource).not.toContain("## 隐私声明、作者与许可");
    expect(readmeSource).toContain("网页端，含所有核心功能");
    expect(readmeSource).toContain(
      "便携 EXE，含托盘、置顶、迷你悬浮、开机自启动等完整能力",
    );
    expect(readmeSource).not.toContain("poster-01-live-dashboard-v3.png");
    expect(readmeSource).not.toContain(["Mr", "Ba" + "ober"].join("."));
    expect(readmeSource).not.toContain("actions/workflows/ci.yml/badge.svg");
    expect(readmeSource).not.toContain("Web Preview 是产品橱窗，不替代桌面版");
  });

  it("builds the web preview for the Vercel primary site and GitHub Pages mirror", () => {
    const viteConfig = read("vite.config.ts");

    expect(viteConfig).toContain("process.env.VERCEL ?");
    expect(viteConfig).toContain('"/PayDance/"');
    expect(viteConfig).toContain("PAYDANCE_WEB_BASE");
    expect(viteConfig).toContain(
      'entries: isWeb ? ["index.html", "en/index.html"] : ["index.html"]',
    );
    expect(viteConfig).toContain('en: resolve(projectRoot, "en/index.html")');
    expect(viteConfig).toContain("createWebSeoPlugin");
    expect(read("vercel.json")).toContain('"buildCommand": "npm run build:web"');
    expect(viteConfig).toContain("src-tauri/target/**");
    expect(read(".github/workflows/web-preview.yml")).toContain("npm run build:web");
    expect(read(".github/workflows/web-preview.yml")).toContain(
      "actions/upload-pages-artifact@",
    );
    expect(read(".github/workflows/web-preview.yml")).toContain("actions/deploy-pages@");
  });
});

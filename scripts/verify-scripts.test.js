// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const packageJson = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "..", "package.json"), "utf8"),
);
const readRoot = (path) => readFileSync(resolve(import.meta.dirname, "..", path), "utf8");

describe("verification scripts", () => {
  it("keeps fast and release verification paths explicit", () => {
    expect(packageJson.scripts.dev).toContain("--mode desktop");
    expect(packageJson.scripts.build).toBe("npm run build:desktop");
    expect(packageJson.scripts["build:desktop"]).toContain("--mode desktop");
    expect(packageJson.scripts["build:desktop"]).toContain(
      "node scripts/assert-build-target.mjs desktop",
    );
    expect(packageJson.scripts["build:desktop"]).toContain(
      "node scripts/assert-build-boundary.mjs desktop",
    );
    expect(packageJson.scripts["build:web"]).toContain("--mode web");
    expect(packageJson.scripts["build:web"]).toContain(
      "node scripts/assert-build-target.mjs web",
    );
    expect(packageJson.scripts["build:web"]).toContain(
      "node scripts/assert-build-boundary.mjs web",
    );

    expect(packageJson.scripts["verify:fast"]).toContain("npm run check:hygiene");
    expect(packageJson.scripts["verify:fast"]).toContain("npm run lint");
    expect(packageJson.scripts["verify:fast"]).toContain("npm run build:desktop");
    expect(packageJson.scripts.verify).toBe("npm run verify:fast");
    expect(packageJson.scripts["verify:metadata"]).toContain(
      "scripts/assert-build-target.test.js",
    );
    expect(packageJson.scripts["verify:metadata"]).toContain("scripts/web-seo.test.js");
    expect(packageJson.scripts["verify:push"]).toBe(
      "node scripts/push-workflow.mjs --verify-only",
    );
    expect(packageJson.scripts["push:main"]).toBe("node scripts/push-workflow.mjs");
    expect(packageJson.scripts["verify:release:record"]).toBe(
      "npm run verify:release && node scripts/verification-evidence.mjs write verify:release",
    );
    expect(packageJson.scripts["release:publish"]).toBe(
      "node scripts/release-workflow.mjs",
    );

    expect(readRoot("src-tauri/tauri.conf.json")).toContain(
      '"beforeBuildCommand": "npm run build:desktop"',
    );
    expect(readRoot(".github/workflows/release.yml")).toContain(
      "node scripts/assert-build-target.mjs desktop",
    );
    expect(readRoot(".github/workflows/release.yml")).toContain(
      "node scripts/assert-build-boundary.mjs desktop",
    );

    const releaseCommands = packageJson.scripts["verify:release"]
      .split("&&")
      .map((command) => command.trim());

    expect(packageJson.scripts["verify:release"]).toContain("npm run version:check");
    expect(releaseCommands).toContain("npm audit --audit-level=high");
    expect(releaseCommands).not.toContain("npm audit --omit=dev");
    expect(packageJson.scripts["verify:release"]).not.toMatch(
      /\bnpm audit\b[^&]*(?:--omit(?:=|\s+)dev)\b/,
    );
    expect(packageJson.scripts["verify:release"]).toContain("cargo fmt --all -- --check");
    expect(packageJson.scripts["verify:release"]).toContain(
      "cargo clippy --all-targets -- -D warnings",
    );
    expect(packageJson.scripts["verify:release"]).toContain("cargo audit");
    expect(packageJson.scripts["verify:release"]).toContain("cargo deny check");
  });

  it("keeps daily pushes fast while release verification stays complete", () => {
    const pushWorkflow = readRoot("scripts/push-workflow.mjs");

    expect(pushWorkflow).toContain("npm run verify:push");
    expect(pushWorkflow).toContain("npm run push:main");
    expect(pushWorkflow).toContain("npm_execpath");
    expect(pushWorkflow).toContain("npm-cli.js");
    expect(pushWorkflow).not.toContain("npm.cmd");
    expect(pushWorkflow).toContain('"lint"');
    expect(pushWorkflow).toContain('"unit tests"');
    expect(pushWorkflow).not.toContain('"build:desktop"');
    expect(pushWorkflow).not.toContain('"build:web"');
    expect(pushWorkflow).not.toContain('"audit", "--omit=dev"');
    expect(pushWorkflow).not.toContain('"deny", "check"');
    expect(pushWorkflow).toContain('"diff", "--check"');
    expect(pushWorkflow).toContain("Tracked working tree changes must be committed");
    expect(pushWorkflow).toContain("Untracked files are present");
    expect(pushWorkflow).toContain("--strict-untracked");
    expect(pushWorkflow).toContain("readVerificationEvidence");
    expect(pushWorkflow).toContain("Skipping local verification because");
    expect(pushWorkflow).toContain("Refusing to push from");
    expect(pushWorkflow).toContain("dependabot/alerts");
    expect(pushWorkflow).toContain("Open Dependabot alerts found");
    expect(pushWorkflow).toContain('watchWorkflow("CI"');
    expect(pushWorkflow).toContain('watchWorkflow("CodeQL"');
    expect(pushWorkflow).toContain('watchWorkflow("Web Preview"');

    const releaseWorkflowScript = readRoot("scripts/release-workflow.mjs");
    expect(releaseWorkflowScript).toContain("npm run release:publish");
    expect(releaseWorkflowScript).toContain("Verify CI passed on the release commit");
    expect(releaseWorkflowScript).toContain("watchWorkflow(\"Release\"");
    expect(releaseWorkflowScript).toContain("watchWorkflow(\"Post-Release Smoke\"");
    expect(releaseWorkflowScript).toContain("release-manifest.json");
    expect(releaseWorkflowScript).toContain("assertTagDoesNotExist");

    expect(readRoot(".github/CONTRIBUTING.md")).toContain("npm run push:main");
    expect(readRoot("docs/CONTRIBUTING_EN.md")).toContain("npm run push:main");
  });

  it("keeps Rust dependency governance explicit and warning-free", () => {
    const auditConfig = readRoot("src-tauri/.cargo/audit.toml");
    const denyConfig = readRoot("src-tauri/deny.toml");

    expect(auditConfig).toContain("# Tauri/Wry upstream advisories");
    expect(auditConfig).toContain("RUSTSEC-2024-0411");
    expect(auditConfig).toContain("RUSTSEC-2024-0413");
    expect(auditConfig).toContain("RUSTSEC-2025-0100");

    expect(denyConfig).toContain('multiple-versions = "allow"');
    expect(denyConfig).not.toContain("RUSTSEC-2024-0370");
    expect(denyConfig).not.toContain('"GPL-3.0-only"');
    expect(denyConfig).not.toContain('"GPL-3.0-or-later"');
    expect(denyConfig).not.toContain('"OpenSSL"');
    expect(denyConfig).not.toContain('"Unicode-DFS-2016"');
    expect(denyConfig).not.toContain('"BSL-1.0"');
  });

  it("codifies Web Preview QA through the project-owned Playwright workflow", () => {
    expect(packageJson.scripts["qa:web-preview"]).toBe("node scripts/qa-web-preview.mjs");
    expect(packageJson.devDependencies.playwright).toBeDefined();
    expect(packageJson.devDependencies["@axe-core/playwright"]).toBeDefined();

    const qaScript = readRoot("scripts/qa-web-preview.mjs");
    expect(qaScript).toContain("AxeBuilder");
    const resolverScript = readRoot("scripts/resolve-playwright.mjs");
    expect(qaScript).toContain("playwright");
    expect(qaScript).toContain('from "./resolve-playwright.mjs"');
    expect(resolverScript).toContain("resolvePlaywright");
    expect(resolverScript).toContain('resolve(projectRoot, "node_modules")');
    expect(resolverScript.indexOf('resolve(projectRoot, "node_modules")')).toBeLessThan(
      resolverScript.indexOf("CODEX_NODE_MODULES"),
    );
    expect(qaScript).toContain("desktop");
    expect(qaScript).toContain("medium");
    expect(qaScript).toContain("mobile");
    expect(qaScript).toContain('const locales = ["zh-CN", "en"]');
    expect(qaScript).toContain("1440");
    expect(qaScript).toContain("960");
    expect(qaScript).toContain("390");
    expect(qaScript).toContain("console");
    expect(qaScript).toContain("--force");
    expect(qaScript).toContain("Web Preview");
    expect(qaScript).toContain("PAYDANCE_WEB_QA_RUN_ID");
    expect(qaScript).toContain("process.env.RUNNER_TEMP ?? tmpdir()");
    expect(qaScript).toContain('timezoneId: "Asia/Shanghai"');
    expect(qaScript).toContain("commitSha");
    expect(qaScript).toContain("observedCopies");
    expect(qaScript).toContain("monthlySalary: 10000");
    expect(qaScript).toContain('startTime: "09:00"');
    expect(qaScript).toContain('endTime: "22:00"');
    expect(qaScript).toContain("workdays: [0, 1, 2, 3, 4, 5, 6]");
    expect(qaScript).toContain("assertAccessibility");
    expect(qaScript).toContain("assertLanguageSwitchFlow");
    expect(qaScript).toContain("assertSeoMetadata");
    expect(qaScript).toContain("Switch to English");
    expect(qaScript).toContain("data-locale");
    expect(qaScript).toContain("en: `${localUrl}en/`");
    expect(qaScript).toContain("paydance-web-preview-qa-${version}-${runId}");
    expect(qaScript).toContain(".web-preview__chip");
    expect(qaScript).toContain(".web-preview__action");
    expect(qaScript).toContain(".web-preview__action-label");
    expect(qaScript).toContain("assertThemeToggleEdge");
    expect(qaScript).toContain("切换到深色模式");
    expect(qaScript).toContain("切换到浅色模式");
    expect(qaScript).toContain(
      'page.goto(localUrl, { timeout: 60_000, waitUntil: "domcontentloaded" })',
    );
    expect(qaScript).toContain('getByRole("link", { name: "Switch to English" })');

    const qaGuide = readRoot("docs/web-preview-qa.md");
    expect(qaGuide).toContain("Web Preview QA 用来确认官网橱窗");
    expect(qaGuide).toContain("本地和 GitHub Pages 镜像从 `/PayDance/` 进入中文页");
    expect(qaGuide).toContain("PLAYWRIGHT_NODE_MODULES");
    expect(qaGuide).toContain("@axe-core/playwright");
    expect(qaGuide).toContain("不要用 headless Chrome、CDP 或命令行截图");
    expect(qaGuide).toContain(
      "C:\\Users\\mrbao\\AppData\\Local\\Temp\\paydance-web-preview-qa-{version}-{commit}-{timestamp}",
    );
    expect(qaGuide).toContain("页面实际读取到的中英文文案");
    expect(qaGuide).toContain("截图路径和视觉比较结果");
  });
});

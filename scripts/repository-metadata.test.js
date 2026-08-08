// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { extname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(repoRoot, path), "utf8");
const packageJson = JSON.parse(read("package.json"));
const renovateConfig = JSON.parse(read(".github/renovate.json"));
const dependabotConfig = read(".github/dependabot.yml");
const dependabotSettings = dependabotConfig
  .split(/\r?\n/)
  .filter((line) => !line.trim().startsWith("#"))
  .join("\n");
// Collapsed so adjacency can be asserted with plain substring matching; building
// a RegExp from these names would reintroduce js/incomplete-sanitization.
const collapsedDependabotSettings = dependabotSettings.replace(/\s+/g, " ");
const versionedDesktopAssetName = `pay-dance-v${packageJson.version}-windows-x64.exe`;
const desktopDownloadUrl = `https://github.com/MrBaoboer/PayDance/releases/latest/download/${versionedDesktopAssetName}`;
const legacyAdditionalTermsReference = `see /${["ADDITIONAL_TERMS", "md"].join(".")}`;
const binaryExtensions = new Set([".ico", ".png", ".woff2"]);
const existsInWorktree = (path) => existsSync(resolve(repoRoot, path));
const trackedTextFiles = () =>
  execFileSync("git", ["ls-files"], {
    cwd: repoRoot,
    encoding: "utf8",
  })
    .split(/\r?\n/)
    .filter(Boolean)
    .filter(existsInWorktree)
    .filter((path) => !binaryExtensions.has(extname(path).toLowerCase()));
const trackedMarkdownFiles = () =>
  execFileSync("git", ["ls-files", "*.md"], {
    cwd: repoRoot,
    encoding: "utf8",
  })
    .split(/\r?\n/)
    .filter(Boolean)
    .filter(existsInWorktree);

function resolveMarkdownLink(file, rawTarget) {
  const target = rawTarget.trim().replace(/^<|>$/g, "").split(/\s+/)[0];
  if (
    !target ||
    target.startsWith("#") ||
    target.startsWith("http://") ||
    target.startsWith("https://") ||
    target.startsWith("mailto:")
  ) {
    return null;
  }

  const withoutAnchor = target.split("#")[0];
  if (!withoutAnchor) return null;
  return resolve(
    repoRoot,
    file.includes("/") ? file.replace(/\/[^/]+$/, "") : ".",
    withoutAnchor,
  );
}

describe("repository metadata", () => {
  it("keeps Renovate immediate, unlimited, and human-reviewed", () => {
    expect(renovateConfig.dependencyDashboard).toBe(true);
    expect(renovateConfig.automerge).toBe(false);
    expect(renovateConfig.prConcurrentLimit).toBe(0);
    expect(renovateConfig.prHourlyLimit).toBe(0);
    expect(renovateConfig.schedule).toBeUndefined();
    expect(renovateConfig.packageRules.some((rule) => rule.automerge === true)).toBe(
      false,
    );
  });

  it("keeps Dependabot covering every ecosystem and human-reviewed", () => {
    for (const ecosystem of ["npm", "cargo", "github-actions"]) {
      expect(dependabotConfig).toContain(`package-ecosystem: ${ecosystem}`);
    }
    expect(dependabotConfig).toContain("directory: /src-tauri");
    expect(dependabotConfig).toMatch(/interval: weekly/);
    // Comments mention automerge on purpose; only actual settings must not.
    expect(dependabotSettings).not.toMatch(/automerge/i);
  });

  it("keeps the upgrades that are blocked upstream pinned with a reason", () => {
    // TypeScript 7 breaks vue-tsc (ERR_PACKAGE_PATH_NOT_EXPORTED) and
    // typescript-eslint refuses to load against it. @types/node must track the
    // Node 24 LTS runtime that CI and local development both use.
    expect(packageJson.devDependencies.typescript).toMatch(/^\^6\./);
    expect(packageJson.devDependencies["@types/node"]).toMatch(/^\^24\./);
    for (const name of ["typescript", '"@types/node"']) {
      expect(collapsedDependabotSettings).toContain(
        `dependency-name: ${name} update-types: - version-update:semver-major`,
      );
    }
    expect(
      renovateConfig.packageRules.find((rule) =>
        rule.matchPackageNames?.includes("typescript"),
      )?.allowedVersions,
    ).toBe("<7");
    expect(
      renovateConfig.packageRules.find((rule) =>
        rule.matchPackageNames?.includes("@types/node"),
      )?.allowedVersions,
    ).toBe("<25");
  });

  it("keeps README desktop download links on the versioned Windows release executable", () => {
    const readme = read("README.md");
    const desktopDownloadLinks = readme.match(
      new RegExp(
        `https://github\\.com/MrBaoboer/PayDance/releases/latest/download/${versionedDesktopAssetName}`,
        "g",
      ),
    );

    expect(desktopDownloadLinks?.length).toBeGreaterThanOrEqual(1);
    expect(readme).toContain(desktopDownloadUrl);
    expect(readme).toContain(versionedDesktopAssetName);
    // versionedDesktopChecksumName is removed from README to prevent hardcoded version churn
    expect(read("src/lib/app-meta.ts")).toContain("windowsDownloadAssetName");
    expect(readme).not.toContain("releases/download/v0.7.16/pay-dance.exe");
    expect(readme).not.toContain("mrbaoboer.github.io/PayDance/pay-dance.exe");
  });

  it("keeps the English README on its dedicated first-time setup poster", () => {
    const posterPath = "docs/posters/poster-02-three-step-setup-en-v1.png";
    const englishReadme = read("docs/README_EN.md");

    expect(englishReadme).toContain("https://paydance.vercel.app/en/");
    expect(englishReadme).not.toContain(
      '<a href="https://paydance.vercel.app/"><strong>Live Preview</strong></a>',
    );
    expect(englishReadme).toContain('src="posters/poster-02-three-step-setup-en-v1.png"');
    expect(existsInWorktree(posterPath)).toBe(true);
  });

  it("keeps English changelog demo wording product-neutral", () => {
    const englishChangelog = read("CHANGELOG_EN.md");

    expect(englishChangelog).not.toContain("portfolio and interview demos");
  });

  it("keeps production URLs out of dynamically constructed regular expressions", () => {
    const webPreviewTest = read("src/web-preview.test.ts");

    expect(webPreviewTest).not.toContain("new RegExp(sharePosterUrl");
  });

  it("keeps the root LICENSE recognizable as canonical AGPL-3.0", () => {
    const license = read("LICENSE");
    const normalizedLicense = license.replace(/\s+/g, " ");

    expect(license).toContain("GNU AFFERO GENERAL PUBLIC LICENSE");
    expect(license).toContain("Version 3, 19 November 2007");
    expect(license).toContain(
      "The GNU Affero General Public License is a free, copyleft license",
    );
    expect(normalizedLicense).toContain(
      "specifically designed to ensure cooperation with the community in the case of network server software",
    );
    expect(license).not.toContain("Version 3, 29 June 2007");
    expect(license).not.toContain(
      "The GNU General Public License is a free, copyleft license",
    );
    expect(license).not.toContain(
      "The GNU Affero General Public License does not permit incorporating your program into proprietary programs",
    );
    expect(read(".gitattributes")).toContain("LICENSE text eol=lf");
  });

  it("keeps additional terms scoped to AGPL code materials under legal/", () => {
    expect(read("legal/ADDITIONAL_TERMS.md")).toContain(
      "适用于 Mr.Baoboer 拥有版权并以 AGPL-3.0-only 发布的 PayDance 软件代码材料。",
    );
    expect(read("legal/ADDITIONAL_TERMS.md")).not.toContain("代码与相关材料");
    expect(read("legal/ADDITIONAL_TERMS_EN.md")).toContain(
      "They apply to PayDance software code materials copyrighted by Mr.Baoboer and released under AGPL-3.0-only.",
    );
    expect(read("legal/ADDITIONAL_TERMS_EN.md")).not.toContain(
      "code and related materials",
    );

    for (const file of trackedTextFiles()) {
      expect(read(file), file).not.toContain(legacyAdditionalTermsReference);
    }
  });

  it("publishes versioned Windows release assets from the release workflow", () => {
    const releaseWorkflow = read(".github/workflows/release.yml");
    const postReleaseSmoke = read(".github/workflows/post-release-smoke.yml");

    expect(releaseWorkflow).toContain("pay-dance-v$version-windows-x64.exe");
    expect(releaseWorkflow).toContain("portableName");
    expect(releaseWorkflow).toContain("allow_missing_ci_for_repair");
    expect(releaseWorkflow).toContain("ALLOW_MISSING_CI_FOR_REPAIR");
    expect(releaseWorkflow).toContain("Skipping CI gate for existing release repair");
    expect(releaseWorkflow).toContain("npx tauri signer sign");
    expect(releaseWorkflow).toContain("windows-x64.exe.sig");
    expect(releaseWorkflow).toContain("TAURI_SIGNING_PRIVATE_KEY");
    expect(releaseWorkflow).toContain("pay-dance-v");
    expect(releaseWorkflow).toContain("windows-x64");
    expect(releaseWorkflow).not.toContain("pay-dance.exe.sha256");
    expect(releaseWorkflow).toContain("latest.json");
    expect(releaseWorkflow).toContain("Generate release manifest");
    expect(releaseWorkflow).toContain("release-manifest.json");
    expect(releaseWorkflow).toContain("authenticodeStatus");
    expect(releaseWorkflow).toContain("Build artifact smoke");
    expect(releaseWorkflow).toContain("Verify dry-run release assets");
    expect(releaseWorkflow).toContain("Verify updater signature");
    expect(releaseWorkflow).toContain("fail_on_unmatched_files: true");
    expect(releaseWorkflow).not.toContain(
      '$sigArg = if (Test-Path $sigFile) { "--sig-file $sigFile" } else { "" }',
    );

    expect(postReleaseSmoke).toContain(
      'jq -e \'.platforms["windows-x86_64"].signature | type == "string" and length > 0\' latest.json',
    );
    expect(postReleaseSmoke).toContain(
      "Verify latest.json points at the checksummed asset",
    );
    expect(postReleaseSmoke).toContain("Resolve release tag from workflow artifact");
    expect(postReleaseSmoke).toContain("release-manifest.json");
    expect(postReleaseSmoke).toContain("EXPECTED_TAG");
    expect(postReleaseSmoke).toContain("GitHub asset digest");
  });

  it("publishes a minimal community governance surface", () => {
    expect(read("CODE_OF_CONDUCT.md")).toContain("English version");
    expect(read("CODE_OF_CONDUCT.md")).toContain("行为准则");
    expect(read("docs/CODE_OF_CONDUCT_EN.md")).toContain("Code of Conduct");
    expect(read("docs/MAINTAINERS.md")).toContain("维护者说明");
    expect(read("docs/MAINTAINERS_EN.md")).toContain("Maintainers");
    expect(read("docs/GOVERNANCE.md")).toContain("治理说明");
    expect(read("docs/GOVERNANCE_EN.md")).toContain("Governance");
    expect(read("docs/MAINTENANCE.md")).toContain("配置迁移");
    expect(read("docs/MAINTENANCE_EN.md")).toContain("Settings Migration");
    expect(read("README.md")).toContain("docs/ARCHITECTURE.md");
    expect(read("docs/README_EN.md")).toContain("ARCHITECTURE_EN.md");
    expect(read("docs/ARCHITECTURE.md")).toContain("修改导航");
    expect(read("docs/ARCHITECTURE_EN.md")).toContain("Change Map");
    expect(read(".github/CONTRIBUTING.md")).toContain("good first issue");
    expect(read("docs/CONTRIBUTING_EN.md")).toContain("good first issue");
    expect(read(".github/CONTRIBUTING.md")).toContain("用户能看到的结果");
    expect(read(".github/CONTRIBUTING.md")).toContain("验收标准");
    expect(read(".github/CONTRIBUTING.md")).toContain("验证命令");
    expect(read("docs/CONTRIBUTING_EN.md")).toContain("user-visible result");
    expect(read("docs/CONTRIBUTING_EN.md")).toContain("Acceptance criteria");
    expect(read("docs/CONTRIBUTING_EN.md")).toContain("Verification command");
    expect(read(".github/ISSUE_TEMPLATE.md")).toContain("用户影响");
    expect(read(".github/ISSUE_TEMPLATE.md")).toContain("验收标准");
    expect(read(".github/ISSUE_TEMPLATE.md")).toContain("验证命令");
    expect(read(".github/CONTRIBUTING.md")).toContain(
      "普通贡献只需要 DCO 签署行，不需要提前签 CLA",
    );
    expect(read("docs/CONTRIBUTING_EN.md")).toContain(
      "Ordinary contributions only need a DCO sign-off; no CLA is required upfront",
    );
  });

  it("keeps bilingual roadmap status aligned with implemented reliability work", () => {
    const roadmap = read("docs/ROADMAP.md");
    const roadmapEn = read("docs/ROADMAP_EN.md");

    expect(roadmap).toContain("CodeQL");
    expect(roadmap).toContain("SBOM");
    expect(roadmap).toContain("Windows EXE 自动启动冒烟");
    expect(roadmapEn).toContain("CodeQL");
    expect(roadmapEn).toContain("SBOM");
    expect(roadmapEn).toContain("automated Windows EXE launch smoke");
  });

  it("keeps .github contributing governance links on canonical GitHub blob URLs", () => {
    const contributing = read(".github/CONTRIBUTING.md");
    const githubBlobBase = "https://github.com/MrBaoboer/PayDance/blob/main";

    expect(contributing).toContain(
      `[CODE_OF_CONDUCT.md](${githubBlobBase}/CODE_OF_CONDUCT.md)`,
    );
    expect(contributing).toContain(
      `[docs/MAINTAINERS.md](${githubBlobBase}/docs/MAINTAINERS.md)`,
    );
    expect(contributing).toContain(
      `[docs/GOVERNANCE.md](${githubBlobBase}/docs/GOVERNANCE.md)`,
    );
    expect(contributing).toContain(
      `[docs/MAINTENANCE.md](${githubBlobBase}/docs/MAINTENANCE.md)`,
    );
    expect(contributing).not.toContain("github.com/MrBaoboer/PayDance/blob/docs/");
  });

  it("keeps issue template version hints aligned with the current release line", () => {
    const currentVersion = `v${packageJson.version}`;
    expect(read(".github/ISSUE_TEMPLATE.md")).toContain(currentVersion);
    expect(read(".github/ISSUE_TEMPLATE/bug_report.yml")).toContain(currentVersion);
  });

  it("keeps repository markdown links resolvable after documentation moves", () => {
    const missingLinks = [];
    const markdownLinkPattern = /(?<!!)\[[^\]]+\]\(([^)]+)\)/g;

    for (const file of trackedMarkdownFiles()) {
      const source = read(file);
      for (const match of source.matchAll(markdownLinkPattern)) {
        const resolved = resolveMarkdownLink(file, match[1]);
        if (resolved && !existsSync(resolved)) {
          missingLinks.push(`${file}: ${match[1]}`);
        }
      }
    }

    expect(missingLinks).toEqual([]);
  });

  it("keeps gitleaks configuration parseable and intentional", () => {
    const config = read(".gitleaks.toml");

    expect(config).toContain('title = "PayDance gitleaks config"');
    expect(config).toContain("[allowlist]");
    expect(config).toContain("paths = [");
    expect(config.split(/\r?\n/).length).toBeGreaterThan(10);
    expect(config).not.toContain("PayDance#");
  });

  it("keeps brand asset documentation Chinese-first with English mirrors", () => {
    expect(read("docs/brand/official.md")).toContain("# 官方品牌资产");
    expect(read("docs/brand/official.md")).toContain(
      "> [English version →](official_EN.md)",
    );
    expect(read("docs/brand/official_EN.md")).toContain("# Official Brand Assets");

    expect(read("docs/brand/community-placeholder.md")).toContain("# 社区占位资产");
    expect(read("docs/brand/community-placeholder.md")).toContain(
      "> [English version →](community-placeholder_EN.md)",
    );
    expect(read("docs/brand/community-placeholder_EN.md")).toContain(
      "# Community Placeholder Assets",
    );
  });

  it("keeps maintainer contact guidance on the public GitHub profile email", () => {
    const githubProfile = "https://github.com/MrBaoboer";
    const blockedContactPhrases = [
      ["提交", "历史", "中的", "邮箱"].join(""),
      ["email", "found", "in", "commit", "history"].join(" "),
      ["contact", "Mr.Baoboer"].join(" "),
      ["联系", "Mr.Baoboer"].join(" "),
    ];

    expect(read("docs/SUPPORT.md")).toContain(githubProfile);
    expect(read("docs/SUPPORT_EN.md")).toContain(githubProfile);
    expect(read("legal/LEGAL.md")).toContain(githubProfile);
    expect(read("legal/LEGAL_EN.md")).toContain(githubProfile);

    for (const file of trackedTextFiles()) {
      const source = read(file);
      for (const phrase of blockedContactPhrases) {
        expect(source, file).not.toContain(phrase);
      }
    }
  });

  it("keeps platform positioning Windows-focused but community-extensible", () => {
    expect(read("README.md")).toContain(
      "薪跳 PayDance 是一款桌面实时工资看板。配置薪资与上下班时间后",
    );
    expect(read("docs/README_EN.md")).toContain(
      "PayDance (薪跳) is a desktop real-time salary dashboard.",
    );
    expect(read("docs/PRODUCT.md")).toContain("这并不排斥 macOS、Linux 等平台");
    expect(read(".github/CONTRIBUTING.md")).toContain("平台适配贡献需附验证边界");
    expect(read(".github/SECURITY.md")).not.toContain(
      ["不属于", "当前正式支持", "或发布范围"].join(""),
    );
    expect(read("docs/SECURITY_EN.md")).not.toContain(
      "not part of the current supported release surface",
    );
  });

  it("keeps stage-dependent docs from over-promising future scope", () => {
    const blockedScopePhrases = [
      ["永", "不", "做"].join(""),
      ["will", "not", "be", "accepted"].join(" "),
      ["不会", "合并"].join(""),
    ];

    expect(read("README.md")).toContain("网页端，含所有核心功能");
    expect(read("docs/README_EN.md")).toContain("Browser-based, all core features");
    expect(read("docs/ROADMAP.md")).toContain("长期排除方向");
    expect(read("docs/ROADMAP_EN.md")).toContain("Long-Term Exclusions");

    for (const file of trackedTextFiles()) {
      const source = read(file);
      for (const phrase of blockedScopePhrases) {
        expect(source, file).not.toContain(phrase);
      }
    }
  });

  it("keeps product positioning on the real-time desktop wage board wording", () => {
    const positioning = "桌面实时工资看板";

    expect(read("README.md")).toContain(positioning);
    expect(read("docs/PRODUCT.md")).toContain(positioning);
    expect(read("src/lib/app-meta.ts")).toContain(positioning);
    expect(read("src-tauri/Cargo.toml")).toContain(positioning);
    expect(read("src-tauri/src/tray.rs")).toContain(positioning);
  });
});

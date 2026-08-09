// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

// 第三方声明漂移检查。
//
// legal/THIRD_PARTY_NOTICES*.md 是手工维护的，依赖增删不会自动反映进去。
// 发布时的 SPDX SBOM 是自动生成的，两份清单一旦对不上，对外声明的就是
// 一份错的第三方署名——这正是 AGPL-3.0 §5 要求随分发保留的内容。
//
// 双向比对直接依赖与清单条目：漏记新依赖会失败，保留已移除的依赖同样会失败。

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const NOTICE_FILES = ["legal/THIRD_PARTY_NOTICES.md", "legal/THIRD_PARTY_NOTICES_EN.md"];

// 匹配表格行首的包名单元格，形如 `| \`name\` |` 或 `| [\`name\`](url) |`。
// 正文里出现的反引号（例如 `Cargo.lock`）不在行首表格单元格中，不会误判。
const NOTICE_ENTRY_PATTERN = /^\|\s*\[?`([^`]+)`\]?/gm;
const CARGO_TABLE_PATTERN =
  /^\[(?:[^\]]*\.)?(?:dependencies|build-dependencies|dev-dependencies)\]$/;
const CARGO_ENTRY_PATTERN = /^([A-Za-z0-9_-]+)\s*=/;

export function collectNpmDependencies(packageJson) {
  return [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
  ];
}

export function collectCargoDependencies(cargoToml) {
  const names = new Set();
  let inDependencyTable = false;

  for (const rawLine of cargoToml.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (line.startsWith("[")) {
      inDependencyTable = CARGO_TABLE_PATTERN.test(line);
      continue;
    }
    if (!inDependencyTable || line === "" || line.startsWith("#")) continue;

    const match = line.match(CARGO_ENTRY_PATTERN);
    if (match) names.add(match[1]);
  }

  return [...names];
}

export function collectNoticeEntries(noticeSource) {
  return [...noticeSource.matchAll(NOTICE_ENTRY_PATTERN)].map((match) => match[1]);
}

export function findNoticeDrift(dependencies, notices) {
  const expected = new Set(dependencies);
  const findings = [];

  for (const notice of notices) {
    const listed = new Set(collectNoticeEntries(notice.source));

    for (const name of expected) {
      if (!listed.has(name)) {
        findings.push(`${notice.file}: missing direct dependency \`${name}\``);
      }
    }
    for (const name of listed) {
      if (!expected.has(name)) {
        findings.push(
          `${notice.file}: stale entry \`${name}\` is no longer a direct dependency`,
        );
      }
    }
  }

  return findings;
}

function cli(argv) {
  const rootArgIndex = argv.indexOf("--root");
  const root = resolve(rootArgIndex >= 0 ? argv[rootArgIndex + 1] : ".");
  const read = (path) => readFileSync(resolve(root, path), "utf8");

  const dependencies = [
    ...collectNpmDependencies(JSON.parse(read("package.json"))),
    ...collectCargoDependencies(read("src-tauri/Cargo.toml")),
  ];
  const notices = NOTICE_FILES.map((file) => ({ file, source: read(file) }));
  const findings = findNoticeDrift(dependencies, notices);

  if (findings.length > 0) {
    console.error(
      [
        `Third-party notices are out of sync with the declared dependencies:`,
        ...findings,
        "",
        "Fix: update legal/THIRD_PARTY_NOTICES.md and its English mirror so every",
        "direct dependency appears as a table row starting with the exact package",
        "name in backticks.",
      ].join("\n"),
    );
    process.exit(1);
  }

  console.log(
    `Third-party notices check passed: ${dependencies.length} direct dependencies listed.`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    cli(process.argv.slice(2));
  } catch (error) {
    console.error(`[check-third-party-notices] ${error.message}`);
    process.exit(1);
  }
}

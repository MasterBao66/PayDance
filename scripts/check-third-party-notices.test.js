// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  collectCargoDependencies,
  collectNoticeEntries,
  collectNpmDependencies,
  findNoticeDrift,
} from "./check-third-party-notices.mjs";

const repoRoot = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(repoRoot, path), "utf8");

describe("third-party notices drift check", () => {
  it("collects npm runtime and development dependencies", () => {
    const names = collectNpmDependencies({
      dependencies: { vue: "^3.5.41" },
      devDependencies: { vitest: "^4.1.10" },
    });

    expect(names).toEqual(["vue", "vitest"]);
  });

  it("collects Cargo dependencies from build and platform-specific tables", () => {
    const names = collectCargoDependencies(
      [
        "[package]",
        'name = "pay-dance"',
        "",
        "[build-dependencies]",
        'tauri-build = { version = "2", features = [] }',
        "",
        "[dependencies]",
        "# 注释不算依赖",
        'tauri = { version = "2", features = ["tray-icon"] }',
        'serde_json = "1"',
        "",
        "[target.'cfg(not(any(target_os = \"android\")))'.dependencies]",
        'tauri-plugin-autostart = "2"',
        "",
        "[lib]",
        'name = "pay_dance_lib"',
      ].join("\n"),
    );

    expect(names).toEqual([
      "tauri-build",
      "tauri",
      "serde_json",
      "tauri-plugin-autostart",
    ]);
    expect(names).not.toContain("name");
  });

  it("reads notice entries from both plain and linked table cells", () => {
    const entries = collectNoticeEntries(
      [
        "完整依赖树见 `src-tauri/Cargo.lock`。",
        "",
        "| 包名 | 许可证 |",
        "|------|--------|",
        "| [`@tauri-apps/api`](https://github.com/tauri-apps/tauri) | Apache-2.0 OR MIT |",
        "| `vue` | MIT |",
      ].join("\n"),
    );

    // 正文里的反引号不在表格行首，不应被当成依赖条目。
    expect(entries).toEqual(["@tauri-apps/api", "vue"]);
  });

  it("flags a dependency that never made it into the notices", () => {
    const findings = findNoticeDrift(
      ["vue"],
      [{ file: "legal/x.md", source: "| `other` | MIT |" }],
    );

    expect(findings).toContain("legal/x.md: missing direct dependency `vue`");
  });

  it("flags a notice entry that is no longer a dependency", () => {
    const findings = findNoticeDrift(
      ["vue"],
      [{ file: "legal/x.md", source: "| `vue` | MIT |\n| `axe-core` | MPL-2.0 |" }],
    );

    expect(findings).toEqual([
      "legal/x.md: stale entry `axe-core` is no longer a direct dependency",
    ]);
  });

  it("keeps the published notices in sync with the declared dependencies", () => {
    const dependencies = [
      ...collectNpmDependencies(JSON.parse(read("package.json"))),
      ...collectCargoDependencies(read("src-tauri/Cargo.toml")),
    ];
    const notices = [
      "legal/THIRD_PARTY_NOTICES.md",
      "legal/THIRD_PARTY_NOTICES_EN.md",
    ].map((file) => ({ file, source: read(file) }));

    expect(findNoticeDrift(dependencies, notices)).toEqual([]);
  });
});

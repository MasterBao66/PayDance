// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "..");

const readArg = (name) => {
  const index = process.argv.indexOf(name);
  if (index < 0) return undefined;

  return process.argv[index + 1];
};

const versionArg = readArg("--version") ?? process.env.GITHUB_REF_NAME;
const outputPath = readArg("--output") ?? "release-notes.md";

if (!versionArg?.trim()) {
  throw new Error("Version is required. Pass --version vX.Y.Z or set GITHUB_REF_NAME.");
}

const normalizedVersion = versionArg.trim().startsWith("v")
  ? versionArg.trim()
  : `v${versionArg.trim()}`;

const changelogPath = resolve(projectRoot, "CHANGELOG.md");
const lines = readFileSync(changelogPath, "utf8").split(/\r?\n/);
const heading = `### ${normalizedVersion}`;
const startIndex = lines.indexOf(heading);

const writeNotes = (content) => {
  writeFileSync(resolve(projectRoot, outputPath), `${content.join("\n")}\n`, "utf8");
};

if (startIndex < 0) {
  writeNotes([
    `## PayDance ${normalizedVersion}`,
    "",
    "This release was built by GitHub Actions. Download the assets from this GitHub Release page, and verify the executable against its `.sha256` file before running it.",
  ]);
  console.warn(
    `Release notes section ${heading} was not found in CHANGELOG.md. Wrote fallback notes to ${outputPath}.`,
  );
  process.exit(0);
}

const body = [];
for (let index = startIndex + 1; index < lines.length; index += 1) {
  if (lines[index].startsWith("### ")) break;
  body.push(lines[index]);
}

while (body.length > 0 && body[0].trim() === "") {
  body.shift();
}

while (body.length > 0 && body[body.length - 1].trim() === "") {
  body.pop();
}

writeNotes([
  `## PayDance ${normalizedVersion}`,
  "",
  "### Changes",
  ...body,
  "",
  "### Download and verification",
  "",
  "- Download assets from this GitHub Release page.",
  "- If a `.sha256` file is provided, verify the executable before running it.",
]);

console.log(`Wrote release notes from CHANGELOG.md to ${outputPath}`);

// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

// DCO 门禁。
//
// .github/CONTRIBUTING.md 要求每个提交带 `Signed-off-by:` 行，但此前只是文档
// 约定，没有任何自动检查。一旦无签署的代码提交合入，该文件就无法再纳入
// legal/CLA.md 描述的商业 / OEM / 白标授权范围——而这种失效是静默的，
// 事后很难回溯补签。所以在 PR 阶段挡住。

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

// DCO 1.1 的签署行形如 `Signed-off-by: Name <email>`。
const SIGN_OFF_PATTERN = /^\s*Signed-off-by:\s*(.+?)\s*<([^<>\s]+)>\s*$/;

export function findDcoViolations(commits) {
  const violations = [];

  for (const commit of commits) {
    const shortSha = commit.sha.slice(0, 8);
    const authorEmail = (commit.authorEmail ?? "").trim().toLowerCase();
    const author = `${commit.authorName} <${commit.authorEmail}>`;
    const signOffEmails = (commit.message ?? "")
      .split(/\r?\n/)
      .map((line) => line.match(SIGN_OFF_PATTERN))
      .filter(Boolean)
      .map((match) => match[2].trim().toLowerCase());

    if (signOffEmails.length === 0) {
      violations.push(`${shortSha}: no "Signed-off-by:" line — author ${author}`);
      continue;
    }

    if (!signOffEmails.includes(authorEmail)) {
      violations.push(
        `${shortSha}: sign-off does not match the author — author ${author}, signed off by ${signOffEmails.join(", ")}`,
      );
    }
  }

  return violations;
}

function readCommits(base, head) {
  const shas = execFileSync("git", ["rev-list", "--no-merges", `${base}..${head}`], {
    encoding: "utf8",
  })
    .split(/\r?\n/)
    .filter(Boolean);

  return shas.map((sha) => {
    const raw = execFileSync(
      "git",
      ["show", "--no-patch", "--format=%an%x00%ae%x00%B", sha],
      { encoding: "utf8" },
    );
    const [authorName = "", authorEmail = "", message = ""] = raw.split("\0");

    return { sha, authorName, authorEmail, message };
  });
}

function parseArgs(argv) {
  const parsed = { base: undefined, head: undefined, help: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }
    if (arg === "--base") {
      parsed.base = argv.at(index + 1);
      index += 1;
      continue;
    }
    if (arg === "--head") {
      parsed.head = argv.at(index + 1);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return parsed;
}

function printUsage() {
  console.log(
    [
      "Usage:",
      "  node scripts/check-dco.mjs --base <base-sha> [--head <head-sha>]",
      "",
      "Verifies every non-merge commit in <base>..<head> carries a DCO 1.1",
      '"Signed-off-by:" line whose email matches the commit author.',
      "Requires full git history (actions/checkout with fetch-depth: 0).",
    ].join("\n"),
  );
}

function cli(argv) {
  const args = parseArgs(argv);

  if (args.help) {
    printUsage();
    return;
  }
  if (!args.base) {
    throw new Error("--base is required");
  }

  const commits = readCommits(args.base, args.head ?? "HEAD");

  if (commits.length === 0) {
    console.log("DCO check passed: no non-merge commits in range.");
    return;
  }

  const violations = findDcoViolations(commits);

  if (violations.length > 0) {
    console.error(
      [
        `DCO sign-off missing on ${violations.length} of ${commits.length} commit(s):`,
        ...violations,
        "",
        "Fix: rebase with `git rebase --signoff <base>`, or amend a single commit",
        "with `git commit --amend --signoff`, so every commit carries a",
        "Signed-off-by line matching its author. See .github/CONTRIBUTING.md.",
      ].join("\n"),
    );
    process.exit(1);
  }

  console.log(`DCO check passed: ${commits.length} commit(s) signed off.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    cli(process.argv.slice(2));
  } catch (error) {
    console.error(`[check-dco] ${error.message}`);
    process.exit(1);
  }
}

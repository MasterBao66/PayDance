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
//
// 唯一豁免是机器人开的依赖升级 PR。Dependabot 其实带 `Signed-off-by:`，但署的是
// GitHub 的 support@github.com，跟提交作者 dependabot[bot] 的 noreply 地址对不上，
// 逐提交比对必挂——而 DCO 1.1 认证的本就是自然人对自己作品的权属，机器人做不出
// 这份声明，它的提交也只重写版本号与哈希，没有可认证的著作权。豁免条件因此收到
// 最紧：PR 作者取自 GitHub 侧不可伪造的 pull_request.user.login，提交作者与改动
// 路径都必须落在下面的白名单里。人往同一分支补的提交照常要签署。

import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

// DCO 1.1 的签署行形如 `Signed-off-by: Name <email>`。
const SIGN_OFF_PATTERN = /^\s*Signed-off-by:\s*(.+?)\s*<([^<>\s]+)>\s*$/;

const BOT_EXEMPTIONS = new Map([
  [
    "dependabot[bot]",
    {
      authorEmail: /^(?:\d+\+)?dependabot\[bot\]@users\.noreply\.github\.com$/,
      // dependabot.yml 里三个 ecosystem 能碰到的全部文件，多一个路径就不豁免。
      paths: [
        /^package(?:-lock)?\.json$/,
        /^src-tauri\/Cargo\.(?:toml|lock)$/,
        /^\.github\/workflows\/[^/]+\.ya?ml$/,
      ],
    },
  ],
]);

function botExemption(prAuthor) {
  return BOT_EXEMPTIONS.get((prAuthor ?? "").trim().toLowerCase());
}

export function isBotExempt(commit, prAuthor) {
  const exemption = botExemption(prAuthor);

  if (!exemption) {
    return false;
  }
  if (!exemption.authorEmail.test((commit.authorEmail ?? "").trim().toLowerCase())) {
    return false;
  }

  const files = commit.files ?? [];

  return (
    files.length > 0 &&
    files.every((file) => exemption.paths.some((pattern) => pattern.test(file.trim())))
  );
}

export function findDcoViolations(commits, { prAuthor } = {}) {
  const exemption = botExemption(prAuthor);
  const violations = [];

  for (const commit of commits) {
    if (isBotExempt(commit, prAuthor)) {
      continue;
    }

    const shortSha = commit.sha.slice(0, 8);
    const authorEmail = (commit.authorEmail ?? "").trim().toLowerCase();
    const author = `${commit.authorName} <${commit.authorEmail}>`;

    // 机器人自己的提交越界了：签署帮不上忙，直接说清越界在哪。
    if (exemption?.authorEmail.test(authorEmail)) {
      const outside = (commit.files ?? []).filter(
        (file) => !exemption.paths.some((pattern) => pattern.test(file.trim())),
      );

      violations.push(
        `${shortSha}: bot commit reaches outside the dependency manifests, so the ${prAuthor} exemption does not apply — ${outside.join(", ") || "no file list available"}`,
      );
      continue;
    }

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
    const files = execFileSync("git", ["show", "--name-only", "--format=", sha], {
      encoding: "utf8",
    })
      .split(/\r?\n/)
      .filter(Boolean);

    return { sha, authorName, authorEmail, message, files };
  });
}

function parseArgs(argv) {
  const parsed = { base: undefined, head: undefined, prAuthor: undefined, help: false };

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
    if (arg === "--pr-author") {
      parsed.prAuthor = argv.at(index + 1);
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
      "  node scripts/check-dco.mjs --base <base-sha> [--head <head-sha>] [--pr-author <login>]",
      "",
      "Verifies every non-merge commit in <base>..<head> carries a DCO 1.1",
      '"Signed-off-by:" line whose email matches the commit author.',
      "Requires full git history (actions/checkout with fetch-depth: 0).",
      "",
      "--pr-author takes github.event.pull_request.user.login. Dependency-update",
      "commits authored by a known bot on its own pull request are exempt as long",
      "as they only touch dependency manifests.",
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

  const violations = findDcoViolations(commits, { prAuthor: args.prAuthor });

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

  const exempt = commits.filter((commit) => isBotExempt(commit, args.prAuthor));

  for (const commit of exempt) {
    console.log(
      `DCO exemption: ${commit.sha.slice(0, 8)} — ${args.prAuthor} dependency update, manifests only.`,
    );
  }

  console.log(
    exempt.length > 0
      ? `DCO check passed: ${commits.length - exempt.length} commit(s) signed off, ${exempt.length} exempt.`
      : `DCO check passed: ${commits.length} commit(s) signed off.`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    cli(process.argv.slice(2));
  } catch (error) {
    console.error(`[check-dco] ${error.message}`);
    process.exit(1);
  }
}

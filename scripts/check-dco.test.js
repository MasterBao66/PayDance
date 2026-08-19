// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { describe, expect, it } from "vitest";
import { findDcoViolations } from "./check-dco.mjs";

const commit = (overrides = {}) => ({
  sha: "0123456789abcdef0123456789abcdef01234567",
  authorName: "Contributor",
  authorEmail: "contributor@example.com",
  message: "feat: add something\n",
  ...overrides,
});

describe("DCO sign-off check", () => {
  it("accepts a commit signed off by its own author", () => {
    const commits = [
      commit({
        message:
          "feat: add something\n\nSigned-off-by: Contributor <contributor@example.com>\n",
      }),
    ];

    expect(findDcoViolations(commits)).toEqual([]);
  });

  it("ignores casing differences between the author record and the sign-off", () => {
    const commits = [
      commit({
        authorEmail: "Contributor@Example.com",
        message: "fix: x\n\nSigned-off-by: Contributor <contributor@example.com>\n",
      }),
    ];

    expect(findDcoViolations(commits)).toEqual([]);
  });

  it("accepts co-authored work as long as one sign-off matches the author", () => {
    const commits = [
      commit({
        message: [
          "feat: pair work",
          "",
          "Signed-off-by: Someone Else <someone@example.com>",
          "Signed-off-by: Contributor <contributor@example.com>",
          "",
        ].join("\n"),
      }),
    ];

    expect(findDcoViolations(commits)).toEqual([]);
  });

  it("rejects a commit with no sign-off line", () => {
    const violations = findDcoViolations([commit()]);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain("01234567");
    expect(violations[0]).toContain('no "Signed-off-by:" line');
  });

  it("rejects a sign-off that belongs to somebody other than the author", () => {
    const violations = findDcoViolations([
      commit({
        message: "feat: x\n\nSigned-off-by: Someone Else <someone@example.com>\n",
      }),
    ]);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain("does not match the author");
  });

  it("does not accept prose that merely mentions signing off", () => {
    const violations = findDcoViolations([
      commit({ message: "chore: x\n\nI forgot the Signed-off-by trailer again.\n" }),
    ]);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain('no "Signed-off-by:" line');
  });

  it("reports every offending commit rather than stopping at the first", () => {
    const violations = findDcoViolations([
      commit({ sha: "aaaaaaaa11111111111111111111111111111111" }),
      commit({ sha: "bbbbbbbb22222222222222222222222222222222" }),
    ]);

    expect(violations).toHaveLength(2);
    expect(violations[0]).toContain("aaaaaaaa");
    expect(violations[1]).toContain("bbbbbbbb");
  });
});

// 机器人开的依赖升级 PR 是 DCO 的唯一豁免口，边界写死在测试里：越界一步就必须
// 退回普通规则，否则这个口子会变成"没签署也能进 main"的通道。
const botCommit = (overrides = {}) =>
  commit({
    authorName: "dependabot[bot]",
    authorEmail: "49699333+dependabot[bot]@users.noreply.github.com",
    message: "chore(deps): bump vitest from 4.1.10 to 4.1.11\n",
    files: ["package.json", "package-lock.json"],
    ...overrides,
  });

describe("Dependabot dependency-update exemption", () => {
  it("exempts an unsigned bot commit on the bot's own pull request", () => {
    expect(findDcoViolations([botCommit()], { prAuthor: "dependabot[bot]" })).toEqual([]);
  });

  // 真实形状：Dependabot 会署 support@github.com，跟作者邮箱对不上，正是旧规则
  // 逐条挂掉它的原因。
  it("exempts the real commit shape, whose sign-off carries GitHub's address", () => {
    const commits = [
      botCommit({
        message:
          "chore(deps-dev): bump globals from 17.9.0 to 17.11.0\n\nSigned-off-by: dependabot[bot] <support@github.com>\n",
      }),
    ];

    expect(findDcoViolations(commits, { prAuthor: "dependabot[bot]" })).toEqual([]);
    expect(findDcoViolations(commits)[0]).toContain("does not match the author");
  });

  it("exempts Cargo and workflow updates from the other two ecosystems", () => {
    const commits = [
      botCommit({ files: ["src-tauri/Cargo.toml", "src-tauri/Cargo.lock"] }),
      botCommit({ files: [".github/workflows/codeql.yml"] }),
    ];

    expect(findDcoViolations(commits, { prAuthor: "dependabot[bot]" })).toEqual([]);
  });

  // 分组配置变了也不该影响豁免：一条提交同时碰多个 ecosystem 的清单照样放行。
  it("exempts one commit that spans all three ecosystems", () => {
    const commits = [
      botCommit({
        files: [
          "package.json",
          "package-lock.json",
          "src-tauri/Cargo.toml",
          "src-tauri/Cargo.lock",
          ".github/workflows/ci.yml",
        ],
      }),
    ];

    expect(findDcoViolations(commits, { prAuthor: "dependabot[bot]" })).toEqual([]);
  });

  it("rejects a forged bot author on somebody else's pull request", () => {
    const violations = findDcoViolations([botCommit()], { prAuthor: "outside-user" });

    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain('no "Signed-off-by:" line');
  });

  it("rejects a bot commit that reaches outside the dependency manifests", () => {
    const violations = findDcoViolations(
      [botCommit({ files: ["package.json", "src/App.vue"] })],
      { prAuthor: "dependabot[bot]" },
    );

    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain("outside the dependency manifests");
    expect(violations[0]).toContain("src/App.vue");
  });

  it("rejects a bot commit whose file list could not be read", () => {
    const violations = findDcoViolations([botCommit({ files: [] })], {
      prAuthor: "dependabot[bot]",
    });

    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain("outside the dependency manifests");
  });

  it("still requires a sign-off from a person pushing to the bot's branch", () => {
    const violations = findDcoViolations(
      [botCommit(), commit({ sha: "cccccccc33333333333333333333333333333333" })],
      { prAuthor: "dependabot[bot]" },
    );

    expect(violations).toHaveLength(1);
    expect(violations[0]).toContain("cccccccc");
    expect(violations[0]).toContain('no "Signed-off-by:" line');
  });

  it("keeps the exemption closed when no pull-request author is supplied", () => {
    expect(findDcoViolations([botCommit()])).toHaveLength(1);
  });
});

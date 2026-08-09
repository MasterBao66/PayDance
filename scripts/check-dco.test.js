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

// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import vue from "eslint-plugin-vue";
import vueA11y from "eslint-plugin-vuejs-accessibility";
import tseslint from "typescript-eslint";

export default [
  {
    // ESLint 不读 .gitignore，根目录下的构建产物、临时 clone 与 git worktree
    // 会被一并 lint，需要在这里与 .gitignore 保持一致。
    ignores: [
      "dist/**",
      "node_modules/**",
      "release-assets/**",
      "src-tauri/target/**",
      "src-tauri/gen/**",
      ".tools/**",
      ".claude/**",
      ".playwright-cli/**",
      ".vercel/**",
      ".worktrees/**",
      "output/**",
      "tmp/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs["flat/recommended"],
  ...vueA11y.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        parser: tseslint.parser,
        sourceType: "module",
      },
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "vuejs-accessibility/click-events-have-key-events": "warn",
      "vuejs-accessibility/no-static-element-interactions": "warn",
    },
  },
  prettier,
];

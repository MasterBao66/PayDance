// SPDX-FileCopyrightText: 2026 Mr.Baoboer
// SPDX-License-Identifier: AGPL-3.0-only
//
// Additional terms: see /legal/ADDITIONAL_TERMS.md

import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import { createWebSeoPlugin, resolveBuildDate } from "./scripts/web-seo.mjs";

const packageMetadata = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as { version: string };
const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ mode }) => {
  const isWeb = mode === "web";
  const dateModified = resolveBuildDate();
  const webBase =
    process.env.PAYDANCE_WEB_BASE ?? (process.env.VERCEL ? "/" : "/PayDance/");

  return {
    base: isWeb ? webBase : "./",
    define: {
      __PAYDANCE_VERSION__: JSON.stringify(packageMetadata.version),
    },
    plugins: [
      createWebSeoPlugin({
        dateModified,
        emitSitemap: isWeb,
        version: packageMetadata.version,
      }),
      vue(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        "#opener": fileURLToPath(
          new URL(
            isWeb ? "./src/platform/opener.web.ts" : "./src/platform/opener.ts",
            import.meta.url,
          ),
        ),
        "#runtime-app": fileURLToPath(
          new URL(
            isWeb ? "./src/WebPreviewApp.vue" : "./src/DesktopApp.vue",
            import.meta.url,
          ),
        ),
        "#settings-store": fileURLToPath(
          new URL(
            isWeb
              ? "./src/platform/settings-store.web.ts"
              : "./src/platform/settings-store.ts",
            import.meta.url,
          ),
        ),
        "#updater": fileURLToPath(
          new URL(
            isWeb ? "./src/platform/updater.web.ts" : "./src/platform/updater.ts",
            import.meta.url,
          ),
        ),
      },
    },
    clearScreen: false,
    optimizeDeps: {
      entries: isWeb ? ["index.html", "en/index.html"] : ["index.html"],
    },
    build: {
      rolldownOptions: {
        ...(isWeb
          ? {
              input: {
                main: resolve(projectRoot, "index.html"),
                en: resolve(projectRoot, "en/index.html"),
              },
            }
          : {}),
        checks: {
          pluginTimings: false,
        },
      },
    },
    server: {
      strictPort: true,
      port: 1420,
      host: "127.0.0.1",
      watch: {
        ignored: ["**/src-tauri/target/**"],
      },
    },
    test: {
      // 白名单而非黑名单：只发现仓库自身的测试。
      // 根目录下的 git worktree 与临时 clone（.worktrees/、tmp/）都带着各自的
      // *.test.* 文件，vitest 不读 .gitignore，靠 exclude 补漏永远补不完。
      include: [
        "src/**/*.test.{ts,js}",
        "scripts/**/*.test.{ts,js}",
        "src-tauri/*.test.{ts,js}",
      ],
    },
  };
});

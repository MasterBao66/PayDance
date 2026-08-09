# Web Preview QA

> [中文版 →](web-preview-qa.md)

The Web Preview QA flow checks that the storefront works in a real browser: the page renders, theme and language switching work, key copy is present, and primary layout bounds stay inside the viewport.

Headless Chrome, CDP, and command-line screenshots do not replace this flow: they have returned all-white captures while exiting successfully, so they are not a reliable release signal.

## Validation Flow

1. Start the local Web Preview dev server and record the local URL.
2. Open the page with the Playwright devDependency owned by this project; for special debugging environments, `PLAYWRIGHT_NODE_MODULES` can point to an external `node_modules`.
3. Capture fixed viewports in both light and dark themes: desktop `1440x900`, medium `960x760`, and mobile `390x844`.
4. Check the DOM: the page title, `Web Preview · appVersion`, software preview area, and mobile layout must remain present and stable.
5. Run the real language-switching path: for local and GitHub Pages mirror QA, open `/PayDance/`, click `Switch to English`, and confirm navigation to `/PayDance/en/` with `data-locale="en"`; for the Vercel primary site smoke test, confirm the same language state through `/` and `/en/`. At both entries, check the page title, canonical URL, reciprocal `zh-CN` / `en` / `x-default` hreflang links, and JSON-LD language and build date.
6. Use `@axe-core/playwright` for serious automated accessibility findings. This is not a full WCAG compliance claim.
7. Collect console errors and page errors, and confirm there are no severe errors.
8. Save screenshots and `summary.json` to a per-run directory under the system temp directory: `paydance-web-preview-qa-{version}-{commit}-{timestamp}`, rooted at `%LOCALAPPDATA%\Temp` locally and at `RUNNER_TEMP` in CI.
9. Compare four canonical visual states: desktop and mobile for Chinese light mode and English dark mode.
10. Stop the local service after validation so the port is not left occupied.

## Command

```powershell
npm run qa:web-preview
```

Update baselines only after confirming that the visual change is intentional:

```powershell
npm run qa:web-preview:update
```

Normal QA never accepts new screenshots automatically. On a mismatch, the temporary evidence directory keeps the expected, actual, and diff images. `summary.json` records the run id, commit, current Chinese/English copy, screenshot paths, and visual comparison results.

## Passing Criteria

- All three viewports have non-empty screenshots, with no overlapping text, overflowing buttons, or collapsed main content.
- Chinese and English copy is read from the current DOM, not inferred from an old screenshot.
- After entering in Chinese and clicking EN, the mirror path must become `/PayDance/en/`, the Vercel primary path must become `/en/`, and the root `data-locale` must become `en`.
- Both entries must expose language-specific titles, canonicals, hreflang links, and JSON-LD.
- There are no critical/serious axe automated accessibility violations.
- After light/dark theme switching, the preview window edge has no obvious flash, color mismatch, or residue.
- `summary.json` contains no severe console error or page error.
- Canonical states ignore minor antialiasing noise and may differ from reviewed baselines by no more than `0.5%` of pixels; expected, actual, and diff images are retained on failure.
- The local dev server exits after validation.

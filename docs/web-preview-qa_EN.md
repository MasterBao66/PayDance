# Web Preview QA

> [中文版 →](web-preview-qa.md)

Web Preview QA validates the content, layout, themes, languages, accessibility, and visual baselines of the showcase site. `npm run qa:web-preview` starts a local Vite server and uses Playwright Chromium. The default URL is `http://127.0.0.1:4174/PayDance/`, and the script stops the server when it finishes.

Do not replace this workflow with ad hoc headless Chrome, CDP, or command-line screenshots: the script runs on headless Chromium too, but also asserts DOM, interaction, accessibility, console, and pixel-difference results.

## Coverage

The script walks all 12 combinations of:

- Chinese and English.
- Light and dark themes.
- `1440x900`, `960x760`, and `390x844` viewports.

Each combination checks:

- The page title, canonical URL, `zh-CN` / `en` / `x-default` hreflang links, and JSON-LD.
- Version, locale state, core copy, download action, software preview, and feature descriptions.
- Key elements for overflow, overlap, unexpected wrapping, and vertical misalignment.
- Stable first theme paint and consistent preview-window edges through repeated theme changes.
- Critical or serious accessibility findings from `@axe-core/playwright`.
- Browser console errors and page errors; any such error fails the run.

Outside those combinations, the script also runs one check of real mobile navigation from Chinese `/PayDance/` to English `/PayDance/en/`.

Local and GitHub Pages routes use `/PayDance/` for Chinese and `/PayDance/en/` for English. The Vercel primary site uses `/` and `/en/`. This command accesses only the local server and does not validate either deployed site.

## Run

On the first run, install dependencies and Chromium:

```powershell
npm ci
npx playwright install chromium
```

The script prefers Playwright from the project's `node_modules`. Use `PLAYWRIGHT_NODE_MODULES` to select another `node_modules` only when diagnosing an external runtime.

Run QA:

```powershell
npm run qa:web-preview
```

If the default port is occupied, select another one for the run:

```powershell
$env:PAYDANCE_WEB_QA_PORT = 4175
npm run qa:web-preview
```

## Visual Baselines

Pixel comparison covers four fixed states:

- Chinese light mode on desktop and mobile.
- English dark mode on desktop and mobile.

Minor antialiasing differences are ignored; more than `0.5%` changed pixels fails the run. Baselines live in `tests/visual-baselines/`; update them only after confirming that the visual change is intentional, and commit them with the change:

```powershell
npm run qa:web-preview:update
```

## Result Files

Screenshots are stored in a per-run directory under the system temporary directory, typically `%LOCALAPPDATA%\Temp` on Windows and `RUNNER_TEMP` in CI:

```text
paydance-web-preview-qa-{version}-{commit}-{timestamp}
```

On success the script prints the full path of that directory, and `summary.json` in the same directory records the version, commit, local URL, observed Chinese and English page copy, screenshot paths, and visual comparisons. When a visual comparison fails, the error message gives the full expected, actual, and diff image paths.

## Passing Criteria

`npm run qa:web-preview` passes only when it exits 0. A failed assertion prints the reason together with the case it came from, then exits non-zero.

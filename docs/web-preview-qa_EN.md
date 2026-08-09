# Web Preview QA

> [中文版 →](web-preview-qa.md)

Web Preview QA validates the website showcase's content, layout, themes, languages, accessibility, and visual baselines. `npm run qa:web-preview` starts a local Vite server and uses Playwright Chromium. The default URL is `http://127.0.0.1:4174/PayDance/`, and the script stops the server when it finishes.

Do not replace this workflow with ad hoc headless Chrome, CDP, or command-line screenshots. The repository script does use headless Chromium, but also runs DOM, interaction, accessibility, console, and pixel-difference assertions.

## Coverage

The script validates every combination of:

- Chinese and English.
- Light and dark themes.
- `1440x900`, `960x760`, and `390x844` viewports.
- Real mobile navigation from Chinese `/PayDance/` to English `/PayDance/en/`.

Each combination checks:

- The page title, canonical URL, `zh-CN` / `en` / `x-default` hreflang links, and JSON-LD.
- Version, locale state, core copy, download action, software preview, and feature descriptions.
- Key elements for overflow, overlap, unexpected wrapping, and vertical misalignment.
- Stable first theme paint and consistent preview-window edges through repeated theme changes.
- Critical or serious accessibility findings from `@axe-core/playwright`.
- Browser console errors and page errors; any such error fails the run.

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

Minor antialiasing differences are ignored; more than `0.5%` changed pixels fails the run. Update baselines only after confirming that the visual change is intentional:

```powershell
npm run qa:web-preview:update
```

Normal QA never accepts new screenshots automatically.

## Result Files

Screenshots are stored in a per-run directory under the system temporary directory, typically `%LOCALAPPDATA%\Temp` on Windows and `RUNNER_TEMP` in CI:

```text
paydance-web-preview-qa-{version}-{commit}-{timestamp}
```

On success, `summary.json` in the same directory records the version, commit, local URL, observed Chinese and English page copy, screenshot paths, and visual comparisons. A failed visual comparison retains the expected, actual, and diff images.

## Passing Criteria

- All 12 locale, theme, and viewport combinations plus the language-switch flow complete.
- DOM, SEO, layout, theme-switching, and accessibility checks pass.
- Each of the four fixed visual states stays within the `0.5%` pixel-difference budget.
- There are no console errors or page errors.
- The local server exits when the script finishes.

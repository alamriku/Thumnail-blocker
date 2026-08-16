<img src="src/assets/img/icon-128.png" width="64"/>

# Thumb Blocker

Hide YouTube thumbnails so you choose what to watch by **title**, not by clickbait imagery. A toggle sits right in the YouTube top bar — flip it any time.

### 👉 [Install from the Chrome Web Store](https://chromewebstore.google.com/detail/thumb-blocker/anhgkgicmobhfkigcljmdhpkigfcplam)
### 🦊 Firefox Add-on — _coming soon (submitted to AMO)_

Same code, two stores. See [Building for Firefox](#building-for-firefox).

---

## Why

Thumbnails are engineered to hijack attention — shock faces, red arrows, fake progress bars. Removing them turns YouTube back into a text-first list, so you browse deliberately instead of reactively.

## Features

- **In-page toggle** injected into the YouTube masthead (Enabled / Disabled), state saved in `localStorage`.
- Works across the whole site — Home, Search, Watch sidebar, Subscriptions, Shorts.
- **Zero layout jank.** Thumbnails are hidden with `visibility: hidden` (a paint-only change) instead of `display: none`, so the video grid keeps its shape and never reflows.
- Survives YouTube's SPA navigation and lazy-loaded thumbnails with no scroll listeners or per-node observers.

## How it works

Blocking is **CSS-driven**, not JavaScript-driven:

1. The content script's only job is to toggle a single class — `thumb-blocker-on` — on the `<html>` element, based on the stored on/off state (`src/pages/helper.ts` → `setBlockerClass`).
2. All hiding lives in `content.styles.css`, gated behind `html.thumb-blocker-on`. The browser's style engine then hides every current *and future* thumbnail automatically — no `MutationObserver`, no `scroll` handler, no `querySelectorAll` loops.
3. Flipping the masthead toggle adds/removes the class live — no page reload.

That's why it's cheap: adding/removing one class triggers a repaint, not a full relayout + re-render of the feed.

### Key files

| File | Role |
| --- | --- |
| `src/pages/Content/index.tsx` | Content-script entry — applies stored state to `<html>`, injects the toggle into the masthead |
| `src/pages/Content/App.tsx` | React shell for the toggle |
| `src/pages/Content/modules/thumbnail-hider.tsx` | The `<Youtube/>` toggle component + `localStorage` state |
| `src/pages/Content/content.styles.css` | The actual hide rules (per-surface selectors) |
| `src/pages/helper.ts` | `setBlockerClass()` — toggles the `thumb-blocker-on` root class |
| `src/manifest.json` | MV3 manifest (Chrome) — `background.service_worker`, matches `*://*.youtube.com/*` |
| `src/manifest.firefox.json` | MV3 manifest (Firefox) — `background.scripts` + `browser_specific_settings.gecko` |

## Keeping up with YouTube's UI changes

YouTube periodically renames its thumbnail DOM elements, which is what breaks selector-based blockers. When thumbnails start leaking through, add the new selector to `content.styles.css`. Current coverage includes:

- Legacy grid: `ytd-thumbnail`, `ytd-playlist-thumbnail`
- New view-model UI (2024+): `yt-thumbnail-view-model`, `yt-collection-thumbnail-view-model`, `.ytThumbnailViewModelImage`
- Shorts: `ytm-shorts-lockup-view-model`
- Inline hover preview: `ytd-video-preview`, `#video-preview`

To find a new one: right-click a leaking thumbnail → Inspect → find the nearest custom element wrapping the `<img>` → add it under the `html.thumb-blocker-on ... img` group.

## Development

Built on [chrome-extension-boilerplate-react](https://github.com/lxieyang/chrome-extension-boilerplate-react) (React 17 + TypeScript + Webpack 5, Manifest V3).

A single source tree builds for **both** Chrome and Firefox — only the manifest differs (`background.service_worker` vs `background.scripts`, plus Firefox's `gecko` id). Fix a bug once, rebuild both.

```bash
npm install
npm run build          # Chrome  → build/
npm run build:firefox  # Firefox → build-firefox/
```

Then load it in Chrome:

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. **Load unpacked** → select the **`build/`** folder (not `src/`).

> **Note:** always load `build/`. `src/` has no compiled bundles and no `version`, so Chrome rejects it with *"Required value 'version' is missing"*.

### Building for Firefox

```bash
npm run build:firefox                          # → build-firefox/
npx web-ext lint --source-dir=build-firefox    # catch AMO issues before submitting
```

Load it temporarily for testing:

1. Open `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on…** → select `build-firefox/manifest.json`

To publish, zip the build **contents** (not the folder) and upload at [addons.mozilla.org](https://addons.mozilla.org):

```bash
cd build-firefox && zip -r ../thumb-blocker-firefox.zip . && cd ..
```

### Toolchain notes (Node 18+)

- The manifest's icons and `version` are injected/copied by the webpack build — that's why `src/` alone won't load.
- If the build reports an OpenSSL error on newer Node, prefix with `NODE_OPTIONS=--openssl-legacy-provider`.
- `node-sass` (a legacy native dep) doesn't compile on Node 20+. There are no `.scss` files, so install with `npm install --ignore-scripts`, or swap `node-sass` → `sass` in `package.json`.

## License

MIT — see [LICENSE](./LICENSE).

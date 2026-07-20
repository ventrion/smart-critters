# Research: SvelteKit static app → GitHub Pages → installable PWA on Android

**Ticket:** [Research SvelteKit static GitHub Pages PWA on Android](https://github.com/ventrion/smart-critters/issues/19)  
**Map:** [Smart Critters: first usable PoC definition](https://github.com/ventrion/smart-critters/issues/18)  
**Date:** 2026-07-21  
**Branch:** `research/sveltekit-gh-pages-pwa-android`

## Question

What are the concrete constraints and recommended setup for shipping a SvelteKit static app to GitHub Pages as an installable PWA on Android tablets (Add to Home Screen): adapter/config, service worker/offline expectations for local-first Training + Content Packs, known Android Chrome limitations we must accept for the PoC, and a minimal checklist so the PoC definition can require “works as a homescreen PWA on our Android tablets”?

## Verdict (short)

Ship with `@sveltejs/adapter-static`, project-site `paths.base`, GitHub Actions Pages deploy, a linked web app manifest (`standalone`, icons, `start_url` under the base path), and a real SvelteKit service worker that precaches the app shell and supports caching/serving Content Pack assets offline. Treat first-visit install as online-required; store Training progress / packs in IndexedDB (or Cache Storage for pack files); accept Chrome’s install-UI variance, WebAPK-vs-shortcut fallback, and non-guaranteed persistent storage unless granted. PoC success = installable + launchable standalone + Training runnable offline after packs are cached on-device.

---

## 1. Recommended adapter and GitHub Pages config

### Adapter

Use **`@sveltejs/adapter-static`** so the entire site is prerendered to static files. GitHub Pages is a static host only (no server-side languages). ([SvelteKit adapter-static](https://svelte.dev/docs/kit/adapter-static); [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages); [Creating a Pages site — static generators](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site))

Minimum SvelteKit pieces:

| Piece | Recommendation | Why |
| --- | --- | --- |
| Adapter | `@sveltejs/adapter-static` with defaults (`pages`/`assets`: `build`) | Official SSG path for static hosts ([adapter-static](https://svelte.dev/docs/kit/adapter-static)) |
| Root layout | `export const prerender = true` | Required so routes emit HTML ([adapter-static](https://svelte.dev/docs/kit/adapter-static)) |
| SSR | Do **not** set `ssr = false` for prerendered pages | Otherwise prerender writes an empty shell ([adapter-static](https://svelte.dev/docs/kit/adapter-static)) |
| SPA fallback | Prefer full prerender; if client-only routes are needed, `fallback: '404.html'` for GH Pages | Official GH Pages note: generate a `404.html` fallback to replace the default 404 ([adapter-static — GitHub Pages](https://svelte.dev/docs/kit/adapter-static)); SPA mode has large perf/SEO costs and is discouraged when all pages can be prerendered ([Single-page apps](https://svelte.dev/docs/kit/single-page-apps)) |
| Trailing slash | Set `trailingSlash` appropriately for the host (often `'always'` → `/route/index.html`) | Hosts that do not serve `/a.html` for `/a` need directory-style output ([adapter-static](https://svelte.dev/docs/kit/adapter-static)) |

Avoid `kit.paths.assets` if you use a service worker: SvelteKit’s `$service-worker` module has `base` but **no `assets`**, and **service workers cannot be used if `config.kit.paths.assets` is specified**. ([`$service-worker`](https://svelte.dev/docs/kit/$service-worker))

### Project site base path

`ventrion/smart-critters` is a **project site**, served at `https://<owner>.github.io/<repository>/`, not at the domain root. ([About GitHub Pages — site types](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages))

SvelteKit’s official GitHub Pages guidance:

1. Set `kit.paths.base` to the repo name (e.g. `/smart-critters`) when not building a `*.github.io` user/org site. ([adapter-static — GitHub Pages](https://svelte.dev/docs/kit/adapter-static))
2. Typical pattern from the docs: empty base in local `dev`, production base from env (e.g. `BASE_PATH` = `/smart-critters`). ([adapter-static — GitHub Pages](https://svelte.dev/docs/kit/adapter-static))
3. Prefix app-internal links with `base` from `$app/paths`.
4. Deploy via GitHub Actions (`actions/upload-pages-artifact` + `actions/deploy-pages`), setting `BASE_PATH` at build time. ([adapter-static — GitHub Pages](https://svelte.dev/docs/kit/adapter-static))
5. If not using Actions artifact deploy and Jekyll would run, add an empty `static/.nojekyll` so underscore dirs (e.g. `_app`) are not ignored. ([adapter-static — GitHub Pages](https://svelte.dev/docs/kit/adapter-static); [Creating a Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site))

Example shape (from official docs, adapted):

```js
// svelte.config.js (conceptual)
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // Prefer prerender-everything; use fallback: '404.html' only if needed for GH Pages SPA routes
      fallback: '404.html'
    }),
    paths: {
      base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
    }
  }
};

export default config;
```

### HTTPS and public hosting

- `github.io` Pages sites created after 2016-06-15 are served over HTTPS automatically; HTTPS can be enforced in repo Settings → Pages. ([Securing GitHub Pages with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https))
- Installability requires HTTPS (or localhost). ([MDN: Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable); [web.dev install criteria](https://web.dev/articles/install-criteria))
- Pages sites are **publicly available on the internet**, even if the source repo is private (plan-dependent). Do not put secrets or private child data in the published site. ([Creating a Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site); [HTTPS docs warning](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https))

### Soft limits (PoC awareness)

Published site ≤ **1 GB**; soft bandwidth **~100 GB/month**; deployments timeout after **10 minutes**. ([GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits))

For the PoC, keep seeded Content Packs small enough that the published site stays well under 1 GB; prefer downloading/caching packs into device storage rather than bloating every deploy if packs grow later.

---

## 2. PWA installability (Android Chrome)

### Manifest (required for a proper installable PWA)

Serve a web app manifest and link it from HTML (`<link rel="manifest" href="...">`) on pages where install should be offered. ([web.dev: Web app manifest](https://web.dev/learn/pwa/web-app-manifest); [MDN: Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable))

Chromium / Chrome criteria commonly cited for install promotion / `beforeinstallprompt`:

| Field | Requirement |
| --- | --- |
| `name` or `short_name` | Present |
| `icons` | Include **192px** and **512px** |
| `start_url` | Present (for project Pages, include the base path, e.g. `/smart-critters/`) |
| `display` | One of `fullscreen`, `standalone`, `minimal-ui`, or `window-controls-overlay` — **prefer `standalone` for tablet “app” feel** |
| `prefer_related_applications` | Absent or `false` |

Sources: [web.dev install criteria](https://web.dev/articles/install-criteria); [MDN required members](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable); [web.dev manifest fields](https://web.dev/learn/pwa/web-app-manifest).

Strongly recommended (not always hard requirements):

- Maskable icon (`purpose: "maskable"`) for Android adaptive icons ([web.dev manifest — maskable icons](https://web.dev/learn/pwa/web-app-manifest))
- `theme_color`, `background_color` (Android splash uses theme/background/icon) ([web.dev manifest](https://web.dev/learn/pwa/web-app-manifest))
- Stable manifest `id` so future `start_url` tweaks do not look like a different app ([web.dev manifest — `id`](https://web.dev/learn/pwa/web-app-manifest))
- `scope` under the Pages base path so deep links stay in the PWA window ([web.dev manifest — `scope`](https://web.dev/learn/pwa/web-app-manifest))
- Optional richer install UI on Android: `description` + `screenshots` ([web.dev manifest — promotional fields](https://web.dev/learn/pwa/web-app-manifest); [Chrome “What’s new for web on Android 2023”](https://developer.chrome.com/blog/whats-new-in-web-on-android-io2023))

### Service worker vs install

Chrome **removed** the requirement that a service worker implement `fetch()` for **Install / Add to Home Screen from the menu** (Chrome **108** on mobile). Empty fetch handlers are skipped. Chrome shows a **default offline page** (icon + “You are offline”) from Chrome **109** on Android if the app does not provide a custom offline experience. ([Chrome: Revisiting installability criteria](https://developer.chrome.com/blog/update-install-criteria); [Chrome: Basic offline page](https://developer.chrome.com/blog/default-offline); [Chrome: What’s new for web on Android 2023](https://developer.chrome.com/blog/whats-new-in-web-on-android-io2023))

**PoC implication:** Install can succeed without a custom offline SW — but **local-first Training + Content Packs still require a real caching strategy**. Do not rely on Chrome’s default offline page as “offline Training works.”

Current [web.dev install criteria](https://web.dev/articles/install-criteria) list for Chrome install promotion / `beforeinstallprompt` emphasizes HTTPS, engagement heuristics, and manifest fields (and no longer lists a fetch handler). An earlier Chrome blog still noted that the **prompt algorithm** historically retained a fetch-handler signal while experiments continued ([update-install-criteria](https://developer.chrome.com/blog/update-install-criteria)). For the PoC, implement a proper SW with a fetch handler anyway — it is needed for offline Training and is the robust path across Chrome versions.

Engagement heuristics for the automatic prompt (Chrome): user has interacted at least once and spent ≥ ~30 seconds on the page (can be across visits). ([web.dev install criteria](https://web.dev/articles/install-criteria)) Manual **Install / Add to Home Screen** from the browser menu remains available even when criteria for promotion are not met. ([web.dev install criteria](https://web.dev/articles/install-criteria); [web.dev installation](https://web.dev/learn/pwa/installation))

---

## 3. Service worker and offline expectations (local-first Training + Content Packs)

### SvelteKit built-in SW

If `src/service-worker.js` (or `src/service-worker/index.js`) exists, SvelteKit bundles and auto-registers it. Inside the worker, `$service-worker` exposes:

- `base` — deployment subdirectory (critical for GitHub Pages project sites)
- `build` — Vite-generated assets (empty in dev)
- `files` — `static/` files (filterable via `kit.serviceWorker.files`)
- `prerendered` — prerendered pathnames (empty in dev)
- `version` — for cache-name invalidation on deploy

Official example pattern: precache `build` + `files` (+ typically `prerendered`) on `install`; network-first or cache-on-success for other requests; fall back to cache when offline. ([SvelteKit service workers](https://svelte.dev/docs/kit/service-workers); [`$service-worker`](https://svelte.dev/docs/kit/$service-worker))

SvelteKit notes:

- Client-side navigations alone do **not** check for a new SW; call `registration.update()` (e.g. in `afterNavigate`) if eager updates matter. ([Service workers — Updating](https://svelte.dev/docs/kit/service-workers))
- Be careful caching large assets; browsers may empty caches under pressure. ([Service workers](https://svelte.dev/docs/kit/service-workers))
- Alternative: Vite PWA / Workbox if preferred. ([Service workers — Other solutions](https://svelte.dev/docs/kit/service-workers))

### Split storage for Smart Critters domain

Align with [web.dev Offline data](https://web.dev/learn/pwa/offline-data) / [Caching](https://web.dev/learn/pwa/caching):

| Data | Suggested API | Role |
| --- | --- | --- |
| App shell (HTML/JS/CSS, chrome, Cara stills shipped with the app) | Cache Storage via SW precache (`build` / `files` / `prerendered`) | Launch and navigate offline after first successful visit |
| Content Packs (versioned bundles of Items / assets) | Cache Storage and/or IndexedDB / OPFS after explicit fetch | Offline Training content; not regenerated on device ([CONTEXT.md](../../CONTEXT.md)) |
| Session results, thin XP, grade picker prefs | IndexedDB (or similar structured store) | Local-first progress per install |

Storage is **per origin**, shared across all apps on that origin — do not host multiple unrelated PWAs on the same origin without prefixes. ([web.dev Offline data](https://web.dev/learn/pwa/offline-data); [web.dev Caching](https://web.dev/learn/pwa/caching))

Chrome quota (order of magnitude): browser up to ~80% of disk; an origin up to ~60% of disk; use `navigator.storage.estimate()`. Default storage is “best effort” and may be evicted under pressure unless `navigator.storage.persist()` is granted; Chrome may grant persistence more readily for **installed** PWAs. Users can always clear site data. ([web.dev Offline data](https://web.dev/learn/pwa/offline-data); [web.dev Storage for the web](https://web.dev/articles/storage-for-the-web))

### Offline expectations the PoC should set

**Accept for PoC:**

1. **First open needs network** — SW install + precache (and first Content Pack download) require connectivity. ([web.dev service workers](https://web.dev/learn/pwa/service-workers))
2. **“Offline Training” means after packs are on-device** — not zero-network from a cold install.
3. **Default Chrome offline page ≠ product offline** — without a custom SW cache, Android Chrome 109+ only shows a generic offline screen. ([Chrome default offline](https://developer.chrome.com/blog/default-offline))
4. **Update lag** — a waiting SW typically activates after all controlled tabs/windows close unless you opt into skipWaiting/clients.claim patterns. ([SvelteKit service workers](https://svelte.dev/docs/kit/service-workers); [web.dev service workers](https://web.dev/learn/pwa/service-workers))
5. **No backend** — progress sync, auth, and server APIs are out of scope on Pages. ([GitHub Pages limits / purpose](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits))

**Require for PoC “local-first” bar:**

1. Precache (or otherwise cache) the Training shell so the installed app opens offline.
2. After a Content Pack has been fetched once, a Session for that pack can run offline (Items + scoring + XP write locally).
3. Clear statement in the PoC definition that **online is required for first install / pack acquisition / app updates**, not for every Session.

---

## 4. Android Chrome limitations to accept for the PoC

| Limitation | Detail | Source |
| --- | --- | --- |
| Install UI wording varies | Menu may say **Install** or **Add to Home Screen**; dialogs vary by device/browser | [web.dev installation — Android](https://web.dev/learn/pwa/installation) |
| WebAPK vs shortcut | Chrome + GMS usually mints a **WebAPK** (launcher + Settings entry). If minting fails or criteria fail, fallback is a **home-screen shortcut** (browser-badged icon, weaker OS integration). PoC should accept either if Training still works. | [web.dev installation — WebAPKs / Shortcuts](https://web.dev/learn/pwa/installation) |
| No store packaging required | Browser install needs no APK from us; Play Store / Capacitor is a later option | [web.dev installation](https://web.dev/learn/pwa/installation); map Notes on Capacitor |
| Automatic install prompt heuristics | May need ~30s engagement + a tap before Chrome promotes install; menu install still usable | [web.dev install criteria](https://web.dev/articles/install-criteria) |
| `beforeinstallprompt` optional | Useful for in-app “Install” CTA; not required if testers use Chrome’s menu | [MDN Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) |
| Default offline is not Training | Without our SW/caches, offline = Chrome stub page | [Chrome default offline](https://developer.chrome.com/blog/default-offline) |
| Storage eviction possible | Best-effort caches/IDB may be cleared under device pressure unless persistent storage granted; user clear always wins | [web.dev Offline data](https://web.dev/learn/pwa/offline-data) |
| Subpath SW scope | Project Pages live under `/smart-critters/`; SW and manifest `scope`/`start_url` must match that subdirectory | [adapter-static GH Pages](https://svelte.dev/docs/kit/adapter-static); [web.dev service workers — scope](https://web.dev/learn/pwa/service-workers); [`$service-worker` base](https://svelte.dev/docs/kit/$service-worker) |
| Public site | Anyone with the URL can load the PoC; no private hosting on Pages | [GitHub Pages docs](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) |
| iOS out of PoC focus | Different install path (Share → Add to Home Screen); Android-primary per map | [web.dev installation — iOS](https://web.dev/learn/pwa/installation) |

---

## 5. Minimal checklist for PoC definition

Use this as the acceptance bar for: **“works as a homescreen PWA on our Android tablets.”**

### Build / host

- [ ] `@sveltejs/adapter-static` + root `prerender = true`
- [ ] `paths.base` set to `/smart-critters` (or env-driven) for production Pages builds
- [ ] Links/assets use `$app/paths` `base` correctly
- [ ] Deployed via GitHub Actions Pages (or equivalent) over **HTTPS** on `*.github.io`
- [ ] `.nojekyll` present if Jekyll would strip `_app` (when applicable)
- [ ] `404.html` fallback only if non-prerendered client routes are required

### Manifest / install

- [ ] Manifest linked from app HTML
- [ ] `name`/`short_name`, `start_url`, `display: "standalone"` (or equivalent installable display), 192 + 512 icons
- [ ] Prefer maskable icon + `theme_color` / `background_color`
- [ ] `start_url` and `scope` include the Pages base path
- [ ] On target Android tablet Chrome: **Install / Add to Home Screen** succeeds
- [ ] Relaunch from home screen / launcher opens **standalone** (no full browser chrome)

### Offline / local-first

- [ ] SvelteKit `src/service-worker` (or equivalent) with a real fetch handler; precaches shell assets using `$service-worker` lists and respects `base`
- [ ] After one online visit that caches the shell + at least one Content Pack: **airplane mode / offline** still allows starting that pack’s Training Session, answering Items, and persisting XP locally
- [ ] Cold install / first pack download documented as **online-required**
- [ ] No dependency on live/on-device content generation

### Manual tablet smoke (definition of done)

1. Open the Pages URL in Chrome on the PoC Android tablet (online).
2. Install via Chrome menu (or in-app prompt if implemented).
3. Launch from home screen; confirm standalone window and correct start route.
4. Complete one Training Session online; confirm XP/progress persists after relaunch.
5. Enable offline; relaunch from home screen; complete (or resume) a Session using an already-cached Content Pack.
6. Re-enable network; reload/update path does not brick the install (smoke only).

If steps 2–5 pass on the author’s tablets, the PoC definition may require the homescreen-PWA bar.

---

## 6. Recommended setup summary (decision-ready)

| Concern | Recommendation for Smart Critters PoC |
| --- | --- |
| Adapter | `@sveltejs/adapter-static`, prerender all PoC routes |
| Host | GitHub Pages project site + Actions deploy |
| Base path | `/smart-critters` in production builds |
| PWA surface | Web app manifest (`standalone`) + SvelteKit service worker |
| Offline model | Precache shell; cache Content Packs on acquire; IDB for XP/progress |
| Install UX | Chrome menu Install/A2HS is enough for PoC; richer prompt optional |
| Accept | First-run online; WebAPK-or-shortcut; possible storage eviction; public URL |
| Out of PoC | Capacitor/Play packaging, push, background sync, multi-origin CDNs |

---

## Sources (primary)

1. [SvelteKit — Static site generation (`adapter-static`)](https://svelte.dev/docs/kit/adapter-static) including GitHub Pages section  
2. [SvelteKit — Service workers](https://svelte.dev/docs/kit/service-workers)  
3. [SvelteKit — `$service-worker`](https://svelte.dev/docs/kit/$service-worker)  
4. [SvelteKit — Single-page apps](https://svelte.dev/docs/kit/single-page-apps)  
5. [GitHub Docs — About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages)  
6. [GitHub Docs — Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)  
7. [GitHub Docs — Securing your GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)  
8. [GitHub Docs — GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)  
9. [web.dev — Learn PWA: Installation](https://web.dev/learn/pwa/installation)  
10. [web.dev — Learn PWA: Web app manifest](https://web.dev/learn/pwa/web-app-manifest)  
11. [web.dev — Install criteria](https://web.dev/articles/install-criteria)  
12. [web.dev — Learn PWA: Offline data](https://web.dev/learn/pwa/offline-data)  
13. [web.dev — Learn PWA: Caching](https://web.dev/learn/pwa/caching)  
14. [web.dev — Learn PWA: Service workers](https://web.dev/learn/pwa/service-workers)  
15. [web.dev — Storage for the web](https://web.dev/articles/storage-for-the-web)  
16. [Chrome Developers — Revisiting Chrome's installability criteria](https://developer.chrome.com/blog/update-install-criteria)  
17. [Chrome Developers — Basic offline page for web apps on Chrome Android](https://developer.chrome.com/blog/default-offline)  
18. [Chrome Developers — What’s new for web on Android 2023](https://developer.chrome.com/blog/whats-new-in-web-on-android-io2023)  
19. [MDN — Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)  

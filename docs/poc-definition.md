# Smart Critters — PoC definition

Hand-offable definition for the first usable PoC. Source of truth for a follow-on build effort. Domain language: repo `CONTEXT.md`. Origin map: [Smart Critters: first usable PoC definition](https://github.com/ventrion/smart-critters/issues/18).

## Goal

A local-first, tablet/mobile (Android-primary) Training app for grades **2** and **4** in **Maths**, **Czech**, and **English**, delivered as a SvelteKit static PWA on GitHub Pages, fed by fake/seeded Content Packs. Kids can install it, train, earn thin XP, and see default Critter **Cara** — without backends, profiles, unlocks, or dashboards.

First users: the author's own kids. A functioning PoC matters more than completeness.

## Stack

- **SvelteKit + TypeScript**
- **`@sveltejs/adapter-static`**, full prerender
- **GitHub Pages** project site: `paths.base` = `/smart-critters`
- Web app **manifest** + **service worker** (installable PWA; offline Training after shell + packs cached)
- **No backend**
- Research notes: `docs/research/sveltekit-gh-pages-pwa-android.md` on branch `research/sveltekit-gh-pages-pwa-android`

## In scope

### Screens & navigation

Three screens only:

| Screen | Role |
| --- | --- |
| **Home** | Hub: Cara + XP total badge (no Level); sticky Grade (2 / 4, default **2**); three Subject buttons (Maths / Czech / English) each starting a Session immediately; compact Czech/English **Chrome Language** toggle (default **Czech**) |
| **Session** | Fixed **8**-Item loop; Cara coach strip; immediate feedback; progress dots; Exit with confirm |
| **Summary** | Score (correct / 8), XP earned this Session, Cara pose; single primary CTA → Home |

Flows:

- `Home → (Subject) → Session → Summary → Home`
- `Home → Session → Exit (confirm) → Home` (no XP for that Session; no resume)

### Session UI

- **Cara coach strip** (prototype variant B): Cara + speech bubble + progress dots beside a separate Item work area
- Immediate feedback via bubble (and work-area state); **no** worksheet banner or full-viewport flash
- PoC Cara poses: **idle** on Home / during Session; **happy** (≥70%) or **try-again** (below) on Summary; idle again on return Home — no mid-Session pose swaps
- Assets: `static/critters/cara/{idle,happy,try-again}.png`
- Reference prototype: branch `prototype/training-session` (`VariantB.svelte`)

### Items & scoring

- Types: **multiple choice** + **short answer** only
- Short-answer match: trim + case-fold + collapse whitespace; **keep diacritics**
- On Session start: **shuffle pack Items and take 8 without replacement** (same Item may recur across Sessions)
- XP (per install, persists across reload): **+10** per correct Item; **+20** Session bonus at ≥70% correct; Exit → **0** for that Session
- Reference prototype: branch `prototype/xp-cara-home` (Home ≈ companion stage; Summary = celebration beat)

### Content Packs

- **Six** fake packs: Maths / Czech / English × Grades 2 and 4
- Each pack **≥12** Items so an 8-Item Session has headroom; both Item types represented
- Hand-authored placeholders; **no curriculum fidelity** bar; nonsense topics OK
- Contract (from Content Pack decision):
  - One pack = one Subject × Grade
  - Folder `{subject}-grade-{n}/` with `pack.json` (metadata + inlined `items`) and optional `assets/`
  - Subjects: `maths` \| `czech` \| `english`
  - Item envelope: `{ id, type, payload }`
  - Start at `schemaVersion: 1`; bump on breaking changes (freely while greenfield)
- Packs do **not** own Session length or XP (client policy)

### Delivery constraints

- Android tablet + Chrome is the primary target
- First visit / pack download may need network; after cache, Training must work offline
- Single child per install; XP and Grade/Chrome Language preferences are per install

## Acceptance criteria

1. Installable as a PWA from the GitHub Pages project URL (`/smart-critters`); runs on an Android tablet in Chrome.
2. Home shows Cara + XP total, sticky Grade (2/4), Czech/English Chrome Language toggle, three Subject buttons.
3. Starting a Subject runs an 8-Item Session from that Subject×Grade pack (MC + short answer), with Cara coach strip, immediate feedback, and Exit with no XP.
4. Summary shows score, XP earned, Cara pose; primary CTA back to Home; XP total updates and **survives reload** on the same install.
5. After first load/cache, a Training Session can run **offline**.
6. Six fake packs present and loadable; no backend; no profiles / unlocks / mini-games / dashboards / Settings.

## Explicit non-goals (PoC)

- Implementing work beyond this definition lives in a **follow-on build**; this document only defines what to build
- Parent / teacher dashboards and school-readiness legal/compliance
- Live / on-device content generation (architectural never)
- Critter unlocks, XP sinks, mini-game library, reward gating
- Multi-child profiles; Settings screen; mid-Session resume
- Curriculum-aligned packs; Social Sciences (Člověk a jeho svět) Training content
- Cara animation beyond still poses; Capacitor/store wrap
- Adaptive difficulty, missions, topic-demand-based Session length (fixed 8 for PoC; A/B and demand-aware length later)
- Progress-event log “for later” dashboards (YAGNI)

## Design seams (prepare-for, do not build)

Keep architecture open for later: pluggable Item renderers (incl. map/timeline/diagram for Social Sciences), extra Critters/unlocks, mini-game host surface, multi-profile, Capacitor wrap, offline AI pipelines that emit versioned Content Packs. Do not implement them in the PoC.

## Prototype & research pointers

| Asset | Where |
| --- | --- |
| Session UI (coach strip) | `prototype/training-session` |
| Home XP + Cara / Summary celebration | `prototype/xp-cara-home` |
| Cara still poses | `static/critters/cara/` |
| GH Pages PWA research | `research/sveltekit-gh-pages-pwa-android` → `docs/research/sveltekit-gh-pages-pwa-android.md` |
| Czech primary / Social Sciences Item shapes | `research/czech-primary-subjects-1-5` |

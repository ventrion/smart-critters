# Smart Critters — offline content pipeline definition

Hand-offable definition for the offline, end-to-end content pipeline. Source of truth for a follow-on build effort. Domain language: repo `CONTEXT.md`. Origin map: [Smart Critters: offline content pipeline definition](https://github.com/ventrion/smart-critters/issues/36).

## Goal

A deterministic TypeScript CLI that, given a job (Subject × Grade + Skill Bucket targets), produces a versioned **Content Pack** via a resumable working directory of Items and assets, AFK quality gates, and atomic local publish — with **no** live / on-device generation and **no** required human review before a pack is usable.

Success for *this* document: freeze the locked decisions below so a build effort can implement without re-opening the map. Implementing the pipeline itself is out of scope here.

## Stack

- **Runtime / control plane:** TypeScript (Node) custom CLI — deterministic stage graph, workdirs, resume, Zod validation, pack assemble. At least one file/module per phase. Thin `just` / Task recipes for humans. No Temporal / Prefect / LiteLLM Proxy (or similar) as v1 orchestrator.
- **LLM text:** **Vercel AI SDK only**. First-class providers include OpenAI, Anthropic, Gemini, DeepSeek, and **OpenRouter** (`OPENROUTER_API_KEY` + OpenRouter model ids) for breadth/cost selection. Direct provider keys remain valid; OpenRouter is not mandatory for every stage.
- **Auth (text):** API keys from explicit env / secrets — not subscription OAuth / interactive desktop logins for text stages.
- **Images (when generative supporting assets are needed):** `codex-imagegen` as an external one-shot subprocess (Codex login / `OPENAI_API_KEY` fallback). Deliberate exception to API-key-only. Revisit image providers later; not via OpenRouter in v1.
- **Config isolation:** per-job working directory; job-scoped pipeline config; explicit secrets injection; no dependence on repo-root AI project settings for generation behavior.
- **Execution:** synchronous concurrent fan-out. No OpenAI/Gemini Batch APIs in v1.

### Default stage → provider / tier

Exact OpenRouter (or other) model slugs may be filled at build time. Job YAML may override via `model_by_stage`.

| Stage | Provider | Tier |
| --- | --- | --- |
| `plan`, `draft-items`, `plan-assets` | `openrouter` (default) | cheap / fast chat |
| `gate-dedup`, `gate-integrity`, `gate-assets` (any LLM judgment) | `openrouter` (default) | stronger reasoning / chat |
| `compose-assets` (generative supporting images) | `codex-imagegen` | GPT Image 2 via existing tool |
| `assemble`, `publish-local` | — | none (deterministic) |

## In scope

### Pipeline spine (9 named stages)

1. `plan` — Item worklist from targets (not asset grouping)
2. `draft-items` — Item drafts + image-need briefs / composer params
3. `gate-dedup` — early; corpus = workdir ∪ published same Subject×Grade (incl. rejects on disk)
4. `gate-integrity` — early; on dedup survivors
5. **Bounded refill** (orchestrator, not a named stage) — shortfall per `(skill_bucket, progression_band)` → re-draft only new rows; `max_refill_attempts` default **3**; optional `draft_multiplier`; still short → **fail before** `plan-assets`
6. `plan-assets` — assign `assetId`s; owns compose worklist / fan-out
7. `compose-assets` — only registry **misses**
8. `gate-assets` — role-split checks; **no refill** in v1; fail job if required survivors drop below targets
9. `assemble` → `publish-local`

No human-review stage. Stem-clarity / reading-load is a sibling gate (fog): if ticketed later, insert with early gates **before** `plan-assets`.

### Run inputs

Job YAML fields:

- `subject`, `grade`
- optional `framework` (default `rvp2025`)
- `pack_id`
- `targets[{ skill_bucket, progression_band, count }]` — **only listed targets**
- optional `model_by_stage`, `shapes_allowlist`

CLI: `pipeline run --job …` (resume default); `--clean` (whole job workdir); optional `--from <stage>`.

### Skill Buckets (catalog inputs)

- Canonical ID = one **RVP ZV 2025 OVU** code; **mandatory human-readable slug**; prior-RVP codes as aliases only.
- One YAML file per OVU at:

  `content/skill-buckets/{subject}/{ovu-code}.yaml`

- File contents: OVU + slug (+ aliases), curriculum/objectives, metodika notes, exemplar stems, allowed Item shapes as **refs into the shared catalog** (no private per-bucket schema dialect). Soft/attitude OVUs may be flagged soft-assessable.
- Curriculum research: `docs/research/czech-primary-curriculum-outcomes-grades-1-5.md` (and related notes).

### Progression Band & mixed difficulty

- On each target and each emitted Item: `na_zacatku` | `na_ceste` | `splneno` (NPI metodika scaffolding — not binding RVP grade law).
- No v1 “advanced / gifted” band. Ahead kids use **Grade+N Content Pack** selection (Training / pointer side; fog).

### Working directory

`pipeline-work/<pack_id>/`:

- frozen `job.yaml`
- `plan/`
- `items/<itemId>/{draft,meta}.json`
- `assets/{registry.json,files/}`
- `gates/{integrity,dedup,assets}/`
- `assemble/`
- `status.json` (incl. `refill_attempt`)

Rejects stay on disk for dedup corpus; assemble ignores them. Published packs are not written here.

### Parallelism

- Serial: `plan`, `plan-assets`, `gate-dedup`, `assemble`, `publish-local`
- Parallel by Item: `draft-items`, `gate-integrity` (`concurrency` config)
- Parallel by miss `assetId`: `compose-assets`, `gate-assets`
- One CLI process per job workdir; different packs may run in parallel; durable supporting-asset library uses atomic promote

### Resume / clean

- Idempotent resume via watermarks; never delete workdir unless `--clean`
- `--clean` wipes **this job workdir only** (not asset library / published packs)
- v1: whole-job clean only
- Corrupt/missing files = incomplete → regenerate that unit

### AFK Item dedup gate

| Piece | Rule |
| --- | --- |
| Placement | Per Item, immediately after draft (`gate-dedup`) |
| Corpus | Job working directory ∪ all published Content Packs for the same Subject×Grade |
| Stages | **A + B only** — embeddings deferred |
| Stage A | Hard reject on exact match of normalized `prompt` + `type` + **correct-answer fingerprint** (not full MC choice sets) |
| Stage B | Hard reject when char **4-gram Jaccard ≥ 0.90** *and* numeric/operator signatures equal (or Item has no digits). Thresholds provisional |
| Numeric signature | **Order-preserving** — commutative variants (e.g. `3+5` vs `5+3`) are **kept** distinct |
| Czech text | Keep diacritics; NFKC + casefold + light whitespace/operator normalize; **no MorphoDiTa** in v1 |
| On hard-reject | Regenerate that Item slot; after retry budget, fail the `(bucket, band)` target (no silent under-quota publish) |
| Error bias | Prefer precision on auto-reject — don’t kill pedagogical siblings |

Research: `docs/research/item-deduplication-for-content-generation.md`

### AFK answer-integrity gate

1. **Explicit accepted key** — scorer-honoured key present and valid (choice id, accepted set, or shape-equivalent). Missing/empty/invalid → hard-fail. Silent dual-correct banned always.
2. **Two-layer dual-correct check (hard-fail)** — (a) structural key/option rules; (b) semantic judge (“could a knowledgeable child at this Grade defend another option/form as correct?”).
3. **Ruse/trick ban (hard-fail)** on default grades 1–5 packs — misleading stems, hidden-negation-only discrimination, gotcha traps, deceptive window dressing. Metadata: `ruse: false` or omit; never `ruse: true` on the mainstream path. Hard fair difficulty is not a ruse.
4. Integrity ≠ stem clarity / reading-load (sibling gate, fog).
5. Reject the Item; never assemble a failed Item. Shape-agnostic.

Research: `docs/research/ed-psych-item-answer-integrity-and-ruses.md`

### Asset generation policy

- Every pack asset has mandatory role: `stem-critical` | `supporting`.
- **Stem-critical:** deterministic composers / verified assembly recipes **only**. Never generative / LLM / `codex-imagegen`. Structural keys from params/recipe hashes define shared `assetId`s. Emit **SVG**.
- **Supporting:** generative via `codex-imagegen` (GPT Image 2 now; other models later via config). Prefer reuse from durable library. Emit **PNG/WebP**.
- **Library:** `content/asset-library/` — hybrid durable cache across jobs; on miss generate and **atomically promote**; each pack still materializes its own `assets/` tree. `--clean` never wipes the library.
- Grouping: stem-critical = structural keys; supporting = embed→cluster on image-need briefs; long-context planner optional overlay only (never sole AFK merge authority).
- **Grid→split:** supporting-only, experimental, hard-gated; never stem-critical.
- Pack wiring: `pack.json` asset registry entries `{ id, path, role }`; Items reference by `assetId`; pack-relative paths only.
- **AFK `gate-assets`:** stem-critical = param/recipe invariants + file present; supporting = file/dimensions/`role`/reuse validity + no answer-spoiling heuristic (e.g. unexpected digits when the answer is numeric/textual). Vision style checks optional.

Research: `docs/research/content-pipeline-image-asset-strategies.md`

### Item shapes (shared catalog)

Envelope: `{ id, type, payload }` (from Content Pack contract). Pipeline-authored Items also carry `skill_bucket` + `progression_band`.

| `type` | Role |
| --- | --- |
| `multipleChoice` | keep; true/false = two choices; **no multiselect** in v1 |
| `shortAnswer` | keep |
| `imageChoice` | image options; single `correctChoiceId` |
| `order` | `correctOrder: id[]` |
| `match` | `correctPairs[]` |
| `gapMatch` | cloze / drag token into blank(s); explicit gap↔token keys |

Cross-cutting:

- Optional `stimulus: { kind: 'image' \| 'audio', assetId }`
- Optional `layout` (e.g. `'timeline'`) for presentation only
- Timeline / scene / budget / traffic-sign = stimulus/layout over shared scorers — **no** dedicated types
- Later: `hotspot`. Deferred: drawing, speech, soft select-point, graphing, soft synonym gaps without accepted set
- `schemaVersion`: integer; bump **only** on breaking changes. Additive catalog growth stays on `schemaVersion: 1`. Unknown `type` → fail closed

Research: `docs/research/item-shape-catalog-beyond-mc-short-answer.md`

### Content Pack output contract

Extends [Decide Content Pack schema for fake packs and future pipelines](https://github.com/ventrion/smart-critters/issues/21):

- One pack = one Subject × Grade
- Folder `{subject}-grade-{n}/` with `pack.json` (metadata + inlined `items`) and optional `assets/`
- Metadata: `schemaVersion`, `id`, `subject`, `grade`, `version`, `title`, `contentLanguage`
- Subjects near-term: `maths` \| `czech` \| `english` (later `social-sciences`)
- Additive: per-Item `skill_bucket` / `progression_band`; asset registry `{ id, path, role }`
- Content `version`: monotonic integer per pack id (`previous+1`, or `1` if first) — read from **published** pack, not workdir; successful publish after `--clean` still bumps
- Zod-validate before publish

### Publish local

Atomic replace into the existing client tree:

`src/lib/training-runtime/content-packs/{subject}-grade-{n}/`

No remote registry in this definition.

### Illustrative smoke example (not a mandate)

Acceptance is Subject×Grade-agnostic. Example first green path:

- Subject `maths`, grade `2`, `pack_id` `maths-grade-2`
- One or two Skill Buckets with small `count`s across Progression Bands
- Run end-to-end AFK → valid pack under the publish path above

## Acceptance criteria

1. CLI accepts a job YAML and runs the locked stage spine with resume default and `--clean` / optional `--from <stage>`.
2. Skill Bucket defs load from `content/skill-buckets/{subject}/{ovu-code}.yaml`; job runs **only** listed `targets`.
3. Working directory layout matches this definition; resume is idempotent; `--clean` does not wipe `content/asset-library/` or published packs.
4. `gate-dedup` and `gate-integrity` hard-reject per rules above; rejects never assemble; bounded refill ≤3 then fail before assets if still short.
5. Assets honor stem-critical vs supporting policy; supporting reuse via `content/asset-library/`; `gate-assets` role-split checks; no asset refill in v1.
6. Assemble emits Zod-valid `pack.json` (+ `assets/` as needed) with shared Item catalog types, `skill_bucket` / `progression_band`, and asset registry `{ id, path, role }`.
7. `publish-local` atomically replaces `src/lib/training-runtime/content-packs/{subject}-grade-{n}/` and bumps content `version` correctly.
8. Text LLM calls go through Vercel AI SDK with OpenRouter as a first-class provider; generative images (if any) use `codex-imagegen` only in v1.

## Explicit non-goals (this pipeline build)

- Implementing work beyond this definition lives in a **follow-on build**; this document only defines what to build
- Live / on-device content generation (architectural never)
- Human-required review before every pack publish (AFK gates only)
- OpenAI/Gemini Batch APIs; Temporal/Prefect-style orchestrators; coding-agent backends (Claude Code / Cursor Agent SDK) as pipeline stages
- Embedding-based dedup (Stage C) until labeled FP/FN samples justify it
- MorphoDiTa / aggressive Czech stemming in dedup
- Third-party licensed clipart kits as the supporting-asset strategy
- Multiselect Items; dedicated traffic-sign / timeline / scene / budget scorers
- Gifted / productive-struggle **ruse** Item styles on default grades 1–5 packs
- Pack **patching** (replace one faulty Item) as a first-class pipeline mode
- Remote publishing / distribution beyond local/repo `publish-local`
- Reworking the PoC Training client beyond what the pack contract already allows
- Driver education as a product line
- Authoring the full OVU Skill Bucket corpus as a curriculum project inside the pipeline build (catalog *format* is in scope; filling every OVU is not)

## Design seams (prepare-for, do not build)

Keep architecture open for later — document so nothing is lost:

- Pack **patching** (replace one faulty Item with a new gated Item)
- Training / mission **pointer schema** and catalogs (packs remain the Item pool)
- Gifted / productive-struggle **ruse** door: opt-in / disclosed / never silent dual-correct (constraints locked; design/schema later)
- Stem clarity / reading-load **sibling** AFK gate (insert with early gates before `plan-assets` when ticketed)
- Grade 6/7 (or early 2. stupeň) Content Packs as Grade+N stretch targets
- Client-side Grade+1 selection UX and anti-boredom rules
- English-beyond-school vs school-aligned English pack strategy
- Social Sciences / ČJS pack topics once shapes + buckets exist
- Publishing/distribution beyond local/repo use
- Alternate image providers / OpenRouter-routed images (reopen later)
- Async Batch APIs if cost/rate limits force them
- Embedding soft-band dedup once calibrated

## Source decisions & research

| Topic | Issue / note |
| --- | --- |
| Map | [Smart Critters: offline content pipeline definition](https://github.com/ventrion/smart-critters/issues/36) |
| Pack contract | [Decide Content Pack schema for fake packs and future pipelines](https://github.com/ventrion/smart-critters/issues/21) |
| Czech curriculum / OVUs | [Research Czech ministry curriculum outcomes per grade](https://github.com/ventrion/smart-critters/issues/37) |
| Skill Buckets | [Decide skill-bucket system for pipeline inputs](https://github.com/ventrion/smart-critters/issues/42) |
| Item shapes | [Decide Item shapes and tagged-union representation](https://github.com/ventrion/smart-critters/issues/44) · research [#43](https://github.com/ventrion/smart-critters/issues/43) |
| Dedup gate | [Decide AFK Item dedup gate](https://github.com/ventrion/smart-critters/issues/45) · research [#38](https://github.com/ventrion/smart-critters/issues/38) |
| Integrity gate | [Decide AFK answer-integrity gate](https://github.com/ventrion/smart-critters/issues/46) · research [#39](https://github.com/ventrion/smart-critters/issues/39) |
| Assets | [Decide content-pipeline asset generation policy](https://github.com/ventrion/smart-critters/issues/47) · research [#40](https://github.com/ventrion/smart-critters/issues/40) |
| Tech stack | [Decide content-pipeline technology stack](https://github.com/ventrion/smart-critters/issues/48) · research [#41](https://github.com/ventrion/smart-critters/issues/41) |
| Spine | [Decide pipeline inputs stages resume and assemble](https://github.com/ventrion/smart-critters/issues/49) |
| This freeze | [Lock the hand-offable content pipeline definition](https://github.com/ventrion/smart-critters/issues/50) |

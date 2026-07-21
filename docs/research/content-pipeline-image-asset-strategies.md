# Content Pack pipeline: image / asset strategies

**Ticket:** [#40 — Research content-pipeline image and asset strategies](https://github.com/ventrion/smart-critters/issues/40)  
**Map parent:** [#36 — Smart Critters: offline content pipeline definition](https://github.com/ventrion/smart-critters/issues/36)  
**Informs:** [#47 — Decide content-pipeline asset generation policy](https://github.com/ventrion/smart-critters/issues/47)  
**Domain terms:** Content Pack, Item, Subject, Training, Session (see `CONTEXT.md`)  
**Date:** 2026-07-21

## Question

What asset strategies should an offline Content Pack pipeline use — deterministic composers (fractions, clocks, number lines, diagrams), a reusable clipart/component library for deterministic assembly, and LLM image generation with reuse/bulk (e.g. grid→split) — including whether a long-context planner vs incremental clustering best groups Items that can share art, and how stem-critical vs supporting imagery differ (correctness / AFK QA implications)?

## Answer (short)

Recommendations for grilling (#47) to decide against — **not** a locked policy:

1. **Default tiering:** Prefer **deterministic composers** for stem-critical maths/diagrams; prefer a **licensed clipart / SVG component library** for reusable scene parts; use **LLM images only** for supporting flavor (or rare unique scenes) where exact geometry/labels are not answer-bearing.
2. **Stem-critical vs supporting is a hard gate split:** stem-critical assets must be reproducible from structured params (composer inputs or verified assembly recipes); supporting assets may be generative but must not change the accepted answer.
3. **Reuse before regenerate:** Assign shared `assetId`s across Items when the image-need is the same; generate once, reference many times from pack `assets/`.
4. **Bulk LLM:** Prefer provider **Batch / async** APIs for offline runs; treat **grid→split sprite sheets as undocumented/experimental** unless a provider later documents it — prefer one asset per call (or `n` separate images) plus reuse.
5. **Grouping shared art:** Prefer **incremental embedding → cluster → assign shared asset ids** as the default for large packs; use a **long-context planner** only for small batches or as a human-readable overlay that must be validated by clustering / structural keys.
6. **Pack wiring:** Keep `#21` layout (`assets/` reserved); extend Item payloads **additively** with optional relative asset refs — do not invent a full media schema lock in this research.

---

## Official / primary sources used

| Source | Role |
| --- | --- |
| [#21 Content Pack schema resolution](https://github.com/ventrion/smart-critters/issues/21) | Pack layout: `pack.json` + optional `assets/`; payloads currently text; additive changes OK |
| [#36 map Notes](https://github.com/ventrion/smart-critters/issues/36) | Offline packs only; prefer composers + clipart; LLM when needed; stem-critical vs supporting |
| `CONTEXT.md`, `docs/poc-definition.md`, `src/lib/training-runtime/types.ts` | Domain terms + current text-only Item payloads |
| [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) | Programmatic 2D drawing surface for composers |
| [W3C SVG 1.1 — `symbol` / `use`](https://www.w3.org/TR/SVG11/struct.html#SymbolElement) | Reusable SVG component / sprite pattern |
| [Creative Commons CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) | Public-domain dedication; commercial reuse allowed |
| [Creative Commons license list](https://creativecommons.org/share-your-work/cclicenses/) | BY / BY-SA / BY-NC / ND variants and commercial restrictions |
| [OpenAI Image generation guide](https://platform.openai.com/docs/guides/image-generation) | GPT Image models, quality/size, edits, references, limitations, cost examples |
| [OpenAI Images API reference](https://platform.openai.com/docs/api-reference/images) | Generations / edits / variations endpoints |
| [OpenAI Batch API](https://platform.openai.com/docs/guides/batch) | Async `/v1/images/generations` + `/v1/images/edits`; 50% discount; 24h window |
| [OpenAI Embeddings guide](https://platform.openai.com/docs/guides/embeddings) | Embeddings for clustering; cosine similarity; models |
| [OpenAI Terms of Use (ROW)](https://openai.com/policies/row-terms-of-use/) | Customer owns Output (as between parties); accuracy caveats |
| [Google Imagen (Gemini API)](https://ai.google.dev/gemini-api/docs/imagen) | Imagen params; deprecation → Nano Banana; SynthID |
| [Google Nano Banana image generation](https://ai.google.dev/gemini-api/docs/image-generation) | Current Gemini image models; edit / multi-ref / aspect / watermark |
| [Google Gemini Batch API](https://ai.google.dev/gemini-api/docs/batch-api) | Async batch at 50% cost; ~24h target |
| [scikit-learn Clustering](https://scikit-learn.org/stable/modules/clustering.html) | K-Means (Lloyd) + k-means++ references |
| [Prior art: PWA / offline packs](./sveltekit-gh-pages-pwa-android.md) | Local prior art: packs must be cacheable offline |

Library licenses verified from first-party LICENSE / GitHub license metadata (not secondary blogs):

| Candidate | License (verified) | Source |
| --- | --- | --- |
| D3 | ISC | [d3/d3 LICENSE](https://github.com/d3/d3/blob/main/LICENSE) |
| Rough.js | MIT | [rough-stuff/rough](https://github.com/rough-stuff/rough) |
| Paper.js | MIT | [paperjs/paper.js LICENSE.txt](https://github.com/paperjs/paper.js/blob/develop/LICENSE.txt) |
| svg.js | MIT | [svgdotjs/svg.js LICENSE.txt](https://github.com/svgdotjs/svg.js/blob/master/LICENSE.txt) |
| Fabric.js | MIT | [fabricjs/fabric.js LICENSE](https://github.com/fabricjs/fabric.js/blob/master/LICENSE) |
| opentype.js | MIT | [opentypejs/opentype.js](https://github.com/opentypejs/opentype.js) |

---

## A. Deterministic composers

### Patterns suitable for kids’ maths stems

For Items where the picture **is** the stem (fraction shaded, clock hands, number-line tick, base-ten blocks, simple geometry), programmatic drawing is a natural fit:

- **SVG document model:** shapes, text, transforms, and reusable templates via `symbol` + `use` ([W3C SVG 1.1 struct](https://www.w3.org/TR/SVG11/struct.html#SymbolElement)).
- **Canvas 2D:** imperative drawing via `CanvasRenderingContext2D` (rects, arcs, paths, text) ([MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)). Headless Node/browser automation can rasterize to PNG for pack `assets/` if the client prefers bitmaps; SVG can also ship as-is if the Training renderer accepts it later.

Typical composer **inputs** (structured, not free text):

| Diagram family | Param examples | Why deterministic |
| --- | --- | --- |
| Fraction bar / circle | `numerator`, `denominator`, `shaded`, labels on/off | Exact region counts |
| Analogue clock | `hours`, `minutes`, tick style | Exact angle of hands |
| Number line | `min`, `max`, `ticks`, highlighted value | Exact placement |
| Base-ten blocks | hundreds/tens/ones counts | Exact tile counts |
| Simple geometry | polygon/circle dims, right-angle marks | Exact measures |

OSS helpers that are license-clear for **pipeline tooling** (compose offline → emit assets into packs) include D3 (ISC), Rough.js / Paper.js / svg.js / Fabric.js / opentype.js (MIT) — see table above. **Shipping** a library into the client is a separate decision from using it only in the offline pipeline; packs can store final SVG/PNG without bundling the composer runtime.

### Why deterministic beats LLM for stem-critical diagrams

OpenAI’s own GPT Image limitations include imperfect **text rendering**, **composition control** for layout-sensitive scenes, and occasional failures of **visual consistency** across generations ([Image generation guide — Limitations](https://platform.openai.com/docs/guides/image-generation)). OpenAI Terms also state Output may be inaccurate and must be evaluated before use ([Terms — Accuracy](https://openai.com/policies/row-terms-of-use/)). Vision/OCR paths are likewise imperfect for small/rotated text and spatial tasks ([Images and vision — Limitations](https://platform.openai.com/docs/guides/images)).

For Smart Critters:

- **Reproducibility:** same params → same diagram (byte-stable or semantically stable).
- **Exact labels / counts:** no reliance on model typography for “3/4 shaded”.
- **AFK QA:** assert against params (e.g. shaded sectors == numerator) instead of sampling LLM pixels.
- **Cost/latency:** composers are CPU-cheap vs image-token pricing ([cost examples in Image generation guide](https://platform.openai.com/docs/guides/image-generation)).

**Product implication:** treat “fraction/clock/number-line/geometry” as composer-first candidates in #47.

---

## B. Clipart / component library assembly

### Assembly patterns

1. **SVG symbol libraries:** define reusable glyphs in `<symbol>` (not rendered until referenced); instantiate with `<use>` and scale via `viewBox` / `preserveAspectRatio` ([W3C SVG 1.1](https://www.w3.org/TR/SVG11/struct.html#SymbolElement)). Good for apples, animals, coins, map icons layered into a scene SVG, then optionally rasterized.
2. **Layered PNGs / sprites:** stack transparent PNGs in a deterministic compositor (z-order recipe in JSON). Canvas can composite layers ([MDN Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)).
3. **Recipe files:** each assembled asset = `{ components: [...], transforms: [...], labels: [...] }` so rebuilds are AFK-checkable.

### Licensing for educational clipart in app packs

| License family | Bundling in commercial/educational app packs | Cite |
| --- | --- | --- |
| **CC0** | Intended: copy, modify, distribute, **commercial** use without permission (trademark/privacy still apply) | [CC0 deed](https://creativecommons.org/publicdomain/zero/1.0/) |
| **CC BY** | Commercial OK with **attribution** | [CC licenses](https://creativecommons.org/share-your-work/cclicenses/) |
| **CC BY-SA** | Commercial OK; **share-alike** on adaptations | same |
| **CC BY-NC / NC-*** | **Noncommercial only** — risky or disallowed if the product is commercial / monetized | same |
| **CC BY-ND** | No derivatives — blocks many compositing workflows | same |
| **Commercial stock** | Contract-specific; often restrict redistribution, template resale, or unlimited app embedding — **read each EULA** (not researched per-vendor here) | — |

**Recommendation for #47:** prefer **CC0 / public domain** or **self-drawn** components for pack-bundled clipart; if using BY, automate attribution files inside the pack or repo; avoid NC unless legal review clears the product model.

### When assembly is enough vs unique generative art

| Prefer assembly | Prefer generative (LLM) |
| --- | --- |
| Countable objects, icons, simple scenes from a finite kit | Unique illustrative mood / character pose not in the kit |
| Stem-critical scenes that must match a recipe | Supporting decoration that must not encode the answer |
| High reuse across many Items | One-off flavor with low reuse |

Map #36 already prefers library + deterministic first; LLM only when needed ([#36](https://github.com/ventrion/smart-critters/issues/36)).

---

## C. LLM / image-model generation (provider docs)

### OpenAI Images (primary)

Access via **Image API** (`/images/generations`, `/images/edits`) or **Responses API** image-generation tool ([Image generation guide](https://platform.openai.com/docs/guides/image-generation)). Latest model called out in the guide: **`gpt-image-2`**.

Relevant bulk / offline capabilities:

| Capability | What docs say | Cite |
| --- | --- | --- |
| Quality tiers | `low` / `medium` / `high` / `auto`; use `low` for drafts/thumbnails | [Customize output](https://platform.openai.com/docs/guides/image-generation) |
| Sizes | Popular presets + for `gpt-image-2` many resolutions under edge/pixel constraints; >~2K experimental | same |
| `n` images | Generate multiple images in one request (`n`; DALL·E 3 historically `n=1`) | [CreateImageRequest / guide](https://platform.openai.com/docs/guides/image-generation) |
| Editing / references | Edits endpoint: modify image, or generate from **one or more reference images**; optional mask (prompt-guided, not pixel-perfect) | [Edit Images](https://platform.openai.com/docs/guides/image-generation) |
| Multi-turn | Responses API: iterate with prior image in context / `previous_response_id` | same |
| Formats | PNG / JPEG / WebP; compression for jpeg/webp | same |
| Transparent BG | Supported on some GPT Image models; **`gpt-image-2` currently does not support `background: "transparent"`** | same |
| Batch / async | Batch API supports `/v1/images/generations` and `/v1/images/edits`; **50% cost**, separate rate limits, **24h** completion window | [Batch API](https://platform.openai.com/docs/guides/batch) |
| Cost examples (guide calculator table) | e.g. GPT Image 2 @ 1024×1024: ~$0.006 low / ~$0.053 medium / ~$0.211 high (examples; still account for text/image **input** tokens) | [Cost and latency](https://platform.openai.com/docs/guides/image-generation) |
| Ownership | As between you and OpenAI, you own Output (assignment), subject to law; other users may get similar Output | [Terms](https://openai.com/policies/row-terms-of-use/) |

**Consistency techniques that are documented:** reference-image edits, multi-turn editing, prompt + style instructions. Official limitations still warn character/brand consistency can fail ([Limitations](https://platform.openai.com/docs/guides/image-generation)).

**Seeds:** OpenAI documents a `seed` parameter for **chat/completions-style** sampling determinism in the platform OpenAPI, but the **`CreateImageRequest` schema properties reviewed for this note do not include `seed`**. Do **not** plan image reproducibility on an undocumented image seed. Prefer deterministic composers or stored binary assets.

### Grid → split (sprite sheet)

Searched OpenAI image generation guide, Images API overview, and CreateImageRequest schema: **no official recommendation** to generate a multi-cell grid and crop into assets. Given documented issues with **composition control** and **text rendering**, grid→split is **experimental risk** (uneven cells, bleed, unreadable labels). If #47 wants bulk savings, prefer:

1. shared `assetId` reuse,
2. Batch API,
3. `quality: "low"` drafts then selective `high` finals,
4. optional `n` parallel variants — **not** undocumented grids.

### Google Gemini / Imagen

- **Imagen** via Gemini API: `numberOfImages` 1–4, `imageSize` `1K`/`2K` (Standard/Ultra), aspect ratios, `personGeneration` including **`allow_all` not allowed in EU/UK/CH/MENA** (relevant if child-like characters appear). English-only prompts at time of Imagen doc. All images carry **SynthID**. **Imagen models deprecated; shut down 17 Aug 2026**; migrate to **Nano Banana** ([Imagen docs](https://ai.google.dev/gemini-api/docs/imagen)).
- **Nano Banana** (Gemini native image): models include `gemini-3.1-flash-lite-image`, `gemini-3.1-flash-image`, `gemini-3-pro-image`, legacy `gemini-2.5-flash-image`. Supports text-to-image, **image editing**, multi-turn, up to **14 reference images** on Gemini 3 image models, aspect ratios / sizes including 1K–4K (model-dependent), SynthID watermark ([Image generation](https://ai.google.dev/gemini-api/docs/image-generation)).
- **Batch:** Gemini Batch API ~**50%** cost, ~24h target ([Batch API](https://ai.google.dev/gemini-api/docs/batch-api)). Suitable for offline pack builds if image generation is accepted through the batchable `generateContent` / Interactions paths (confirm model + endpoint pairing at implementation time — Batch page centers on `GenerateContentRequest`).

**Grid→split:** not recommended in these Google docs either (undocumented).

---

## D. Grouping Items for shared art: planner vs clustering

### Goal

Minimize unique generative (or even assembled) assets by mapping many Items → one `assetId` when the **image need** is equivalent (same scene recipe / same supporting motif).

### Option 1 — Long-context planner

One LLM pass over a pack (or batch of Item specs) that outputs a shared-asset plan: `{ assetId, usedByItemIds[], generationBrief }`.

| Pros | Cons |
| --- | --- |
| Can encode nuanced “same vibe” judgments | Context limits / cost grow with pack size |
| Human-readable plan for debugging | Non-deterministic; needs validation gate |
| Good for small packs / early pipeline | Easy to silently under- or over-merge |

Fits map #36’s “LLM as isolated one-shot jobs” if the planner is a single bounded job with JSON schema output — but still needs a mechanical check.

### Option 2 — Incremental embedding → cluster → assign ids

1. For each Item (or each image-need description), embed text with an embeddings API.
2. Cluster vectors; assign one `assetId` per cluster (or per connected component above a similarity threshold).
3. Generate/assemble once per `assetId`.

OpenAI explicitly lists **clustering** as an embeddings use case and recommends **cosine similarity**; their cookbook pattern uses **K-Means** on embedding matrices ([Embeddings guide](https://platform.openai.com/docs/guides/embeddings)). Models: e.g. `text-embedding-3-small` / `large`, priced per input token ([same](https://platform.openai.com/docs/guides/embeddings); [pricing](https://platform.openai.com/docs/pricing)).

**K-Means** is the classical algorithm often called **Lloyd’s algorithm**; scikit-learn documents the loop (assign → update centroids), local minima / restarts, and **k-means++** seeding ([scikit-learn Clustering](https://scikit-learn.org/stable/modules/clustering.html); Arthur & Vassilvitskii, SODA 2007, as cited there). Alternatives for non-convex clusters: DBSCAN (also documented in that chapter).

| Pros | Cons |
| --- | --- |
| Scales; resume-friendly (embed cache per Item) | Clusters ≠ perfect semantic “shareable art” without good briefs |
| Deterministic given embeddings + seed/init | Needs threshold / `k` selection |
| Aligns with AFK gates | Stem-critical Items should often **bypass** fuzzy merge (use structural keys instead) |

### Recommendation with conditions (for #47)

- **Default for supporting imagery:** incremental **embed → cluster (K-Means or cosine threshold)** on **image-need briefs**, not on full Item stems (avoids merging different answers that share topic words).
- **Default for stem-critical:** **structural keys** from composer params / assembly recipes (`clock:07:15`, `frac:2/5-shaded`) — clustering is optional only as a duplicate detector, not as the source of truth.
- **Long-context planner:** optional for **small** batches or to propose names/briefs **after** clustering; never the sole AFK authority for merges that affect stem-critical art.
- Hybrid is coherent: cluster supporting; key stem-critical; planner may explain the supporting clusters.

---

## E. Stem-critical vs supporting imagery

### Definitions (product-specific)

**Stem-critical:** The image **is** the stem or encodes an answer-relevant fact. If the art is wrong, the Item is wrong (or unanswerable). Examples: shaded fraction matching the prompt; clock showing the asked time; map region to identify; diagram with the measured length.

**Supporting:** Decorative / motivational / scene flavor that **must not** change the correct answer. Examples: Cara-adjacent celebration art; generic farm scene when the stem is a text word problem; subject icons.

These labels should be **first-class in the pipeline working directory** (per Item or per asset), matching map #36’s callout ([#36](https://github.com/ventrion/smart-critters/issues/36)).

### QA / AFK gate implications

| Class | Prefer generation path | Programmatic gates | Sampled / vision gates |
| --- | --- | --- | --- |
| Stem-critical | Composer or verified assembly recipe | Param invariants; hash/recipe rebuild equality; schema checks; optional pixel asserts on known markers | Rare; if used, treat failures as hard fails |
| Supporting | Library assembly or LLM (+ reuse) | License allowlist; file exists; dimensions; moderation; “no digits/labels that could spoof an answer” heuristics | Style / kid-safe sampling OK |

OpenAI Terms require evaluating Output for accuracy before use ([Terms](https://openai.com/policies/row-terms-of-use/)); for AFK publish (#36), that evaluation must be **automated** for stem-critical — another reason composers win there.

Vision models as QA: possible (OpenAI vision limitations still apply — small text, spatial reasoning, counting approximations) ([Images and vision](https://platform.openai.com/docs/guides/images)). Prefer not to make OCR the only gate for stem-critical maths.

---

## F. Packaging into Content Packs

### Contract today (#21)

- Folder `{subject}-grade-{n}/` with `pack.json` (metadata + inlined `items`) and **optional `assets/`** reserved for later media ([#21 resolution](https://github.com/ventrion/smart-critters/issues/21); `docs/poc-definition.md`).
- Item envelope `{ id, type, payload }`; PoC payloads are **text-only** (`prompt`, choices, etc.) (`src/lib/training-runtime/types.ts`).
- **Additive** optional fields / new types OK; breaking changes bump `schemaVersion`.

### Additive extension patterns (recommendations, not a schema lock)

Do **not** freeze a full media schema here; offer options for #47:

1. **Relative path on payload (minimal):**  
   `"image": "assets/frac-2-5.svg"` or `"assets/scenes/farm-01.webp"` resolved relative to the pack root.
2. **Asset registry in `pack.json`:**  
   `"assets": [{ "id": "frac-2-5", "path": "assets/frac-2-5.svg", "role": "stem-critical" }]` + Item refs by `assetId` (better for reuse/dedup).
3. **Typed stimulus slot (forward-compatible):**  
   e.g. optional `stimulus: { kind: "image", assetId: "…" }` beside `prompt`, aligning with Czech Social Sciences research that reserved non-text stimuli ([czech-primary research](./czech-primary-subjects-grades-1-5.md)).

Prefer **pack-relative** paths (no absolute URLs) so offline clients can unpack/cache one tree.

### Offline / PWA implications

Content Packs (Items **and** assets) must be fetched once and served from Cache Storage / IndexedDB / OPFS; Training must not call live image APIs on device ([CONTEXT.md](../../CONTEXT.md); prior art [sveltekit-gh-pages-pwa-android.md](./sveltekit-gh-pages-pwa-android.md)). Larger `assets/` increases pack download size and storage pressure — reuse and modest resolutions matter for tablet offline quotas (same prior art).

---

## Unknowns / cannot determine from primary sources

- Whether OpenAI will add a documented **`seed`** (or equivalent) on GPT Image generation; current CreateImageRequest properties reviewed do **not** list it.
- Official endorsement of **grid→split** bulk generation — **not found**; treat as experimental if attempted.
- Exact **Gemini Batch ↔ Interactions image** pairing guarantees for every Nano Banana model (Batch docs emphasize `GenerateContentRequest`; confirm at build time).
- Per-vendor **commercial stock** EULAs for clipart marketplaces (must be checked case-by-case).
- Optimal cosine / silhouette thresholds for Smart Critters image-need clustering (empirical; not fixed by docs).
- Whether pack clients will render **SVG natively** vs PNG-only (renderer seam still open).
- Legal treatment of **SynthID**-watermarked Gemini images in a children’s education product (technical presence documented; product/legal acceptance is a decision).
- Precise OpenAI **list prices** over time — use the live [pricing](https://platform.openai.com/docs/pricing) + guide calculator; examples above are from the guide’s illustrative table and can drift.

---

## Implications for later decisions

Grilling ticket **[#47 — Decide content-pipeline asset generation policy](https://github.com/ventrion/smart-critters/issues/47)** should lock:

1. Tier rules: when composers vs clipart assembly vs LLM are allowed.
2. Required `stem-critical` | `supporting` labeling and AFK gates per tier.
3. Shared-asset grouping method (structural keys / clustering / planner) and merge safety rules.
4. Provider choice(s), Batch usage, quality defaults, and whether any experimental bulk (grid→split) is forbidden.
5. Additive pack schema for `assets/` references (path vs registry vs stimulus slot) without breaking `schemaVersion: 1` unnecessarily.

This note informs those decisions; it does **not** decide them.

# Item shape catalog beyond MC and short answer

**Ticket:** [#43 — Research Item shape catalog beyond MC and short answer](https://github.com/ventrion/smart-critters/issues/43)  
**Map parent:** [#36 — Smart Critters: offline content pipeline definition](https://github.com/ventrion/smart-critters/issues/36)  
**Informs:** [#44 — Decide Item shapes and tagged-union representation](https://github.com/ventrion/smart-critters/issues/44)  
**Builds on:** [`czech-primary-subjects-grades-1-5.md`](./czech-primary-subjects-grades-1-5.md), [`czech-primary-curriculum-outcomes-grades-1-5.md`](./czech-primary-curriculum-outcomes-grades-1-5.md), [`content-pipeline-image-asset-strategies.md`](./content-pipeline-image-asset-strategies.md), [`ed-psych-item-answer-integrity-and-ruses.md`](./ed-psych-item-answer-integrity-and-ruses.md)  
**Domain terms:** Content Pack, Item, Skill Bucket, Subject, Training (see `CONTEXT.md`)  
**Date:** 2026-07-22

## Question

What Item shapes (prompt/response interaction types) should Smart Critters eventually support beyond text multiple-choice and short answer — including image stems, image choices, match/order, spatial/map, timeline, scene/rules (“who goes first”), traffic-sign style prompts, and other shapes demanded by the skill-bucket/curriculum outcomes — and how do peer products / pedagogy sources describe them?

## Answer (short)

Recommendations for grilling (#44) — **not** a locked schema:

1. **Keep the `#21` envelope** `{ id, type, payload }` and the PoC types `multipleChoice` | `shortAnswer`. Extend **additively** with new `type` values (and optional asset refs in payloads). Do **not** break the envelope or invent a private per–Skill Bucket schema dialect (`CONTEXT.md`: Skill Buckets reference a **shared** Item-shape catalog).
2. **Recommended shared catalog shortlist** (see § Options for grilling): keep MC/SA; add **image-capable stimulus** on MC/SA (or a thin `imageStem*` sibling), **`imageChoice`**, **`order`**, **`match`**, then **`hotspot`** (covers map/locate + traffic-sign “point here”); treat **timeline**, **scene/rules**, and **table/budget** as **layout/stimulus flavors** of order / image-stem MC / structured stimulus — not separate scoring dialects unless grilling insists.
3. **Standards map:** IMS QTI 3 already names the interaction families that matter (choice, text entry, order, match/associate, hotspot / graphic*, gap match). H5P’s maintained content types mirror the same pedagogy catalog (MC, Multimedia Choice, Drag and Drop, Fill in the Blanks, Image Sequencing, Timeline, Find the Hotspot — noting some hotspot/sequencing types are “not recommended” on H5P.com).
4. **Curriculum demand:** Maths (fractions/diagrams), English (listen → match pictures / order), Czech (picture sequence), and later ČJS (maps, timelines, scenes, budgets) all need non-text stems or non-text response surfaces — consistent with prior Czech research; do not contradict those notes.
5. **Answer integrity (#39):** every shape must admit a **single explicit correct key** (or explicit accepted set / ordered id list / set of directed pairs). No silent dual-correct; no ruses in v1.
6. **Traffic-sign stress-test:** covered by **image stem + MC**, **`imageChoice`**, or **`hotspot`** — **no dedicated `trafficSign` type**. Sign art is stem-critical clipart/composer material ([#40](./content-pipeline-image-asset-strategies.md)); product is not driver education.
7. **Phasing:** PoC stays MC+SA text; **near-term pipeline** locks image stimulus + `imageChoice` + `order` + `match`; **later Social Sciences** adds `hotspot` (map) and layout conventions for timeline/scene/budget. Defer freehand drawing, pan/zoom maps, speech scoring, multipart evidence Items.

---

## Official / primary sources used

| Source | Role |
| --- | --- |
| [1EdTech QTI 3.0 Interactions (conformance)](https://www.imsglobal.org/spec/qti/v3p0/conf) | Canonical interaction catalog + response cardinalities (choice, text entry, order, match, hotspot, graphic*, gap match, etc.) |
| [1EdTech QTI 3 Beginner’s Guide](https://www.imsglobal.org/spec/qti/v3p0/guide) | Response shapes: single id; ordered ids; sets of directed pairs |
| [1EdTech QTI ASI Information Model](https://www.imsglobal.org/sites/default/files/spec/qti/v3/info/imsqti_asi_v3p0p1_infomodel_v1p0.html) | Formal interaction class names |
| [H5P author tutorials](https://h5p.org/documentation/for-authors/tutorials) | First-party pedagogy catalog: MC, Drag and Drop, Image Pairing/Sequencing, Timeline, Fill in the Blanks, Image Hotspots, etc. |
| [H5P content types recommendations (H5P.com)](https://help.h5p.com/hc/en-us/articles/7505649072797-Content-types-recommendations) | Maintained vs “Not recommended” types (e.g. Find the Hotspot, Image Sequencing, Timeline) |
| [Khan Academy Help — assessments question types](https://support.khanacademy.org/hc/en-us/articles/42056609697165-What-are-Khan-Academy-assessments-and-how-do-they-work) | MC, numeric, drop-down, expression, interactive graphing, short written |
| [Khan Exercises wiki — Answer Types](https://github.com/Khan/khan-exercises/wiki/Writing-Exercises:-Answer-Types) | First-party (legacy) exercise authoring: radio/choices, rational, list, multiple |
| [Kahoot! for schools — how it works](https://kahoot.com/schools/how-it-works/) | First-party: quiz, true/false, puzzle (order), type answer, polls/word cloud |
| [Kahoot! question types (Help)](https://support.kahoot.com/hc/en-us/articles/115002308428-Kahoot-question-types) | Puzzle = sort into correct order; Type answer = short typed recall (search snippet / Help; page fetch intermittently 403) |
| [Duolingo Blog — listening exercise names](https://blog.duolingo.com/learning-with-hearing-aids/) | First-party names: “Tap what you hear”, “Repeat what you hear”, Listening exercises toggle |
| [Quizlet Study Modes](https://quizlet.com/en-gb/features/study-modes) | Learn (flashcards / MC / written), Test, Match (pair race) |
| [IXL User Guide (US)](https://www.ixl.com/materials/userguides/IXLUserGuide.pdf) | MC, fill-in-the-blank, visual/interactive, draw-your-own graphing (high level) |
| [IXL — STAAR question types](https://www.ixl.com/materials/us/IXL_and_the_new_STAAR_question_types) | Hot Spot, Hot Text, Drag and Drop, Inline Choice, Fraction Model, Multiselect, Match Table Grid, etc. |
| [Prodigy Math Parent FAQ](https://prodigygame.zendesk.com/hc/en-us/articles/115005952803-Getting-Started-with-Prodigy-Math-Parent-FAQ) | Curriculum-aligned adaptive questions; **no public interaction-type catalog** found |
| RVP ZV 2025 1. stupeň overview + OVU pages (via prior notes) | Curriculum demand for maps, sequences, listening+visuals, fractions/diagrams, traffic safety as ČJS učivo |
| [e-Sbírka — vyhláška č. 294/2015 Sb.](https://www.e-sbirka.cz/sb/2015/294) | Official Czech traffic-sign / road-marking implementing ordinance (stress-test asset source only) |
| `#21` / `docs/poc-definition.md` / `src/lib/training-runtime/types.ts` | Frozen Item envelope `{ id, type, payload }`; PoC `multipleChoice` \| `shortAnswer`; optional `assets/` |
| `CONTEXT.md` | Item = typed prompt-and-response; Skill Buckets share Item-shape schemas |

**Gaps (stated explicitly):** Prodigy does not publish a first-party exercise-format taxonomy in the Help articles reviewed. Duolingo does not publish a complete public exercise-type API catalog; only named listening modes appear in first-party blog copy (fan wikis list more types — **not** used as authoritative here). Kahoot Help pages are sometimes blocked to automated fetch; claims lean on the schools “how it works” page plus Help article titles/snippets that match.

---

## Current Smart Critters contract (baseline)

PoC Items are a tagged union:

| `type` | Payload (today) | Scoring key |
| --- | --- | --- |
| `multipleChoice` | `prompt`, `choices[{id,label}]`, `correctChoiceId` | Single choice id |
| `shortAnswer` | `prompt`, `acceptedAnswers[]` | Explicit accepted string set |

Envelope: `{ id, type, payload }` (`docs/poc-definition.md`, `types.ts`). Packs may reserve `assets/`; payloads are still text-only. **Additive** new types / optional fields are the intended evolution path ([#40](./content-pipeline-image-asset-strategies.md) §F).

Skill Buckets (#42 decision language in `CONTEXT.md`) are OVU-keyed and **reference shared Item-shape schemas** — this note proposes that shared catalog for #44 grilling.

---

## A. Standards catalogs (QTI 3 → kid-friendly shapes)

QTI 3 conformance lists interactions including ([QTI 3 Interactions](https://www.imsglobal.org/spec/qti/v3p0/conf)):

| QTI interaction | Kid-friendly reading | Smart Critters candidate |
| --- | --- | --- |
| Choice | Pick one (or more) from labelled options | `multipleChoice` (v1: **max 1** for integrity) |
| Text entry / extended text | Type a short / long answer | `shortAnswer` (keep short; defer extended rubrics) |
| Inline choice | Drop-down in a sentence | Near-term optional; or express as MC |
| Order | Reorder choices | `order` |
| Match | Pair from set A ↔ set B (`directedPair`) | `match` |
| Associate | Pair within one set | Usually fold into `match` for kids |
| Gap match | Drag tokens into blanks | `gapMatch` / cloze (later) |
| Hotspot | Select defined region(s) on an image | `hotspot` |
| Graphic order / graphic gap match / graphic associate | Order/match on a graphic | Prefer `order`/`match`/`hotspot` + image stimulus before dedicated graphic* types |
| Select point / position object | Click arbitrary point / place an object | Defer (harder AFK QA; soft area keys) |
| Drawing / upload / media / slider / PCI | Draw, file, timed media, numeric slider, custom | **Out of v1 catalog** for Training XP |

QTI response shapes that align with #39 integrity ([Beginner’s Guide](https://www.imsglobal.org/spec/qti/v3p0/guide)):

- **Single identifier** → MC / hotspot (single region) / inline choice  
- **Ordered identifiers** → order  
- **Set of directed pairs** → match / gap match  
- **String / string set** → short answer  

**Product rule:** for v1 Training scoring, prefer **cardinality that is still one clear key** — e.g. one hotspot, one complete ordered list, one complete pair-set — not partial credit or multiselect-without-explicit-key.

---

## B. H5P content types (pedagogy catalog)

H5P’s author tutorials and H5P.com recommendations surface a popular classroom interaction vocabulary ([tutorials](https://h5p.org/documentation/for-authors/tutorials); [recommendations](https://help.h5p.com/hc/en-us/articles/7505649072797-Content-types-recommendations)):

| H5P type | Maps to | Notes for Smart Critters |
| --- | --- | --- |
| Multiple Choice / Single Choice Set / True/False | `multipleChoice` | True/False = 2-choice MC |
| Multi Media Choice (was Image Choice) | `imageChoice` | Image options; strong peer for traffic signs / vocab |
| Drag and Drop | `match` or `gapMatch` | Image/text onto drop zones |
| Drag the Words / Fill in the Blanks | cloze / `gapMatch` | Language packs |
| Image Pairing / Memory Game | `match` (presentation variant) | Same scoring: pairs |
| Image Sequencing | `order` | Picture stories / Czech sequence narrate |
| Timeline | `order` + timeline **layout**, or later `timeline` alias | H5P.com marks Timeline **Not recommended** / not core-maintained in Table 2 — prefer generic `order` |
| Find the Hotspot / Find Multiple Hotspots | `hotspot` | H5P.com: **Not recommended** for Find the Hotspot — still pedagogically real; implement carefully for kids’ hit targets |
| Image Hotspots | Mostly **info** overlay, not scored quiz | Do **not** confuse with scored hotspot |
| Guess the Answer | Image stem + reveal | Closer to flashcard than Training Item |
| Question Set / Interactive Video / Branching | Session / lesson shells | **Not** Item shapes |

H5P is a **vocabulary source**, not a dependency. Prefer QTI-aligned scoring semantics + kid UI.

---

## C. Peer products (first-party only)

### Khan Academy

Help Center assessments list: multiple choice, numeric input, drop-down menus, expression entry, interactive graphing, short written responses ([Help](https://support.khanacademy.org/hc/en-us/articles/42056609697165-What-are-Khan-Academy-assessments-and-how-do-they-work)). Legacy exercise authoring documents radio/choices, rational numeric, list (drop-down), and composite `multiple` fields ([Answer Types wiki](https://github.com/Khan/khan-exercises/wiki/Writing-Exercises:-Answer-Types)).

**Takeaway:** strong on MC + typed numeric/expression + graphing; weak public emphasis on match/order/hotspot for primary. Graphing / expression → **later Maths**, not #44 shortlist.

### Duolingo

First-party blog names listening modes such as **“Tap what you hear”** and **“Repeat what you hear”**, plus a settings toggle for Listening exercises ([Dear Duolingo blog](https://blog.duolingo.com/learning-with-hearing-aids/)). No complete public exercise-type schema was found.

**Takeaway for English Skill Buckets:** audio stem + tile/order/match-to-picture is curriculum-aligned (RVP metodika: match pictures / order / fill missing info from listening — prior outcomes note). Prefer shapes `order`, `match`, and optional future `audioStem*` rather than speech scoring in v1.

### IXL

User Guide: varied stems with answers as multiple choice, fill-in-the-blank, and draw-your-own graphing ([IXL User Guide](https://www.ixl.com/materials/userguides/IXLUserGuide.pdf)). STAAR alignment page documents Hot Spot, Hot Text, Drag and Drop, Inline Choice, Fraction Model, Multiselect, Match Table Grid, Text Entry, Graphing, Number Line ([STAAR types](https://www.ixl.com/materials/us/IXL_and_the_new_STAAR_question_types)).

**Takeaway:** richest **public** peer catalog for spatial/diagram interactions; Fraction Model and Hot Spot reinforce composers + `hotspot` for Maths/ČJS.

### Kahoot!

Schools feature overview: combine quiz, poll, **puzzle**, **type answer**, word cloud, open-ended ([how it works](https://kahoot.com/schools/how-it-works/)). Help describes Puzzle as sorting answers into correct order and Type answer as typed short recall ([question types](https://support.kahoot.com/hc/en-us/articles/115002308428-Kahoot-question-types)).

**Takeaway:** puzzle ≡ `order`; type answer ≡ `shortAnswer`. Polls/word clouds are Session chrome, not Training Items.

### Quizlet

Study Modes: Learn (flashcards, multiple choice, written), Test, **Match** (race to pair terms/definitions) ([Study Modes](https://quizlet.com/en-gb/features/study-modes)).

**Takeaway:** Match validates a first-class `match` shape for vocab/pairs; Test mixes MC / written / matching / true-false at the *mode* level.

### Prodigy Math

Parent FAQ: 50k+ curriculum-aligned questions inside game combat ([FAQ](https://prodigygame.zendesk.com/hc/en-us/articles/115005952803-Getting-Started-with-Prodigy-Math-Parent-FAQ)). **No verified first-party taxonomy of interaction widgets** in the materials reviewed — do not invent one.

---

## D. Curriculum demand (what forces shapes beyond text MC/SA)

Aligned with prior research — **do not contradict**:

| Demand | Evidence | Shape implication |
| --- | --- | --- |
| Fractions / clocks / number lines / diagrams | Maths OVUs + učivo (model fractions; graphic records) — [`czech-primary-curriculum-outcomes-grades-1-5.md`](./czech-primary-curriculum-outcomes-grades-1-5.md); stem-critical composers — [#40](./content-pipeline-image-asset-strategies.md) | Image **stimulus** on MC/SA; later fraction-model composers; not a new scorer |
| Picture sequence / narrate | Czech 1. období: sequence pictures — prior outcomes note | `order` of image cards |
| Listening → match pictures / order | English metodika *Splněno* + prior `CJ-3-1-*` visual support | Audio asset + `match` / `order` / MC |
| Map / spatial orientation | ČJS `CJS-CJS-001-ZV5-002` etc.; subjects research table | Static labelled map image + `hotspot` or MC; defer pan/zoom/route draw ([subjects research](./czech-primary-subjects-grades-1-5.md)) |
| Timeline / then–now | ČJS *Lidé a čas* | `order` with timeline layout **or** dual-image stem + MC |
| Scene / model-situation / traffic roles | ČJS health & safety OVUs; prior “scene / model-situation” row | Image stem + MC (“who goes first?”, safe vs unsafe) |
| Simple budget / table | ČJS finance OVUs | Table/budget **stimulus** + MC/SA |
| Traffic signs / road sense | Prior učivo “dopravní bezpečnost”; stress-test only | ImageChoice / imageStem MC / hotspot — **not** a product line |

Prior subjects research already reserved: map/spatial, timeline, diagram/observation, scene, budget/layout — this catalog **implements that reservation** as shared types + stimulus slots.

---

## E. Proposed catalog (candidate `type` + payload field sketches)

All candidates keep `{ id, type, payload }`. Fields are **sketches for grilling**, not JSON Schema.

### E.1 Keep (PoC)

**`multipleChoice`**

- Fields: `prompt`, `choices[{id,label}]`, `correctChoiceId`
- Optional additive: `stemAssetId?`, `choiceAssetId?` per choice (or migrate image options to `imageChoice`)
- Scoring: single id  
- Assets: optional supporting or stem-critical image

**`shortAnswer`**

- Fields: `prompt`, `acceptedAnswers[]`
- Optional: `stemAssetId?`
- Scoring: accepted set (existing trim/case-fold rules)

### E.2 Near-term pipeline (recommended lock candidates for #44)

**`imageChoice`** (H5P Multimedia Choice / traffic-sign / vocab)

- Fields: `prompt`, `choices[{id, assetId, label?}]`, `correctChoiceId`
- Scoring: single id  
- Assets: **required** per choice (stem-critical or labelled clipart)

**`order`**

- Fields: `prompt`, `items[{id, label?, assetId?}]`, `correctOrder: id[]`
- Scoring: ordered id list equals `correctOrder`  
- Assets: optional (picture sequencing uses assets)  
- Covers: Kahoot puzzle, QTI order, H5P Image Sequencing, English “order what you heard”

**`match`**

- Fields: `prompt`, `left[{id,label?,assetId?}]`, `right[{id,label?,assetId?}]`, `correctPairs: [{leftId,rightId}, …]`
- Scoring: set of directed pairs equals `correctPairs` (order of pairs irrelevant)  
- Assets: optional on either side  
- Covers: QTI match, Quizlet Match, listen→picture, term↔definition

**Image / audio stimulus on MC/SA** (prefer payload extension over exploding type count)

- Grill option A: optional `stimulus: { kind: 'image'|'audio', assetId }` on existing types (matches [#40](./content-pipeline-image-asset-strategies.md) stimulus-slot idea)  
- Grill option B: sibling types `imageStemMultipleChoice` / `audioStemMultipleChoice` if you want stricter renderer registries

### E.3 Later Social Sciences / richer Maths

**`hotspot`**

- Fields: `prompt`, `imageAssetId`, `hotspots[{id, shape:'rect'|'circle'|'poly', coords…}]`, `correctHotspotId` (v1: single)
- Scoring: single hotspot id  
- Assets: **required** stem-critical image (map, diagram, sign board, scene)  
- Covers: QTI hotspot, IXL Hot Spot, map “where is X?”, “tap the correct sign region”

**`gapMatch` / cloze** (language)

- Fields: `promptHtml` or `segments[]` with gaps, `choices[]`, `correctPairs` gap↔choice  
- Scoring: directed pairs  
- Defer until Czech/English packs need in-context blanks beyond SA

**Layout aliases (not separate scorers unless #44 wants names):**

| Alias | Prefer implement as | Why |
| --- | --- | --- |
| `timeline` | `order` + `layout: 'timeline'` | Same key = ordered ids |
| `sceneRules` | MC/imageChoice + scene `stemAssetId` | “Who goes first?” is still a single choice |
| `tableBudget` | MC/SA + `stimulus.kind: 'table'` | Scoring stays MC/SA |
| `mapLocate` | `hotspot` on map asset | Avoid second spatial dialect |

### E.4 Explicitly defer / out of shared v1 catalog

| Shape | Why defer |
| --- | --- |
| Multiselect MC (`maxChoices>1`) | Integrity risk unless entire correct **set** is explicit and taught as multi-key |
| Freehand drawing / upload | No reliable AFK key; QTI drawing is file-based |
| Select-point soft areas | Ambiguous kid UX + QA |
| Speech / “speak the words” | Media + scoring complexity; H5P marks Speak types not recommended / Chrome-only |
| Interactive graphing / fraction-model constructors | Powerful (IXL/Khan) but composer+widget heavy — pipeline can fake via image stem first |
| Multipart evidence Items | Session-level; conflicts with one-Item / one-key Training loop |
| Full map pan/zoom/route | Already deferred in subjects research |

---

## F. Traffic-sign stress-test

Official Czech sign/marking catalog lives in **vyhláška č. 294/2015 Sb.** (implementing rules of road traffic), available via [e-Sbírka](https://www.e-sbirka.cz/sb/2015/294) (annexes illustrate vertical/horizontal signs). Use only as **asset authenticity** for ČJS-style safety Items — **not** a driver-education product commitment (map out of scope).

| Prompt pattern | Sufficient type? |
| --- | --- |
| “What does this sign mean?” + text choices | `multipleChoice` + stem image |
| “Which sign means X?” + four sign images | `imageChoice` |
| “Tap the sign that means X” on a board collage | `hotspot` |
| “Who goes first?” at a crossing scene | Image stem + `multipleChoice` |
| “Order these signs from warning → info” | `order` |

**Verdict:** **no dedicated `trafficSign` type.** Dedicated type would only add schema noise without new scoring semantics.

Stem-critical sign art should come from licensed/official-faithful clipart or verified SVG assembly — not freehand LLM invention that mutates meaning ([#40](./content-pipeline-image-asset-strategies.md)).

---

## G. Scoring & answer integrity (cross-cutting)

From [#39](./ed-psych-item-answer-integrity-and-ruses.md) and QTI response shapes:

| Shape | Correct key form | Integrity note |
| --- | --- | --- |
| MC / imageChoice / hotspot | One id | Distractors must be wrong, not equivalently right |
| shortAnswer | Explicit `acceptedAnswers[]` | Multi-key only when listed |
| order | Exact `id[]` | Tie/duplicate labels need unique ids |
| match | Exact set of pairs | Partial credit out of v1 XP |
| gapMatch | Exact set of pairs | Same |

Every Skill Bucket brief that targets a shape must state the key form so AFK gates can validate.

---

## H. Phasing recommendation

| Phase | Shapes | Rationale |
| --- | --- | --- |
| **PoC now** | `multipleChoice`, `shortAnswer` (text) | Frozen in `types.ts` |
| **Near-term offline pipeline** | + optional image/audio `stimulus` on MC/SA; + `imageChoice`; + `order`; + `match` | Unblocks Maths diagrams, English listening match/order, Czech picture sequences, traffic-sign stress-test without ČJS packs |
| **Later Social Sciences** | + `hotspot` (maps/scenes); layout conventions for timeline/table; richer stimuli | Matches reserved seams in subjects research |
| **Later / gifted track** | graphing widgets, cloze, soft select-point, speech | After integrity + asset policy (#47) settle |

---

## Options for grilling (#44)

### Recommended catalog shortlist (lock candidates)

1. **`multipleChoice`** — keep; allow optional image/audio stimulus  
2. **`shortAnswer`** — keep; allow optional image/audio stimulus  
3. **`imageChoice`** — image options; single `correctChoiceId`  
4. **`order`** — `correctOrder: id[]` (covers timeline/picture sequence/puzzle)  
5. **`match`** — `correctPairs[]` (covers vocab, listen→picture, classify-to-bin as pairs)  
6. **`hotspot`** — single `correctHotspotId` on stem-critical image (covers map locate + collage tap)

### Grill questions

1. **Stimulus vs new types:** optional `stimulus` on MC/SA, or explode `imageStemMultipleChoice` / `audioStemMultipleChoice`?  
2. **Timeline / scene / budget:** layout flags on shared types, or named aliases in the catalog?  
3. **`hotspot` in near-term or Social Sciences-only?** (Maps need it; traffic-sign collage can wait.)  
4. **Cloze / `gapMatch`:** near-term for language, or defer behind SA?  
5. **Multiselect:** ban in v1, or allow only with explicit full-set key + kid copy that says “pick all”?  
6. **True/false:** separate type or 2-option MC?  
7. **Asset ref style:** path vs `assetId` registry vs stimulus object — coordinate with #47, don’t fork.

### Not recommended to lock

- Dedicated `trafficSign`, `timeline`, `mapLocate`, `sceneRules`, `budget` as **separate scorers**  
- Drawing, speech, soft select-point, interactive graphing as v1 Training types  
- Breaking `{ id, type, payload }` or per-bucket private schemas

---

## Conflicts / continuity with prior research & CONTEXT.md

| Topic | Status |
| --- | --- |
| ČJS ≡ Social Sciences; reserve map/timeline/scene/budget | **Aligned** — expressed as shared shapes + stimuli |
| Defer pan/zoom/route maps, freehand, fieldwork | **Aligned** |
| Stem-critical vs supporting assets (#40) | **Aligned** — hotspot/map/sign/fraction images are stem-critical |
| Answer integrity / no ruses (#39) | **Aligned** — single explicit keys per shape |
| Skill Buckets share Item-shape catalog (#42 / CONTEXT) | **Aligned** — this is that catalog proposal |
| PoC types remain MC + SA | **Aligned** — additive only |
| Driver education product | **Out of scope** — traffic signs are stress-test / ČJS safety only |

No hard contradictions found with `CONTEXT.md` or the cited prior research notes.

---

## Suggested map Decisions-so-far one-liner

> Item shapes beyond text MC/SA: research (#43) recommends additive shared catalog — keep MC/SA (+ optional image/audio stimulus), add `imageChoice` / `order` / `match`, then `hotspot`; treat timeline/scene/budget/traffic-sign as stimulus/layout over those scorers — grilling in #44.

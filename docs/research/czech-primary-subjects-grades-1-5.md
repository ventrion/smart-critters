# Czech primary Subjects (grades 1–5) for Item planning

**Ticket:** [#20 — Research Czech primary subjects grades 1–5 for Item planning](https://github.com/ventrion/smart-critters/issues/20)  
**Map parent:** [#18 — Smart Critters: first usable PoC definition](https://github.com/ventrion/smart-critters/issues/18)  
**Domain terms:** Content Pack, Item, Subject, Training (see `CONTEXT.md`)  
**Date:** 2026-07-21

## Question

From official Czech primary (*základní škola*) curriculum sources, what are the Subject areas for grades 1–5 — especially how product “Social Sciences” maps (e.g. *Člověk a jeho svět* / related educational areas) — and what Item/prompt shapes (text-only vs visual/map/layout-heavy) should the PoC definition reserve renderer extensibility for, even though Social Sciences content is not in the first PoC packs?

## Answer (short)

1. For grades **1–5** (*1. stupeň*), product **Social Sciences** maps to the educational area **Člověk a jeho svět** — the only RVP area designed exclusively for the first stage. It is **not** *Člověk a společnost* (that is second-stage history/civics).
2. First-stage Subjects that matter for Smart Critters near-term: **Czech**, **English**, **Maths** (PoC packs), plus planning for **Člověk a jeho svět** as Social Sciences.
3. PoC Item types (multiple choice + short answer) cover text-heavy Czech/English/Maths; renderer seams should still reserve **map/spatial**, **timeline/then–now**, **diagram/observation**, **model-situation with visual scene**, and **simple budget/layout** shapes for later Social Sciences Content Packs.

---

## Official sources used

| Source | Role |
| --- | --- |
| [RVP ZV digital (prohlednout.rvp.cz)](https://prohlednout.rvp.cz/zakladni-vzdelavani) | Authoritative browsing text of RVP ZV 2025 (MŠMT č. j. MSMT-20704/2024-5, as amended MSMT-11173/2025-4) |
| [Člověk a jeho svět area page](https://prohlednout.rvp.cz/zakladni-vzdelavani/vzdelavaci-oblasti/cjs) | Official area characterisation + six thematic circles |
| [1. stupeň OVU overview PDF (NPI / revize.rvp.cz)](https://revize.rvp.cz/files/2025-09-24-rvp-zv-2025-1stupen.pdf) | Compiled binding OVUs for grade-5 node on first stage |
| [MŠMT measure issuing RVP ZV 2025](https://edu.gov.cz/wp-content/uploads/2025/07/opatreni_ministra_RVP_ZV_MSMT-20704_2024-5.pdf) | Legal issuance + phased ŠVP transition |
| [MŠMT RVP ZV landing (edu.gov.cz)](https://edu.gov.cz/dokumenty/rvp-ramcove-vzdelavaci-programy/rvp-zv-ramcovy-vzdelavaci-program-pro-zakladni-vzdelavani/) | Prior RVP ZV 2023 still relevant during transition |
| [Digifolio: Člověk a jeho svět (prior RVP ZV)](https://digifolio.rvp.cz/view/view.php?id=10709) | Prior five-circle structure + common school subject split (*Prvouka* / *Vlastivěda* / *Přírodověda*) |
| [NPI “Klíčové změny a inovace” PDF](https://revize.rvp.cz/files/ramcovy-vzdelavaci-program-pro-zakladni-vzdelavani-rvp-zv-klicove-zmeny-a-inovace.pdf) | Official change note: maps, finance circle, continuity of integrated area |

Secondary methodological FAQ PDFs from revize.rvp.cz were used only to confirm change narrative already stated in the binding overview; claims below cite the primary documents above.

---

## Curriculum frame (grades 1–5)

Czech primary schools implement a **school educational programme (ŠVP)** derived from the state **Rámcový vzdělávací program pro základní vzdělávání (RVP ZV)** issued by MŠMT. First stage = **1.–5. ročník**.

As of 2025–2026:

- **New RVP ZV 2025** is issued and browsable at prohlednout.rvp.cz; schools may start teaching under ŠVPs aligned to it from **1 September 2025**, with full alignment phased through the early 2030s ([MŠMT measure MSMT-20704/2024-5](https://edu.gov.cz/wp-content/uploads/2025/07/opatreni_ministra_RVP_ZV_MSMT-20704_2024-5.pdf); later schedule amendments exist on edu.gov.cz).
- Until a given grade’s ŠVP is revised, schools continue under the **prior RVP ZV** (commonly the 2021/2023 line on [edu.gov.cz](https://edu.gov.cz/dokumenty/rvp-ramcove-vzdelavaci-programy/rvp-zv-ramcovy-vzdelavaci-program-pro-zakladni-vzdelavani/)).

**Product implication:** Subject naming for Content Packs should prefer stable RVP *educational areas / fields* (*vzdělávací oblasti / obory*), not only traditional timetable labels, because ŠVP subject names vary by school.

---

## Educational areas and first-stage Subjects

### Ten areas in RVP ZV 2025 (whole basic education)

RVP ZV 2025 defines **ten educational areas** with one or more educational fields ([RVP ZV §4.4 text via prohlednout / PDF copies](https://prohlednout.rvp.cz/zakladni-vzdelavani)):

| Educational area (*vzdělávací oblast*) | Educational fields (*obory*) | On 1. stupeň (1–5)? |
| --- | --- | --- |
| Jazyk a jazyková komunikace | Český jazyk a literatura; Anglický jazyk; Další cizí jazyk | Czech + English yes; further foreign language mainly later |
| Matematika a její aplikace | Matematika | Yes |
| Informatika | Informatika | Yes |
| **Člověk a jeho svět** | **Člověk a jeho svět** | **Yes — only this stage** |
| Člověk a společnost | Dějepis; Výchova k občanství | No (2. stupeň) |
| Geografie | Geografie | No (2. stupeň; split out as own area in 2025) |
| Člověk a příroda | Fyzika; Chemie; Přírodopis | No (2. stupeň) |
| Umění a kultura | Výtvarná a filmová výchova; Hudební, taneční a dramatická výchova | Yes |
| Člověk, zdraví a bezpečí | Výchova ke zdraví a bezpečí; Tělesná výchova | TV yes; health content also overlaps ČJS on stage 1 |
| Člověk, jeho osobnost a svět práce | Osobnostní a sociální výchova; Polytechnická výchova a praktické činnosti | Yes |

### Binding first-stage overview list (OVU summary)

The official first-stage overview lists these fields with grade-5 OVUs ([1. stupeň PDF](https://revize.rvp.cz/files/2025-09-24-rvp-zv-2025-1stupen.pdf)):

- Český jazyk  
- Anglický jazyk  
- Matematika  
- Informatika  
- Člověk a jeho svět  
- Výtvarná a filmová výchova  
- Hudební, taneční a dramatická výchova  
- Tělesná výchova  
- Osobnostní a sociální výchova  
- Polytechnická výchova a praktické činnosti  

RUP notes relevant to product Subjects: English from grade 1 (with a limited exception path if another foreign language starts in grade 1); PE minimum 2 hours/week ([RVP ZV RUP chapter](https://prohlednout.rvp.cz/zakladni-vzdelavani)).

### Mapping to Smart Critters Subjects

| Product Subject (`CONTEXT.md`) | RVP mapping (grades 1–5) | PoC Content Packs |
| --- | --- | --- |
| Maths | Matematika (area Matematika a její aplikace) | In scope |
| Czech | Český jazyk a literatura | In scope |
| English | Anglický jazyk | In scope |
| **Social Sciences** | **Člověk a jeho svět** (integrated first-stage area) | Planning / renderer seams only |

Do **not** map Social Sciences to *Člověk a společnost* for grades 1–5: that area (history + civics) is second stage. First-stage “social” content lives inside Člověk a jeho svět, alongside early geography, nature, health/safety, and finance.

---

## How “Social Sciences” maps: Člověk a jeho svět

### Characterisation (official)

Člověk a jeho svět is the **only** educational area conceived **exclusively for 1. stupeň**. It integrates knowledge about people, family, society, homeland, nature, culture, health, safety, and practical life skills into one synthetic view of the world ([area page](https://prohlednout.rvp.cz/zakladni-vzdelavani/vzdelavaci-oblasti/cjs); [1. stupeň PDF](https://revize.rvp.cz/files/2025-09-24-rvp-zv-2025-1stupen.pdf)).

The 2025 revision **keeps** that integrated design (natural-science, social-science, cultural-historical, and health/safety threads together) and stresses place-based learning and **spatial orientation including map work** ([Klíčové změny PDF](https://revize.rvp.cz/files/ramcovy-vzdelavaci-program-pro-zakladni-vzdelavani-rvp-zv-klicove-zmeny-a-inovace.pdf)).

### Thematic circles

**RVP ZV 2025 — six circles** ([area page](https://prohlednout.rvp.cz/zakladni-vzdelavani/vzdelavaci-oblasti/cjs)):

1. Místo, kde žijeme  
2. Lidé kolem nás  
3. Lidé a čas  
4. Rozmanitost přírody  
5. Člověk, jeho zdraví a bezpečí  
6. Lidé a svět financí *(new as a separate circle)*  

**Prior RVP ZV — five circles** (finance topics nested under *Lidé kolem nás*) ([Digifolio](https://digifolio.rvp.cz/view/view.php?id=10709)):

1. Místo, kde žijeme  
2. Lidé kolem nás  
3. Lidé a čas  
4. Rozmanitost přírody  
5. Člověk a jeho zdraví  

### Common school timetable labels (ŠVP, not RVP-mandated names)

Prior RVP guidance notes schools often implement ČJS as:

- **Prvouka** in grades 1–3 (all circles mixed), and  
- **Vlastivěda** (circles 1–3) + **Přírodověda** (circles 4–5) in grades 4–5,  

or other mergers ([Digifolio footnote](https://digifolio.rvp.cz/view/view.php?id=10709)).

**Product implication:** one Subject “Social Sciences” / Content Pack channel for ČJS is enough; optional pack tags for *Prvouka* / *Vlastivěda* / *Přírodověda* are ŠVP flavour, not separate RVP areas.

### Bridge to later grades (out of PoC, useful for naming)

After grade 5, ČJS feeds specialised second-stage areas: *Člověk a společnost*, *Geografie*, *Člověk a příroda*, and health-related fields ([Digifolio characterisation](https://digifolio.rvp.cz/view/view.php?id=10709); 2025 area list above). Later “Social Sciences” expansion beyond primary would split; for grades 1–5 it stays one integrated Subject.

---

## Item / prompt shapes for renderer extensibility

PoC Training Items are **multiple choice** and **short answer** with typed, pluggable renderers (issue #18). Social Sciences packs are out of the PoC success bar, but OVUs show prompt shapes that **cannot** be faithfully covered by text-only stems alone.

### Shapes driven by ČJS OVUs (reserve seams)

Evidence from grade-5 OVUs in the [1. stupeň overview](https://revize.rvp.cz/files/2025-09-24-rvp-zv-2025-1stupen.pdf) and the area characterisation:

| Prompt shape | Why (curriculum cue) | Example OVU / note |
| --- | --- | --- |
| **Map / spatial** | Explicit map use for orientation and talking about the world; landscape types; locating own region, Czech regions, neighbours, selected states | `CJS-CJS-001-ZV5-002` *Využívá mapy k orientaci…*; `…001`, `…004`; change note stresses map work |
| **Timeline / then–now layout** | Compare past vs present life; holidays/traditions; local history from multiple sources | `…012`–`…014` (*Lidé a čas*) |
| **Visual classification / observation** | Living vs non-living nature; organism traits; Earth in solar system; measurement readouts | `…015`–`…021` (*Rozmanitost přírody*) |
| **Scene / model-situation (often illustrated)** | Rights/duties; unsafe digital/offline behaviour; traffic roles; first aid; emergency services | `…008`–`…010`, `…022`–`…032` |
| **Simple budget / table layout** | Money in model situations; personal budget | `…033`–`…035` (*Lidé a svět financí*) |
| **Multi-part / multi-stimulus stem** | Local history from ≥2 sources; interpret/apply info about place and region | Characterisation + `…012` |

These are **Content Pack Item type / renderer** concerns, not Session-flow concerns. Text-only MC/short-answer remains valid for many ČJS Items (definitions, holidays, rules), but a PoC that hard-codes “stem = string, options = strings” without a media/layout slot will block later Social Sciences packs.

### Adjacent first-stage cue (Maths)

Maths already expects pupils to **record data graphically and read/interpret graphic records** (`Získává data, graficky je zaznamenává…` in the same [1. stupeň overview](https://revize.rvp.cz/files/2025-09-24-rvp-zv-2025-1stupen.pdf)). Reserving a shared **chart/figure stimulus** renderer helps both Maths enrichment and ČJS nature/measurement Items later — without putting Social Sciences into first PoC packs.

### Recommended PoC design reservation (not implementation)

For the hand-offable PoC definition (#18), treat as **prepared-for seams**:

1. **Item stimulus slots** beyond plain text: image, simple map, timeline, table/budget, diagram.  
2. **Pluggable Item types** (already assumed): keep the type → renderer registry open; do not bake “MC/short answer = text only” into the Content Pack schema.  
3. **Subject enum** includes Social Sciences / Člověk a jeho svět even if no PoC packs ship for it.  
4. **Defer** full map interaction (pan/zoom/draw route), freehand drawing, and multi-step fieldwork Tasks — note them as post-PoC; the PoC need only avoid schema/renderer dead-ends.

Out of scope for renderer planning here: PE performance, art production, music performance, full polytechnic making — those Subjects are in RVP first stage but outside product Training focus.

---

## Decisions implied for #18

- Product Subject **Social Sciences** ≡ RVP **Člověk a jeho svět** (grades 1–5).  
- First PoC Content Packs stay Maths / Czech / English for grades 2 and 4.  
- Item model should reserve non-text stimuli and layout-heavy stems for later ČJS packs (maps, timelines, diagrams, illustrated model situations, simple budgets).

## Open follow-ups (not answered here)

- Exact Content Pack taxonomy tags for ČJS circles vs *Prvouka*/*Vlastivěda*/*Přírodověda*.  
- Which map fidelity (static labelled image vs interactive) is enough for grade 2 vs 4.  
- Curriculum-aligned fake/seed topic lists once offline generation pipelines exist (already on #18 “Not yet specified”).

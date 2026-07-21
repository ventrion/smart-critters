# Czech primary curriculum outcomes (grades 1–5) for skill-bucket design

**Ticket:** [#37 — Research Czech ministry curriculum outcomes per grade](https://github.com/ventrion/smart-critters/issues/37)  
**Map parent:** [Smart Critters: offline content pipeline definition](https://github.com/ventrion/smart-critters/issues/36) (precedes [Decide skill-bucket system for pipeline inputs](https://github.com/ventrion/smart-critters/issues/42))  
**Builds on:** [`czech-primary-subjects-grades-1-5.md`](./czech-primary-subjects-grades-1-5.md) ([Research Czech primary subjects grades 1–5 for Item planning](https://github.com/ventrion/smart-critters/issues/20) — Subject naming / ČJS mapping)  
**Domain terms:** Content Pack, Item, Subject, Training (see `CONTEXT.md`)  
**Date:** 2026-07-21

## Question

What do Czech primary grades **1–5** actually need to learn per Subject under ministry / RVP (and related approved curriculum materials): concrete per-grade learning outcomes and topic expectations for **Maths**, **Czech**, **English**, and **Člověk a jeho svět** — deep enough to drive a skill-bucket system that precedes content generation?

## Answer (short)

1. **RVP ZV 2025 does not publish binding per-grade (1 / 2 / 3 / 4 / 5) outcomes for these Subjects.** Binding subject OVUs (*očekávané výsledky učení*) sit at the **grade-5 uzlový bod** (`ZV5`). Basic gramotnosti additionally have a **grade-3** node (`ZV3`). Per-grade sequencing lives in each school’s **ŠVP** and in non-binding **metodická podpora** (levels *Na začátku → Na cestě → Splněno*).
2. **Prior RVP ZV (2021/2023 line)** — still active for grades whose ŠVP has not yet transitioned — is the finest official outcome grain: **1. období (end of grade 3, orientational)** and **2. období (end of grade 5, binding)**, plus recommended *učivo*.
3. **English timing changed:** prior RVP mandates *Cizí jazyk* from **grade 3** (earlier optional); RVP ZV 2025 mandates **Anglický jazyk from grade 1**, target **SERR A1** by end of 1. stupeň.
4. Product Social Sciences remains **Člověk a jeho svět** (six circles in 2025, including new *Lidé a svět financí*). Do not use *Člověk a společnost*.

**Skill-bucket design implication:** treat **period / uzlový bod** as the official grain; use prior-RVP 1. období lists + 2025 metodika progressions as **secondary approved scaffolding** for grades 1–2–3–4 interim buckets — never invent ministry-owned per-grade standards.

---

## Official sources used

| Source | Role / ownership |
| --- | --- |
| [RVP ZV digital (prohlednout.rvp.cz)](https://prohlednout.rvp.cz/zakladni-vzdelavani) | Authoritative browsing text of RVP ZV 2025 (MŠMT č. j. MSMT-20704/2024-5, as amended) — NPI / MŠMT |
| [1. stupeň OVU overview PDF](https://revize.rvp.cz/files/2025-09-24-rvp-zv-2025-1stupen.pdf) | Compiled binding OVUs for grade-5 node on first stage — NPI ČR, Sept 2025 |
| [Matematika field page](https://prohlednout.rvp.cz/zakladni-vzdelavani/vzdelavaci-oblasti/mat/mat) | ZV5 Maths OVU list + thematic circles — NPI |
| [Český jazyk a literatura](https://prohlednout.rvp.cz/zakladni-vzdelavani/vzdelavaci-oblasti/jjk/cjl) | ZV5 Czech OVU list — NPI |
| [Anglický jazyk](https://prohlednout.rvp.cz/zakladni-vzdelavani/vzdelavaci-oblasti/jjk/aja) | ZV5 English OVU list + SERR A1 target — NPI |
| [Člověk a jeho svět](https://prohlednout.rvp.cz/zakladni-vzdelavani/vzdelavaci-oblasti/cjs/cjs) | ZV5 ČJS OVU list (six circles) — NPI |
| [Metodika example MAT-MAT-001-ZV5-001](https://prohlednout.rvp.cz/metodika/mat-mat-001-zv5-001) | Non-binding *Na začátku / Na cestě / Splněno* progression — NPI |
| [Metodika example JJK-AJA-001-ZV5-001](https://prohlednout.rvp.cz/metodika/jjk-aja-001-zv5-001) | Non-binding English reception progression — NPI |
| [RVP ZV 2023 čistá verze (edu.gov.cz)](https://edu.gov.cz/wp-content/uploads/2023/07/RVP_ZV_2023_cista_verze.pdf) | Prior framework: 1./2. období outcomes + učivo — MŠMT |
| [MŠMT RVP ZV landing](https://edu.gov.cz/dokumenty/rvp-ramcove-vzdelavaci-programy/rvp-zv-ramcovy-vzdelavaci-program-pro-zakladni-vzdelavani/) | Transition context: prior RVP still relevant until ŠVP aligned |
| Prior research note [#20](./czech-primary-subjects-grades-1-5.md) | Subject naming / ČJS ↔ Social Sciences mapping (do not contradict) |

**Not used as ownership for claims:** blog posts, textbook marketing, individual school ŠVPs (ŠVP is school-local; patterns noted only where RVP itself describes common practice).

---

## Curriculum frame and granularity

### What RVP owns vs what schools own

| Layer | Who owns it | Grain for grades 1–5 |
| --- | --- | --- |
| **RVP ZV 2025 OVU** | MŠMT / NPI binding | Subject fields: **end of grade 5** (`…-ZV5-…`). Gramotnosti: **end of grade 3 and 5**. |
| **RVP ZV 2025 metodická podpora** | NPI, **non-binding** | Progress descriptors *Na začátku / Na cestě / Splněno* (+ MDÚ) per OVU — useful scaffolding for interim buckets |
| **Prior RVP ZV 2023 očekávané výstupy** | MŠMT binding (where ŠVP not yet on 2025) | **1. období** = end of grade 3 (**orientational / nezávazné**); **2. období** = end of grade 5 (**závazné**) |
| **Prior RVP učivo** | MŠMT **recommended** (not binding topic lists) | Thematic bullets schools adapt into ŠVP |
| **ŠVP** | Each school | Actual per-grade distribution of content |

From prior RVP ZV 2023 (MŠMT):

> Očekávané výstupy RVP ZV na konci 5. ročníku (2. období) a 9. ročníku stanovují **závaznou** úroveň… Očekávané výstupy na konci 3. ročníku (1. období) stanovují jen **orientační (nezávaznou)** úroveň…

From RVP ZV 2025 overview / full text (NPI / MŠMT): OVUs of educational fields are binding at **uzlové body 5. and 9. ročník**; basic gramotnosti also at **3. ročník**.

### Transition (product-relevant)

- Schools may teach under ŠVPs aligned to **RVP ZV 2025** from **1 Sept 2025**, with full alignment phased (see MŠMT measures on edu.gov.cz; prior note #20).
- Until a grade’s ŠVP is revised, **prior RVP ZV** outcomes still govern that cohort.
- For Smart Critters skill buckets spanning mixed schools: prefer **stable field codes** (2025 `MAT-MAT-…`, `JJK-CJL-…`, `JJK-AJA-…`, `CJS-CJS-…`) as primary keys, and map prior codes (`M-5-…`, `ČJL-5-…`, `CJ-5-…`, `ČJS-5-…`) as aliases during transition.

### Adjacent (not Subject packs, but useful for Czech/Maths items)

**Čtenářská a pisatelská gramotnost** and **Logicko-matematická gramotnost** have binding ZV3 + ZV5 OVUs in RVP ZV 2025 (see 1. stupeň overview). They cross-cut Czech and Maths Items; do not invent a fifth Subject for them, but skill buckets may tag gramotnost codes.

---

## Matematika a její aplikace (Maths)

### RVP ZV 2025 — thematic circles and ZV5 OVUs (binding)

Source: [Matematika](https://prohlednout.rvp.cz/zakladni-vzdelavani/vzdelavaci-oblasti/mat/mat); [1. stupeň PDF](https://revize.rvp.cz/files/2025-09-24-rvp-zv-2025-1stupen.pdf). Content aligned to UNESCO Global Proficiency Framework (stated in RVP characterisation).

| Circle (*tematický okruh*) | Code | OVU (end of grade 5) |
| --- | --- | --- |
| Číslo a početní operace | `MAT-MAT-001-ZV5-001` | Řeší problémy s přirozenými čísly (včetně nuly) v kontextu reálných situací. |
| | `MAT-MAT-001-ZV5-002` | Modeluje a používá zlomky v praktických situacích. |
| | `MAT-MAT-001-ZV5-003` | Modeluje kladná desetinná čísla pomocí reálných situací. |
| | `MAT-MAT-001-ZV5-004` | Modeluje celá záporná čísla pomocí reálných situací. |
| Měření a výpočty | `MAT-MAT-002-ZV5-005` | Využívá standardní jednotky délky k odhadu, měření a porovnávání, prostřednictvím manipulace zjišťuje obsah a objem. |
| Geometrie v rovině a v prostoru | `MAT-MAT-003-ZV5-006` | Modeluje a rozpozná geometrické útvary. |
| | `MAT-MAT-003-ZV5-007` | Orientuje se v rovině a v prostoru. |
| | `MAT-MAT-003-ZV5-008` | Konstruuje geometrické útvary podle zadaných parametrů. |
| Statistika a pravděpodobnost | `MAT-MAT-004-ZV5-009` | Získává data, graficky je zaznamenává, grafický záznam dat čte a interpretuje. |
| | `MAT-MAT-004-ZV5-010` | Experimentuje, eviduje a popisuje náhodné jevy. |
| | `MAT-MAT-004-ZV5-011` | Vyhledá všechny prvky nebo skupiny prvků splňující dané podmínky. |
| Algebra | `MAT-MAT-005-ZV5-012` | Rozpozná, zdůvodní, doplní a tvoří pravidelnosti a řady čísel. |
| | `MAT-MAT-005-ZV5-013` | Řeší jednoduché reálné problémy s využitím rovnosti a nerovnosti. |

**Suggested skill-bucket keys (product):** one bucket per OVU code above; optional sub-buckets from metodika levels (below).

### Non-binding progression (metodika) — example depth for natural numbers

Source: [metodika MAT-MAT-001-ZV5-001](https://prohlednout.rvp.cz/metodika/mat-mat-001-zv5-001) (NPI; **not** ŠVP-binding).

| Level | Concrete expectations (summary owned by metodika) |
| --- | --- |
| *Na začátku* | Count sequences; represent counts multiple ways; read/write naturals in decimal system |
| *Na cestě* | Number as quantity vs measure; word problems with number roles (state / operator / address); place value; + − × ÷ to 10 000 mental & written; estimate; round; number-line / hundred chart structure |
| *Splněno* | Multi-operation expressions with brackets & precedence; word problems with antisignal / surplus data; add/subtract >1000 with regrouping; multiply/divide by 1-digit; multiply two 2-digit numbers |
| *MDÚ* | Simpler problems; add/subtract to 1000; multiply/divide within small multiplication table |

**Product use:** metodika levels ≈ interim difficulty bands inside a ZV5 OVU bucket (e.g. for Content Packs aimed at grades 2 vs 4), **labelled as NPI scaffolding, not ministry grade standards**.

### Prior RVP ZV 2023 — period outcomes + učivo (for transition / finer grain)

Source: [RVP ZV 2023 čistá verze](https://edu.gov.cz/wp-content/uploads/2023/07/RVP_ZV_2023_cista_verze.pdf) §5.2.1. Circles: *Číslo a početní operace*; *Závislosti, vztahy a práce s daty*; *Geometrie v rovině a v prostoru*; *Nestandardní aplikační úlohy a problémy* (2. období only).

#### 1. období (orientational, end of grade 3)

| Code | Outcome (žák…) |
| --- | --- |
| `M-3-1-01` | používá přirozená čísla k modelování reálných situací, počítá předměty v daném souboru, vytváří soubory s daným počtem prvků |
| `M-3-1-02` | čte, zapisuje a porovnává přirozená čísla do 1 000, užívá a zapisuje vztah rovnosti a nerovnosti |
| `M-3-1-03` | užívá lineární uspořádání; zobrazí číslo na číselné ose |
| `M-3-1-04` | provádí zpaměti jednoduché početní operace s přirozenými čísly |
| `M-3-1-05` | řeší a tvoří úlohy, ve kterých aplikuje a modeluje osvojené početní operace |
| `M-3-2-01` | orientuje se v čase, provádí jednoduché převody jednotek času |
| `M-3-2-02` | popisuje jednoduché závislosti z praktického života |
| `M-3-2-03` | doplňuje tabulky, schémata, posloupnosti čísel |
| `M-3-3-01` | rozezná, pojmenuje, vymodeluje a popíše základní rovinné útvary a jednoduchá tělesa; nachází v realitě jejich reprezentaci |
| `M-3-3-02` | porovnává velikost útvarů, měří a odhaduje délku úsečky |
| `M-3-3-03` | rozezná a modeluje jednoduché souměrné útvary v rovině |

#### 2. období (binding, end of grade 5)

| Code | Outcome (žák…) |
| --- | --- |
| `M-5-1-01` | využívá při pamětném i písemném počítání komutativnost a asociativnost sčítání a násobení |
| `M-5-1-02` | provádí písemné početní operace v oboru přirozených čísel |
| `M-5-1-03` | zaokrouhluje přirozená čísla, provádí odhady a kontroluje výsledky početních operací v oboru přirozených čísel |
| `M-5-1-04` | řeší a tvoří úlohy, ve kterých aplikuje osvojené početní operace v celém oboru přirozených čísel |
| `M-5-1-05` | modeluje a určí část celku, používá zápis ve formě zlomku |
| `M-5-1-06` | porovná, sčítá a odčítá zlomky se stejným jmenovatelem v oboru kladných čísel |
| `M-5-1-07` | přečte zápis desetinného čísla a vyznačí na číselné ose desetinné číslo dané hodnoty |
| `M-5-1-08` | porozumí významu znaku „−“ pro zápis celého záporného čísla a toto číslo vyznačí na číselné ose |
| `M-5-2-01` | vyhledává, sbírá a třídí data |
| `M-5-2-02` | čte a sestavuje jednoduché tabulky a diagramy |
| `M-5-3-01` | narýsuje a znázorní základní rovinné útvary (čtverec, obdélník, trojúhelník a kružnici); užívá jednoduché konstrukce |
| `M-5-3-02` | sčítá a odčítá graficky úsečky; určí délku lomené čáry, obvod mnohoúhelníku sečtením délek jeho stran |
| `M-5-3-03` | sestrojí rovnoběžky a kolmice |
| `M-5-3-04` | určí obsah obrazce pomocí čtvercové sítě a užívá základní jednotky obsahu |
| `M-5-3-05` | rozpozná a znázorní ve čtvercové síti jednoduché osově souměrné útvary a určí osu souměrnosti útvaru překládáním papíru |
| `M-5-4-01` | řeší jednoduché praktické slovní úlohy a problémy, jejichž řešení je do značné míry nezávislé na obvyklých postupech a algoritmech školské matematiky |

**Recommended učivo (prior RVP, non-binding topic palette):** přirozená / celá / desetinná čísla, zlomky; zápis v desítkové soustavě a znázornění (osa, teploměr, model); násobilka; vlastnosti operací; písemné algoritmy; závislosti; diagramy, grafy, tabulky, jízdní řády; rovinné útvary (úsečka, čtverec, obdélník, trojúhelník, kružnice…); tělesa (kvádr, krychle, jehlan, koule, kužel, válec); délka / obvod / obsah; rovnoběžky a kolmice; osová souměrnost; slovní úlohy, číselné a obrázkové řady, magické čtverce, prostorová představivost.

**2025 vs prior mapping (skill-bucket alias hints):** prior `M-5-1-*` ≈ 2025 `MAT-MAT-001-*` + parts of algebra; prior data circle ≈ `MAT-MAT-004-*`; prior geometry ≈ `MAT-MAT-003-*` + measurement `002`; prior nestandardní úlohy fold into problem-solving across 001/005. Exact 1:1 is imperfect — prefer 2025 codes going forward.

---

## Český jazyk a literatura (Czech)

### RVP ZV 2025 — ZV5 OVUs (binding; integrated field)

Source: [ČJL](https://prohlednout.rvp.cz/zakladni-vzdelavani/vzdelavaci-oblasti/jjk/cjl); [1. stupeň PDF](https://revize.rvp.cz/files/2025-09-24-rvp-zv-2025-1stupen.pdf). 2025 **does not** split binding OVUs into the old three components on 1. stupeň (characterisation still describes communication, language, literature as interlaced practice).

| Code | OVU (end of grade 5) | Skill-bucket gloss |
| --- | --- | --- |
| `JJK-CJL-001-ZV5-001` | V mluvené komunikaci používá osvojené jazykové prostředky vzhledem ke svému komunikačnímu záměru a dané komunikační situaci. | Spoken communication / register |
| `JJK-CJL-001-ZV5-002` | Využívá znalosti o slovní zásobě a způsobech jejího rozšiřování v komunikaci a při práci s textem. | Vocabulary |
| `JJK-CJL-001-ZV5-003` | Vytváří vlastní písemná sdělení s využitím osvojených mluvnických a pravopisných pravidel a znalosti vybraných slohových útvarů. | Writing + grammar/orthography + genres |
| `JJK-CJL-001-ZV5-004` | Posoudí výpověď v konkrétní situaci a adekvátně reaguje. | Listening / response |
| `JJK-CJL-001-ZV5-005` | Čte s porozuměním přiměřeně náročné texty včetně textů elektronických. | Reading comprehension (incl. digital) |
| `JJK-CJL-001-ZV5-006` | Rozpozná manipulaci v komunikaci a dokáže reagovat přiměřeně svému věku. | Media / manipulation awareness |
| `JJK-CJL-001-ZV5-007` | Experimentuje s jazyky a buduje si vztah k učení se jazykům. | Plurilingual awareness |
| `JJK-CJL-001-ZV5-008` | Vyjadřuje svoje prožitky ze čtení nebo poslechu uměleckého textu. | Literary response |
| `JJK-CJL-001-ZV5-009` | Tvořivě pracuje s uměleckým textem. | Creative literary work |

**Characterisation cues (1. stupeň):** reading-from-start toward comprehension with varied genres; writing from words/sentences toward longer intelligible texts; formative assessment / portfolios. ([ČJL page](https://prohlednout.rvp.cz/zakladni-vzdelavani/vzdelavaci-oblasti/jjk/cjl))

### Prior RVP ZV 2023 — three components × two periods

Source: [RVP ZV 2023](https://edu.gov.cz/wp-content/uploads/2023/07/RVP_ZV_2023_cista_verze.pdf) §5.1.1. Use these when designing **grade-2 / grade-4** packs during transition or when needing orthography-level grain that 2025 OVUs leave to ŠVP.

#### Komunikační a slohová výchova

**1. období:** `ČJL-3-1-01`…`11` — fluent reading with comprehension; follow oral/written instructions; conversation rules; careful pronunciation; breathing/tempo; verbal & non-verbal means; short spoken account from experience; writing hygiene; letter/digit shapes & joining; simple written messages; sequence pictures and narrate.

**2. období:** `ČJL-5-1-01`…`10` — read demanding-enough texts aloud/silently; essential vs peripheral info + record essentials; completeness of a message; reproduce content / remember facts; dialogue, phone, answering-machine message; manipulative advertising; intonation/stress/pauses/tempo; standard vs non-standard pronunciation; write simple communicative genres correctly; outline a narration and produce short spoken/written text with time sequence.

**Učivo cues:** practical & informational reading; listening; genres (pozdrav, omluva, vzkaz, zpráva, oznámení, vypravování, dopis, popis, pozvánka…); writing technique & hygiene.

#### Jazyková výchova

**1. období:** `ČJL-3-2-01`…`08` — sound vs graphic form of words; phonemes; long/short vowels; word meanings (opposites, hypernyms); classify words (action/thing/circumstance/quality); word classes in base form; correct noun/adj/verb forms in speech; join clauses; sentence types by speaker attitude; orthography of i/y after hard/soft/ambivalent consonants in vyjmenovaná slova; dě/tě/ně, ú/ů, bě/pě/vě/mě; capitals for sentence starts & typical proper names.

**2. období:** `ČJL-5-2-01`…`09` — synonymy / polysemy; root / prefix / suffix / ending; full-meaning word classes in correct forms; standard vs non-standard forms; subject–predicate pair; simple sentence vs complex; connecting expressions; i/y after ambivalent consonants; basic syntactic orthography.

#### Literární výchova

**1. období:** `ČJL-3-3-01`…`04` — read/recite age-appropriate literary texts; feelings from text; prose vs verse; fairy tale vs other narrative; creative work with text.

**2. období:** `ČJL-5-3-01`…`04` — record reading impressions; free reproduction / own literary text; artistic vs non-artistic texts; elementary literary terms in simple analysis.

**Učivo cues:** říkanka, hádanka, báseň, pohádka, bajka, povídka; verš, rým, přirovnání; author/reader/theatre roles.

### Skill-bucket recommendation (Czech)

| Bucket family | Prefer codes | Notes |
| --- | --- | --- |
| Primary (forward) | `JJK-CJL-001-ZV5-001`…`009` | Stable product keys |
| Orthography / morphology grain | prior `ČJL-*-2-*` + učivo | 2025 folds these into `…003` — keep prior codes as **sub-tags** if Items need spelling rules |
| Early literacy (grades 1–3 packs) | prior `ČJL-3-*` + ZV3 gramotnost `ZGC-*` | Orientational only |

---

## Anglický jazyk / Cizí jazyk (English)

### How English fits: RVP requirement vs school practice

| | **Prior RVP ZV 2023** (MŠMT) | **RVP ZV 2025** (MŠMT / NPI) |
| --- | --- | --- |
| Field name | *Cizí jazyk* (typically English in practice; English must be offered if not chosen as the first FL) | Explicitly **Anglický jazyk** |
| Mandatory start | **From grade 3** (3 hrs/week in RUP notes); **may start earlier** if pupils are interested | **From grade 1 to 9** (RUP: *výuka anglického jazyka od 1. do 9. ročníku*) |
| First-stage target | Outcomes at end of 1./2. období (A1-ish skills); whole *Cizí jazyk* pathway aims at **SERR A2** by end of basic education | End of 1. stupeň: **SERR A1**; end of 2. stupeň: **B1** |
| Themes (učivo) | Explicit thematic list (see below) | Characterisation: hobbies, daily routines, clothes, animals, food, sports, etc. |

Sources: prior RUP notes §7.2 ([RVP ZV 2023](https://edu.gov.cz/wp-content/uploads/2023/07/RVP_ZV_2023_cista_verze.pdf) — *Cizí jazyk* povinně do 3.–9. ročníku); 2025 RUP ([full RVP export / 1. stupeň materials](https://revize.rvp.cz/files/2025-09-24-rvp-zv-2025-1stupen.pdf); [AJA page](https://prohlednout.rvp.cz/zakladni-vzdelavani/vzdelavaci-oblasti/jjk/aja)).

**School practice caveat:** many schools already taught English in grades 1–2 via disponibilní dotace under the prior framework; RVP 2025 makes that the default. Content Packs for **grades 1–2 English** are curriculum-aligned under 2025, but may be **ahead of** schools still on prior ŠVP (mandatory only from grade 3).

### RVP ZV 2025 — ZV5 OVUs (binding) by language activity

| Activity | Code | OVU |
| --- | --- | --- |
| Recepce | `JJK-AJA-001-ZV5-001` | Rozumí konkrétním informacím v jednoduchých, pomalu a zřetelně pronášených textech. |
| | `JJK-AJA-001-ZV5-002` | Rozumí jednoduchým krátkým psaným textům. |
| Produkce | `JJK-AJA-002-ZV5-003` | Mluví v jednoduchých větách o osvojovaných tématech. |
| | `JJK-AJA-002-ZV5-004` | Napíše krátký text s použitím jednoduchých vět a slovních spojení z okruhu osvojených témat. |
| Interakce | `JJK-AJA-003-ZV5-005` | Zapojí se do jednoduchých rozhovorů týkajících se osvojených témat. |
| | `JJK-AJA-003-ZV5-006` | Napíše krátkou zprávu. |

**A1 characterisation (binding narrative):** understand and use basic expressions/phrases in speech and writing; introduce self and others; ask/answer about where people live, what they can do, interests, possessions; communicate about age-typical everyday topics ([AJA page](https://prohlednout.rvp.cz/zakladni-vzdelavani/vzdelavaci-oblasti/jjk/aja)).

**Metodika progression example** ([JJK-AJA-001-ZV5-001](https://prohlednout.rvp.cz/metodika/jjk-aja-001-zv5-001)): *Na začátku* = classroom commands (*Stand up, Listen…*); *Na cestě* = richer instructions + some topic info; *Splněno* = short slow carefully pronounced topic talks; match pictures / order / fill missing info from listening.

### Prior RVP ZV 2023 — period outcomes + thematic učivo

#### 1. období (orientational) — *Řečové dovednosti*

| Code | Outcome |
| --- | --- |
| `CJ-3-1-01` | rozumí jednoduchým pokynům a otázkám učitele… a reaguje verbálně i neverbálně |
| `CJ-3-1-02` | zopakuje a použije slova a slovní spojení ze výuky |
| `CJ-3-1-03` | rozumí obsahu jednoduchého krátkého psaného textu (s vizuální oporou) |
| `CJ-3-1-04` | rozumí obsahu jednoduchého krátkého mluveného textu… (s vizuální oporou) |
| `CJ-3-1-05` | přiřadí mluvenou a psanou podobu téhož slova / spojení |
| `CJ-3-1-06` | píše slova a krátké věty na základě textové a vizuální předlohy |

#### 2. období (binding)

| Skill | Codes | Outcomes (summary) |
| --- | --- | --- |
| Poslech | `CJ-5-1-01`…`03` | Teacher instructions; words/sentences on topics (slow, clear, preferably with visual support); simple listening text with visual support |
| Mluvení | `CJ-5-2-01`…`03` | Join simple conversations; give basic info about self/family/school/leisure; ask/answer simple topic questions |
| Čtení | `CJ-5-3-01`…`02` | Find needed info in simple topic text; understand short everyday texts (esp. with visual support) |
| Psaní | `CJ-5-4-01`…`02` | Short text with simple sentences on self/family/activities/interests; fill personal data in a form |

**Recommended tematické okruhy (učivo, prior RVP):** domov, rodina, škola, volný čas, povolání, lidské tělo, jídlo, oblékání, nákupy, bydliště, dopravní prostředky, kalendářní rok (svátky, roční období, měsíce, dny, hodiny), zvířata, příroda, počasí — plus sound/graphic form, basic vocabulary, elementary grammar as memorised repertoire (elementary errors tolerated if meaning holds).

---

## Člověk a jeho svět (Social Sciences / ČJS)

Consistent with [#20](./czech-primary-subjects-grades-1-5.md): product **Social Sciences** ≡ **Člověk a jeho svět** only on 1. stupeň.

### RVP ZV 2025 — six circles, ZV5 OVUs (binding)

Source: [ČJS field](https://prohlednout.rvp.cz/zakladni-vzdelavani/vzdelavaci-oblasti/cjs/cjs); [1. stupeň PDF](https://revize.rvp.cz/files/2025-09-24-rvp-zv-2025-1stupen.pdf).

#### Místo, kde žijeme

| Code | OVU |
| --- | --- |
| `CJS-CJS-001-ZV5-001` | Vymezí hlavní typy krajiny a demonstruje rozdíly mezi nimi z hlediska přírody a lidské společnosti na úrovni lokální, regionální a globální. |
| `CJS-CJS-001-ZV5-002` | Využívá mapy k orientaci a vyjadřování o světě kolem nás. |
| `CJS-CJS-001-ZV5-003` | Uvede příklady dokládající, že člověk, společnost a příroda se navzájem ovlivňují… |
| `CJS-CJS-001-ZV5-004` | Posoudí… specifika vlastního regionu, krajů ČR, sousedních států ČR a vybraných států… |
| `CJS-CJS-001-ZV5-005` | Prokáže pochopení principu hlasování a jeho významu pro život v demokratické společnosti. |
| `CJS-CJS-001-ZV5-006` | Prokáže základní porozumění roli prezidenta, politiků, soudců a policistů… |
| `CJS-CJS-001-ZV5-007` | Vyhledá odpovědi na otázky související s činností obecního úřadu v dané lokalitě. |

#### Lidé kolem nás

| Code | OVU |
| --- | --- |
| `CJS-CJS-002-ZV5-008` | Rozpozná… jednání a chování, které není v souladu s pravidly… (okolí i digitální svět) a adekvátně zareaguje. |
| `CJS-CJS-002-ZV5-009` | Rozpozná v modelových situacích, které právo člověka bylo porušeno nebo jaká povinnost byla zanedbána. |
| `CJS-CJS-002-ZV5-010` | Posoudí vlivy ve fyzickém a digitálním prostředí; vymezí se vůči rizikové komunikaci. |
| `CJS-CJS-002-ZV5-011` | Uvede příklady toho, v čem se shoduje a čím se liší život různých lidí. |

#### Lidé a čas

| Code | OVU |
| --- | --- |
| `CJS-CJS-003-ZV5-012` | Zkoumá lokální historii… nejméně ve dvou zdrojích. |
| `CJS-CJS-003-ZV5-013` | Porovná, jak lidé žili dříve a jak žijí dnes. |
| `CJS-CJS-003-ZV5-014` | Vyjádří… význam vybraných státních svátků, významných dnů, regionálních výročí a tradic. |

#### Rozmanitost přírody

| Code | OVU |
| --- | --- |
| `CJS-CJS-004-ZV5-015` | Porovná… rozmanitost živé a neživé přírody… a realizuje zásah, kterým tuto rozmanitost podpoří. |
| `CJS-CJS-004-ZV5-016` | Zhodnotí vliv podmínek prostředí na organismy na základě vlastního pokusu. |
| `CJS-CJS-004-ZV5-017` | Porovná organismy z hlediska podobných/odlišných znaků a příbuznosti. |
| `CJS-CJS-004-ZV5-018` | Oceňuje rozmanitost přírody… (attitude/reflection) |
| `CJS-CJS-004-ZV5-019` | Odhadne a změří… vzdálenost, čas, hmotnost, objem a teplotu… se správnými jednotkami. |
| `CJS-CJS-004-ZV5-020` | Porovná základní vlastnosti látek jednotlivých skupenství na základě pokusů. |
| `CJS-CJS-004-ZV5-021` | Charakterizuje Zemi jako jednu z planet Sluneční soustavy. |

#### Člověk, jeho zdraví a bezpečí

| Code | OVU |
| --- | --- |
| `CJS-CJS-005-ZV5-022` | Dodržuje pravidla bezpečného pohybu a pobytu…; zodpovědné jednání s neznámými osobami/předměty/látkami. |
| `CJS-CJS-005-ZV5-023` | Pravidla silničního provozu (model + real) as pedestrian and cyclist. |
| `CJS-CJS-005-ZV5-024` | Lidské tělo → healthy lifestyle; stages of human life. |
| `CJS-CJS-005-ZV5-025` | Refusal of addictive substances; assess influence of addiction on health. |
| `CJS-CJS-005-ZV5-026` | IZS components; behaviour in emergencies (model). |
| `CJS-CJS-005-ZV5-027` | Flammable substances / pyrotechnics; fire-protection rules (model). |
| `CJS-CJS-005-ZV5-028` | Armáda ČR in peace vs wartime. |
| `CJS-CJS-005-ZV5-029` | First aid for minor injuries; distinguish serious / life-threatening; call help. |
| `CJS-CJS-005-ZV5-030` | Respectful relationships; safe sexual behaviour orientation; seek trusted help if threatened. |
| `CJS-CJS-005-ZV5-031` | Plan daily regime; preventive health habits. |
| `CJS-CJS-005-ZV5-032` | Propose all-day diet for self; evaluate vs nutrition guidance. |

#### Lidé a svět financí *(new separate circle in 2025)*

| Code | OVU |
| --- | --- |
| `CJS-CJS-006-ZV5-033` | Používá peníze v běžných modelových situacích. |
| `CJS-CJS-006-ZV5-034` | Vysvětlí… proč není možné realizovat všechny chtěné výdaje. |
| `CJS-CJS-006-ZV5-035` | Sestaví jednoduchý osobní rozpočet. |

Characterisation notes finance content draws on *Standard finanční gramotnosti* while respecting age ([1. stupeň PDF](https://revize.rvp.cz/files/2025-09-24-rvp-zv-2025-1stupen.pdf)).

### Prior RVP ZV 2023 — five circles × periods (+ učivo)

Finance lived under *Lidé kolem nás* (`ČJS-5-2-03`). Common ŠVP split (*Prvouka* 1–3 / *Vlastivěda*+*Přírodověda* 4–5) is described in RVP footnote — **not** separate RVP areas ([prior note #20](./czech-primary-subjects-grades-1-5.md)).

#### 1. období (orientational) — selected outcomes

| Circle | Codes | Outcomes (compressed) |
| --- | --- | --- |
| Místo | `ČJS-3-1-01`…`02` | Mark home/school/route on a simple plan; hazards nearby; place municipality in region/service centre; observe local change |
| Lidé kolem nás | `ČJS-3-2-01`…`02` | Family relationships & tolerance of differences; meaning of occupations |
| Lidé a čas | `ČJS-3-3-01`…`03` | Time data in daily life; past/present/future; local people/monuments/events; compare past–present via everyday examples |
| Rozmanitost přírody | `ČJS-3-4-01`…`03` | Seasonal nature change; sort natural objects; simple experiments & measure |
| Člověk a zdraví | `ČJS-3-5-01`…`04` | Hygiene & health habits; safe play places & traffic basics; caution with strangers / emergency numbers; follow adults in emergencies |

#### 2. období (binding) — selected outcomes

| Circle | Codes | Outcomes (compressed) |
| --- | --- | --- |
| Místo | `ČJS-5-1-01`…`06` | Position of home vs landscape/state; compass & map orientation; map types; regional specifics; compare life/nature CZ vs other countries; state power organs & symbols |
| Lidé kolem nás | `ČJS-5-2-01`…`03` | Relations & coexistence rules; intolerable behaviour; ownership forms; money in everyday situations; price/change; cannot fund all wants; save / borrow / repay |
| Lidé a čas | `ČJS-5-3-01`…`03` | Time data → relations among events; libraries/museums as sources; compare ancestors’ life/work with regional specifics |
| Rozmanitost přírody | `ČJS-5-4-01`…`06` | Living/non-living interconnection & human impact; Earth/universe ↔ seasons; communities; classify organisms; evaluate human activities; design/evaluate experiment |
| Člověk a zdraví | `ČJS-5-5-01`…`07` | Body knowledge → lifestyle; life stages; time planning; emergency & traffic behaviour; refuse addictive substances; prevention habits; first aid & call help |

**Učivo palette (prior, recommended):** domov/škola/obec/krajina; regiony ČR; státní zřízení a symboly; Evropa/svět; mapy; rodina; soužití; práva dítěte; vlastnictví a peníze; časový řád; památky; látky/voda/vzduch/půda; vesmír a Země; rostliny/houby/živočichové; ochrana přírody; lidské tělo; výživa; návykové látky; dopravní bezpečnost; IZS / mimořádné události.

---

## Skill-bucket design guidance (for [Decide skill-bucket system for pipeline inputs](https://github.com/ventrion/smart-critters/issues/42))

1. **Canonical bucket ID = RVP ZV 2025 OVU code** (`MAT-MAT-001-ZV5-001`, …). One OVU ≈ one primary skill bucket.
2. **Grade targeting for Content Packs:** do **not** claim “RVP grade 2 requires X”. Instead tag packs as:
   - `target_grade` (product UX), plus
   - `ovu_codes[]`, plus optional
   - `progression_band` ∈ {`na_zacatku`,`na_ceste`,`splneno`} from NPI metodika, and/or
   - `prior_period` ∈ {`1`,`2`} with prior codes when supporting transition schools.
3. **Finer than ZV5 without inventing standards:** (a) prior 1. období lists for early packs; (b) prior *učivo* as **topic tags**, not mandatory coverage; (c) metodika Splněno illustrations as Item exemplars.
4. **English special case:** dual timeline — packs for grades 1–2 marked `framework: rvp2025`; packs meant for prior-ŠVP schools should assume **mandatory English from grade 3**.
5. **ČJS:** bucket by **circle** then OVU; optional ŠVP flavour tags `prvouka` / `vlastiveda` / `prirodoveda` (non-RVP).
6. **Attitudes / soft outcomes** (e.g. `CJS-…-018` “oceňuje…”, Czech `…007` language attitude) are still OVUs — skill buckets may mark them `assessable: soft` / scenario Items rather than drop them.
7. **Cross-links:** Maths data OVUs ↔ ČJS measurement; Maths money models ↔ ČJS finance; Czech reading ↔ gramotnost `ZGC-*`.

---

## Gaps and caveats

| Gap | Implication |
| --- | --- |
| No official per-single-grade (1/2/4) OVU lists for these Subjects in RVP 2025 | Skill buckets cannot be “ministry grade 2 Maths” without ŠVP/metodika scaffolding labels |
| Metodika is **non-binding** | Use for difficulty bands & exemplars; do not present as RVP mandate |
| Prior 1. období is **orientational** | Safe for early Content Pack design; not a legal minimum |
| English start grade differs 2023 vs 2025 | Product must version packs or flag framework |
| ŠVP variance (especially ČJS subject split & English early start under prior RUP) | Content Packs should key off RVP fields/OVUs, not timetable names |
| MDÚ / LMP adjusted outcomes exist in prior RVP | Out of PoC scope unless accessibility packs are planned |
| Full *Splněno* text for every OVU not transcribed here | Pipeline designers should fetch `https://prohlednout.rvp.cz/metodika/<ovu-code-lower>` per bucket |

---

## Decisions implied for [Decide skill-bucket system for pipeline inputs](https://github.com/ventrion/smart-critters/issues/42)

- Bucket vocabulary = **2025 OVU codes** for Maths / Czech / English / ČJS listed above.
- Period grain (1.–3. vs 4.–5.) comes from **prior RVP** + metodika progressions, explicitly labelled.
- English from grade 1 is **2025-normal**; grade-3 start remains the **prior-RVP** constraint for lagging schools.
- Social Sciences buckets = ČJS six circles; finance is first-class in 2025.

## Open follow-ups (not answered here)

- Exhaustive metodika *Splněno* dump for all ~63 first-stage OVUs across the four Subjects.
- Mapping tables OVU ↔ sample textbook year (Fraus / Nová škola / etc.) — secondary commercial materials, not ministry-owned.
- Exact ŠVP sampling across a set of Czech schools for empirical per-grade topic order.
)

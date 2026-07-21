# Ed-psych: Item answer integrity and ruses (ages ~6–11)

**Ticket:** [#39 — Research ed-psych for Item answer integrity and ruses](https://github.com/ventrion/smart-critters/issues/39)  
**Map parent:** [#36 — Smart Critters: offline content pipeline definition](https://github.com/ventrion/smart-critters/issues/36)  
**Domain terms:** Item, Content Pack, Training, Session, Subject, Grade (see `CONTEXT.md`); Czech primary grades 1–5 (~6–11 years)  
**Date:** 2026-07-21

## Question

What does children’s education / educational-measurement research say about appropriate vs harmful **Item** framing for roughly ages covering Czech grades 1–5 — especially (1) single unambiguous correct answers, (2) dual-correct ambiguity (two answers that are both reasonably correct, but only one is accepted as “right”), and (3) “productive struggle” / ruse-style prompts (trick stems, deliberately misleading cues, “gotchas”) — so Smart Critters can lock an **AFK answer-integrity gate for v1** and frame a later **gifted-ruse door** (explicitly banned in v1)?

Standing product decisions (not overturned here): **no ruses in v1**; never ship Items with two correct answers where only one is accepted; later gifted / productive-struggle ruses may be considered only as a separate track.

---

## Answer (short) / Verdict

1. **Default Training Items (v1 Content Packs) must be fair keys, not gotchas.** Classic MC item-writing consensus: avoid trick items; ensure **exactly one** keyed correct choice (or an *explicit* multi-keyed accepted set); keep stems clear; keep vocabulary age-appropriate; build distractors from common errors that are *wrong*, not equivalently right ([Haladyna, Downing, & Rodriguez, 2002](https://doi.org/10.1207/s15324818ame1503_5); [Haladyna & Downing, 1989](https://doi.org/10.1207/s15324818ame0201_3)).
2. **Silent dual-correct scoring is a validity/fairness failure, not “challenge.”** Respondents and item-writing guides treat “multiple correct answers” (when only one is accepted) as a core hallmark of *trick* items ([Roberts, 1993](https://doi.org/10.1111/j.1745-3984.1993.tb00430.x); summarised in Haladyna et al., 2002). AERA/APA/NCME *Standards* require documented scoring specifications and warn that construct-irrelevant item complexity / unclear criteria undermine fair score interpretation ([AERA/APA/NCME, 2014](https://www.testingstandards.net/)).
3. **Productive struggle ≠ ruse Items.** In maths education, productive struggle means intellectual effort on challenging-but-reachable tasks with clear success criteria and support that keeps cognitive demand without deception ([Hiebert & Grouws, 2007](https://www.infoagepub.com/products/Second-Handbook-Research-Mathematics-Teaching-Learning); [NCTM *Principles to Actions*, 2014](https://www.nctm.org/PtA/); [Warshauer, 2015](https://doi.org/10.1007/s10857-014-9286-3)). Kapur’s *productive failure* is a **problem-solving-before-instruction** design with later consolidation — not MC gotchas ([Kapur, 2008](https://doi.org/10.1080/07370000802212669); [Kapur, 2014](https://doi.org/10.1111/cogs.12107)).
4. **Desirable difficulties ≠ unfair keys.** Bjork’s desirable difficulties (spacing, interleaving, retrieval/generation) are *learning-condition* manipulations; they become *undesirable* when the learner lacks background to succeed — and they do not license misleading stems or dual-keyed MC Items ([Bjork, 1994](https://gwern.net/doc/psychology/spaced-repetition/1994-bjork.pdf); [Bjork & Bjork, 2020](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2021/01/RABjorkELBjorkJARMAC2020ForPostingSingleSpaced.pdf)).
5. **Ages ~6–11 raise the bar on reading load and ambiguity.** Item guidelines stress simple vocabulary and minimised reading load for the tested group; AERA fairness chapters treat unclear instructions and construct-irrelevant item complexity as threats ([Haladyna et al., 2002](https://doi.org/10.1207/s15324818ame1503_5); [AERA/APA/NCME, 2014](https://www.testingstandards.net/)). NAEYC DAP assessment guidance (birth through primary) stresses developmentally appropriate, fair methods and warns against practices that introduce construct-irrelevant barriers ([NAEYC DAP position statement](https://www.naeyc.org/resources/position-statements/dap/assessing-development)). Transfer of middle-school productive-struggle classroom findings to grades 1–5 is **cautious but directionally consistent** (early-elementary replications exist; see below).
6. **Czech/EU official sources support outcome-aligned verification, not trick design.** ČŠI sample testing at grades 5/9 is framed as verifying RVP outcomes (not pupil-vs-pupil ranking) and uses varied item types with reliability reporting — it does **not** provide a Czech-specific “ban ruses” doctrine; answer-integrity still rests on international item-writing / testing standards ([ČŠI výběrová zjišťování](https://www.csicr.cz/)).
7. **Later gifted-ruse door (if ever):** challenge via harder-but-fair tasks, above-level / complex / open performance work (NAGC assessment standards), **not** silent dual-correct or deceptive stems. Any “ruse” track would need: separate opt-in Content Pack / track, clear disclosure of intent, still-explicit accepted-answer sets, scaffolding/feedback that teaches the trap rather than shaming, and age floors — **never** as default Training for grades 1–5.

---

## Official / primary sources used

| Source | Role |
| --- | --- |
| [Haladyna, Downing, & Rodriguez (2002), *Applied Measurement in Education*](https://doi.org/10.1207/s15324818ame1503_5) ([PDF mirror](https://cmapspublic3.ihmc.us/rid=1P2XTLCSS-11K09T9-BD5/Haladyna_2002_-Appl_Meas_Educ.pdf)) | Revised MC item-writing taxonomy: one correct answer; avoid trick items; clear stems; age-appropriate vocabulary; plausible-but-wrong distractors |
| [Haladyna & Downing (1989) taxonomy](https://doi.org/10.1207/s15324818ame0201_3) (summary: [Penn State Schreyer handout](https://www.schreyerinstitute.psu.edu/pdf/Multiple_Choice_Item_Writing_Rules.pdf)) | Earlier rule set: “one and only one correct option”; “avoid trick items… which mislead or deceive” |
| [Roberts (1993), *Journal of Educational Measurement*](https://doi.org/10.1111/j.1745-3984.1993.tb00430.x) | Empirical characterisation of “trick” items: intention to deceive, multiple correct answers, high ambiguity, fine discriminations, window dressing, etc. |
| [AERA/APA/NCME *Standards for Educational and Psychological Testing* (2014)](https://www.testingstandards.net/) ([PDF](http://www.testingstandards.net/uploads/7/6/6/4/76643089/standards%5F2014edition.pdf)) | Validity, fairness, construct-irrelevant variance; scoring specifications must document how responses are scored |
| [Hiebert & Grouws (2007)](https://www.infoagepub.com/products/Second-Handbook-Research-Mathematics-Teaching-Learning) in Lester (Ed.), *Second Handbook…* | Defines student “struggle” as sense-making effort on math that is challenging but within reasonable capability — not needless frustration |
| [NCTM *Principles to Actions* (2014)](https://www.nctm.org/PtA/) ([executive summary](https://www.nctm.org/uploadedFiles/Standards_and_Positions/PtAExecutiveSummary.pdf)) | Teaching practice: “Support productive struggle in learning mathematics” — grapple with ideas/relationships with opportunities and supports |
| [Warshauer (2015), *Journal of Mathematics Teacher Education*](https://doi.org/10.1007/s10857-014-9286-3) ([ERIC abstract](https://eric.ed.gov/?id=EJ1067302)) | Classroom framework for productive struggle (middle school sample); struggle productive when goals/demand maintained and thinking supported |
| [Kapur (2008), *Cognition and Instruction*](https://doi.org/10.1080/07370000802212669); [Kapur (2014), *Cognitive Science*](https://doi.org/10.1111/cogs.12107); [Kapur PF overview](https://www.manukapur.com/productive-failure/) | Productive failure = generate/explore then instruct/consolidate; not trick MC design |
| [Bjork (1994)](https://gwern.net/doc/psychology/spaced-repetition/1994-bjork.pdf); [Bjork & Bjork (2020)](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2021/01/RABjorkELBjorkJARMAC2020ForPostingSingleSpaced.pdf) | Desirable difficulties (spacing, interleaving, generation/testing); many difficulties are *undesirable* if learner cannot succeed |
| [NAEYC DAP — Observing, Documenting, and Assessing…](https://www.naeyc.org/resources/position-statements/dap/assessing-development) ([full DAP statement PDF](https://www.naeyc.org/sites/default/files/globally-shared/downloads/PDFs/resources/position-statements/dap-statement_0.pdf)) | Fair, developmentally appropriate assessment through primary grades; methods must fit purpose and population |
| [NAGC Pre-K–Grade 12 Gifted Programming Standards (2019)](https://assets.noviams.com/novi-file-uploads/nagc/pdfs-and-documents/nagc_2019_prek-grade_12_gift.pdf) | Gifted challenge via differentiated / above-level / performance-product assessment — not deceptive keys |
| [ČŠI výběrová zjišťování (grades 5 & 9)](https://www.csicr.cz/getattachment/17f8e265-b04f-4459-a106-3aecbf735ca0/Vyberove-zjistovani-vysledku-zaku-na-urovni-5-a-9-rocniku-ZS-zaverecna-zprava.pdf) | Czech primary-stage outcome verification tests; reliability/item-type reporting; no endorsement of trick framing |

Secondary classroom/PD slides from NCTM institutes were used only to confirm language already in *Principles to Actions* / Warshauer; claims below cite the primary documents above.

---

## Distinctions that matter for the gate

These four concepts are often conflated in product talk. Research treats them differently:

| Concept | What it is | What it is *not* | Gate implication |
| --- | --- | --- | --- |
| **Ambiguous / dual-correct scoring** | Two (or more) responses that a knowledgeable child could reasonably defend as correct, but the scorer accepts only one | Hard content; multi-step reasoning | **Ban in v1** (and as silent behaviour later). If multiple answers are valid, accept them all *explicitly* or rewrite the Item |
| **Productive struggle** | Effort to make sense of a challenging-but-reachable task with maintained goals and support ([Hiebert & Grouws, 2007](https://www.infoagepub.com/products/Second-Handbook-Research-Mathematics-Teaching-Learning); [NCTM, 2014](https://www.nctm.org/PtA/)) | Deceptive stem; trap distractor that is also correct; “gotcha” reading | Allowed as *difficulty / scaffolding design*, not as unfair keys |
| **Trick / ruse Item** | Stem or options designed to mislead; intention to catch kids out; high ambiguity; multiple correct answers scored as single-key ([Roberts, 1993](https://doi.org/10.1111/j.1745-3984.1993.tb00430.x); Haladyna et al., 2002) | Merely difficult; requiring transfer | **Banned in v1 default packs** |
| **Desirable difficulties** | Spacing, interleaving, retrieval practice, generation ([Bjork, 1994](https://gwern.net/doc/psychology/spaced-repetition/1994-bjork.pdf); [Bjork & Bjork, 2020](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2021/01/RABjorkELBjorkJARMAC2020ForPostingSingleSpaced.pdf)) | Misleading MC keys; dual-correct traps | OK for Session/pack sequencing later; irrelevant as an excuse for bad Item keys |

---

## Single unambiguous correct answers

### Item-writing consensus

Haladyna, Downing, and Rodriguez’s revised taxonomy lists among content and choice rules:

- Every Item should target specific content and a single mental behaviour aligned to specs.  
- **Avoid trick items.**  
- Keep vocabulary simple for the group being tested; minimise reading load; put the central idea in the stem; avoid “window dressing.”  
- **“Make sure that only one of these choices is the right answer.”**  
- Distractors must be plausible and drawn from typical student errors — i.e. *incorrect* for the keyed construct ([Haladyna et al., 2002](https://doi.org/10.1207/s15324818ame1503_5), guidelines 7–8, 13–16, 19, 29–30).

The 1989 taxonomy is equally explicit: *“Make sure there is one and only one correct option”* and *“Avoid trick items, those which mislead or deceive examinees into answering incorrectly”* ([Haladyna & Downing, 1989](https://doi.org/10.1207/s15324818ame0201_3), as reproduced in the [Schreyer Institute rules handout](https://www.schreyerinstitute.psu.edu/pdf/Multiple_Choice_Item_Writing_Rules.pdf)).

**Product read:** for PoC/v1 multiple-choice Items, the Content Pack schema should treat a single `correct` key (or an explicit `acceptedAnswers[]` with clear multi-key intent) as mandatory integrity, not optional style.

### Measurement standards: scoring must match the construct

The AERA/APA/NCME *Standards* (2014) state that test design includes **scoring specifications**: selected-response programs typically designate one correct option; short-answer Items need a list of acceptable responses or general scoring instructions; extended responses need rubrics with explicit criteria ([AERA/APA/NCME, 2014](http://www.testingstandards.net/uploads/7/6/6/4/76643089/standards%5F2014edition.pdf), Ch. 4 “Scoring Specifications”).

Fairness chapter framing: construct-irrelevant variance — including “item complexities that are unrelated to the construct being measured” and “scoring criteria that may favor one group over another” — threatens fair interpretation ([AERA/APA/NCME, 2014](http://www.testingstandards.net/uploads/7/6/6/4/76643089/standards%5F2014edition.pdf), Ch. 3). Linguistic complexity unrelated to the target construct is called out as a fairness risk when the test is not meant to measure linguistic skill (Ch. 4 format discussion).

**Age note (~6–11):** For Czech grades 1–5, especially early Grades, reading demand is itself a major construct-irrelevant risk if the Item is meant to assess Maths (or even Czech *content* beyond decoding). Haladyna’s vocabulary/reading-load rules and AERA’s construct-irrelevance framing jointly support: short clear stems; no “gotcha” parsing; no reliance on tiny wording traps.

### Czech context (thin but consistent)

ČŠI’s sample assessments for grade 5 (and 9) are described as **verification against RVP expected outcomes**, not comparative ranking of individual pupils; technical reports document item counts, open/closed formats, and reliability (e.g. Cronbach’s α for maths) ([ČŠI závěrečná zpráva](https://www.csicr.cz/getattachment/17f8e265-b04f-4459-a106-3aecbf735ca0/Vyberove-zjistovani-vysledku-zaku-na-urovni-5-a-9-rocniku-ZS-zaverecna-zprava.pdf); [info on testing purpose](https://www.csicr.cz/getattachment/6d6ee45b-bcb2-4467-b115-9933234f3ff9/Poskytnuti-informace-k-testovani.aspx)). That aligns with “measure the intended OVU/skill fairly,” not with shipping dual-correct or deceptive Items. **Gap:** ČŠI materials reviewed here do not publish a Czech-language item-writing ban on trick stems; international measurement sources fill that gap.

---

## Dual-correct ambiguity (two reasonable rights, one accepted)

### Why it is harmful

Roberts (1993) asked students and faculty what makes a “trick” test question. Defining characteristics (by prevalence) included: **intention to deceive**, trivial content, too-fine answer discrimination, window-dressing stems, **multiple correct answers**, content opposite to instruction, and **high ambiguity** ([Roberts, 1993](https://doi.org/10.1111/j.1745-3984.1993.tb00430.x); summarised in [Haladyna et al., 2002](https://doi.org/10.1207/s15324818ame1503_5)). Haladyna et al. conclude trick items should **never** be used and that Roberts’s characterisation should ground teaching about them.

**Silent dual-correct** — two options a competent child could justify, but only one earns XP / “correct” feedback — maps directly onto Roberts’s “multiple correct answers” + ambiguity features. It also violates Haladyna guideline 19 (one right answer) unless the Item is *explicitly* multi-keyed and all valid keys are accepted.

### Validity argument

If a child selects a substantively correct alternative and is marked wrong:

- The Session score no longer reflects the intended Subject skill alone (construct-irrelevant penalty for “guessing the author’s preferred wording”).  
- Immediate Training feedback teaches a false “you don’t know this” signal — harmful for motivation and for formative use of Sessions ([AERA/APA/NCME, 2014](http://www.testingstandards.net/uploads/7/6/6/4/76643089/standards%5F2014edition.pdf) fairness/validity framing; NAEYC DAP on fair assessment purpose-fit).

**Product read (standing decision reinforced):** never ship Items with two correct answers where only one is accepted. The AFK gate should fail generation/review if a distractor is equivalently correct under the stated stem + Subject criteria.

### Legitimate multi-key (not dual-correct ambiguity)

AERA scoring specs allow short-answer Items with a **list of acceptable responses** ([AERA/APA/NCME, 2014](http://www.testingstandards.net/uploads/7/6/6/4/76643089/standards%5F2014edition.pdf)). That is *not* dual-correct ambiguity — it is **explicit multi-key acceptance** (e.g. “2/4” and “1/2” both accepted for an equivalent fraction Item; Czech spelling variants listed). Gate rule: either one key, or an explicit accepted set that the scorer honours.

---

## Productive struggle vs ruses / trick Items

### What productive struggle means (primary literature)

Hiebert and Grouws (2007) identify opportunities for students to **struggle with important mathematics** as a key feature of teaching for conceptual understanding. They define struggle as the intellectual effort to make sense of mathematics that is **challenging but within students’ reasonable capabilities** — not needless frustration ([Hiebert & Grouws, 2007](https://www.infoagepub.com/products/Second-Handbook-Research-Mathematics-Teaching-Learning); definition widely quoted, e.g. in [Warshauer-related secondary summaries](https://files.eric.ed.gov/fulltext/EJ1110272.pdf) that cite the handbook chapter).

NCTM *Principles to Actions* elevates this to an effective teaching practice: *“Support productive struggle in learning mathematics”* — provide opportunities and supports as students grapple with mathematical ideas and relationships ([NCTM, 2014](https://www.nctm.org/uploadedFiles/Standards_and_Positions/PtAExecutiveSummary.pdf)).

Warshauer’s classroom research (grades 6–7) operationalises productive struggle as sense-making effort when a pathway is not immediately apparent, and treats an episode as productive when (a) intended goals and cognitive demand are maintained, (b) student thinking is supported, and (c) students can move forward ([Warshauer, 2015](https://doi.org/10.1007/s10857-014-9286-3); [ERIC EJ1067302](https://eric.ed.gov/?id=EJ1067302)). Teacher “rescue” that strips demand is *unproductive* for learning — but that is about scaffolding, not about writing deceptive MC stems.

### Age transfer (~6–11)

Warshauer’s primary sample is **middle school**. An early-childhood / grade-1 case study adapting her framework reported that adaptive characteristics of productive struggle **also appeared** with first-graders on carefully designed tasks ([“A valiant effort…” dissertation abstract via DOI 10.32469/10355/105943](https://doi.org/10.32469/10355/105943)). Treat transfer as **cautiously supportive**: younger children can engage productive struggle with teacher/task support; it still does not justify trick Items. For Smart Critters’ **immediate feedback + XP** Training Sessions (no live teacher probing), the safer v1 mapping is: **hard-but-fair Items**, not struggle-via-deception.

### Productive failure (Kapur) — also not a ruse licence

Kapur’s productive failure is a **learning design**: learners first generate representations/solutions for complex novel problems (often failing to reach the canonical method), then receive instruction that consolidates and assembles those attempts into the target concept ([Kapur, 2008](https://doi.org/10.1080/07370000802212669); [Kapur, 2014](https://doi.org/10.1111/cogs.12107); [Kapur’s own PF page](https://www.manukapur.com/productive-failure/)). Design principles emphasise tasks that challenge but do not merely frustrate, admit multiple solution methods, activate prior knowledge, and are followed by explanation/comparison — **not** MC stems that hide the scoring rule.

**Age fog:** Kapur’s classic 2008 study used **11th-grade** science students; later maths PF work spans various ages but is still primarily instructional-sequence research, not primary-grade MC item-writing. Do not cite PF as evidence for “trick Training Items for grades 1–5.”

### Trick / ruse Items — what research says to avoid

Haladyna et al. (2002): textbook authors unanimously endorse avoiding trick items; Roberts (1993) supplies the best empirical characterisation; conclusion: **never use trick items on any test** ([Haladyna et al., 2002](https://doi.org/10.1207/s15324818ame1503_5)).

Caveat Roberts himself notes: “trickiness” is somewhat ill-defined, and students struggle to label which Items are tricks — yet trick Items were still harder, and the *features* (deception, multiple corrects, ambiguity) remain actionable for a content gate even if everyday “this was a trick!” complaints are noisy ([Roberts, 1993](https://doi.org/10.1111/j.1745-3984.1993.tb00430.x)).

**Operational ruse features for Smart Critters (deny in v1):**

- Stem wording designed to catch a careful reader with a hidden negation / irrelevant detail / opposite-of-instruction cue.  
- Distractor that is mathematically/linguistically correct under a reasonable reading of the stem.  
- “Too fine” discrimination that rewards mind-reading the author’s preference rather than the Grade-level skill.  
- High ambiguity without an explicit multi-key accepted set.

---

## Desirable difficulties (do not conflate)

Bjork coined *desirable difficulties* for training manipulations that may slow acquisition during practice but improve long-term retention and transfer — classic examples: spaced practice, interleaved practice, varied conditions, testing/generation ([Bjork, 1994](https://gwern.net/doc/psychology/spaced-repetition/1994-bjork.pdf)).

Bjork and Bjork (2020) emphasise the word **desirable**: many difficulties are undesirable forever. A difficulty is desirable only when it triggers encoding/retrieval processes that support learning **and** the learner has enough background to respond successfully; otherwise it becomes undesirable ([Bjork & Bjork, 2020](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2021/01/RABjorkELBjorkJARMAC2020ForPostingSingleSpaced.pdf)).

**Product read:** interleaving Items across topics inside a Content Pack, spacing Sessions, and using retrieval (answering) rather than re-reading are aligned with desirable difficulties. **Misleading stems and silent dual-correct keys are not.** They are undesirable difficulties: the child cannot “effort” their way to the author’s secret key without construct-irrelevant mind-reading.

---

## Child / primary assessment fairness (ages ~6–11)

NAEYC’s Developmentally Appropriate Practice guidance on assessment (birth through **primary grades**) requires methods that are developmentally, culturally, and linguistically responsive; assessments used only for populations/purposes for which they yield reliable, valid information; and professional pushback when required tools fail those standards ([NAEYC DAP assessing development](https://www.naeyc.org/resources/position-statements/dap/assessing-development); [DAP statement PDF](https://www.naeyc.org/sites/default/files/globally-shared/downloads/PDFs/resources/position-statements/dap-statement_0.pdf)).

Combined with AERA fairness (remove construct-irrelevant barriers) and Haladyna’s age-appropriate vocabulary / clear-stem rules, the implication for Czech grades 1–5 Training is:

- Prefer Items a child can fail *because they lack the Subject skill*, not because the stem was a riddle.  
- Prefer feedback that attributes error to the skill (“try again: 7−3=?”) rather than to “you fell for the trick.”  
- Treat reading load as a Grade-dependent constraint in Content Pack generation.

**Fog:** Direct experimental literature that *specifically* measures harm of trick MC Items among 6–11-year-olds is thin; the gate therefore rests on convergent measurement + DAP + item-writing standards rather than a single age-banded RCT.

---

## Gifted track: challenge without silent traps

NAGC Pre-K–Grade 12 Gifted Programming Standards emphasise differentiated assessment: above-level and adaptive measures; performance- and product-based instruments for deeper/complex learning; matching assessments to desired outcomes ([NAGC, 2019](https://assets.noviams.com/novi-file-uploads/nagc/pdfs-and-documents/nagc_2019_prek-grade_12_gift.pdf), Standard 2 assessment language). Challenge for gifted learners is typically **depth, complexity, open tasks, and above-level content** — not deceptive scoring.

ASCD/practitioner gifted guidance similarly stresses compacting and harder authentic work rather than trickery (secondary relative to NAGC standards; use NAGC as primary).

**If a later “gifted-ruse” door is opened**, research-consistent constraints would be:

| Constraint | Why |
| --- | --- |
| Separate opt-in track / Content Pack flag (not default grades 1–5 packs) | Default Training must remain fair verification of Subject skill |
| Disclosure (“puzzle / careful-read challenge”) | Trick Items are defined partly by *undeclared* intent to deceive ([Roberts, 1993](https://doi.org/10.1111/j.1745-3984.1993.tb00430.x)) |
| Still never silent dual-correct | Multi-key must be explicit and accepted; otherwise rewrite |
| Prefer productive-struggle *tasks* (hard fair problems, open responses) over MC gotchas | Aligns with NCTM/Hiebert/Warshauer and NAGC performance assessment |
| Scaffolded feedback that teaches the discrimination | Without consolidation, “failure” is not Kapur-style productive failure |
| Age floor / Grade gate (likely upper primary+, with caution) | Primary literature samples for PF/PS skew older; young children need clearer stems |

---

## Implications for Smart Critters AFK gate (v1)

Actionable checks a later “Decide AFK answer-integrity gate” ticket can adopt without re-reading the literature:

1. **Exactly one accepted correct answer** for MC Items, *or* an explicit `acceptedAnswers` / multi-key list that the scorer actually accepts. Fail generation if `correct` is a singleton while another option is equivalently valid under written criteria.  
2. **Distractor integrity:** every distractor must be *wrong* for the stated stem + Subject criterion (common misconception OK; alternate correct OK only if multi-keyed).  
3. **No ruse / trick features in default Content Packs:** no intentional misleading stems, no hidden negations as the sole discrimination, no “gotcha” reading required for Grades 1–5 default Training.  
4. **Stem clarity:** central idea in the stem; minimise window dressing; Grade-appropriate vocabulary/reading load (Haladyna 8, 13–16).  
5. **Short-answer:** ship an explicit accepted-response list (normalisations allowed: spacing, case, equivalent forms) — never “we meant the other correct form.”  
6. **Schema/metadata:** `ruse: false` (or omit) for all v1 packs; reserve `ruse` / `track: gifted-ruse` for a future door that is off by default.  
7. **Human+AFK review prompt:** “Could a knowledgeable child at this Grade defend another option as correct?” If yes → rewrite or multi-key.  
8. **Do not use** productive struggle / desirable difficulties / productive failure as rationales to waive (1)–(3). Those literatures support hard fair tasks and better practice schedules, not unfair keys.

---

## Implications for later gifted-ruse door

For a grilling / product ticket after v1:

1. **Default remains no ruses** for mainstream Content Packs serving Czech grades 1–5.  
2. **Candidate content** for a later door is closer to: complex fair tasks, above-level Items, multi-step reasoning with clear rubrics, optionally *labelled* puzzle packs — **not** silent dual-correct MC.  
3. **If** “ruse” ever means deliberate careful-read traps: require disclosure, opt-in, age/Grade floor, explicit keys, and feedback that teaches the trap; evaluate with tryouts for construct-irrelevant difficulty ([AERA/APA/NCME, 2014](http://www.testingstandards.net/uploads/7/6/6/4/76643089/standards%5F2014edition.pdf) item review / tryout expectations).  
4. **Success criterion for the door:** a gifted learner can distinguish “I was challenged” from “the game lied about which answer counted.” Research on trick Items and fairness says the second outcome is a defect.

---

## Fog / gaps (for map #36)

- **Czech-specific item-writing doctrine on tricks** is thin in ČŠI/MŠMT materials reviewed; rely on international measurement standards for the gate.  
- **Age-banded RCTs** on harm of trick MC Items for ages 6–11 are scarce; argument is convergent (item-writing + fairness + DAP), not a single definitive child study.  
- **Warshauer / Kapur** samples are often older than grade 5; elementary transfer supports *fair* struggle, not ruses.  
- **Open Items / generative answers** (beyond PoC short-answer lists) will need richer rubrics; out of scope for the MC-focused integrity gate but will re-raise multi-key rules.  
- **“Best answer” vs “correct answer”** MC formats exist in textbooks (Haladyna formatting guideline 9); if used later, the stem must declare “best” and criteria must still not leave two equally best options with a silent preference.

---

## Open follow-ups (not answered here)

- Exact automated heuristics for “equivalently correct distractor” (symbolic maths equality, Czech morphology, English synonyms).  
- Whether v1 short-answer normalisation rules belong in the Content Pack schema vs the client scorer.  
- Product naming: keep **ruse** as the banned v1 flag; avoid calling hard fair Items “ruses” in UI copy.

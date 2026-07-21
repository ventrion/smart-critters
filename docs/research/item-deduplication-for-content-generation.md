# Item deduplication for AFK content generation

**Ticket:** [#38 — Research Item deduplication for content generation](https://github.com/ventrion/smart-critters/issues/38)  
**Map parent:** [#36 — Smart Critters: offline content pipeline definition](https://github.com/ventrion/smart-critters/issues/36)  
**Domain terms:** Content Pack, Item, Subject, Training (see `CONTEXT.md`)  
**Date:** 2026-07-21

## Question

What is the most effective **practical** way to detect that a generated Item already exists (or is near-duplicate) so an AFK offline content pipeline does not emit N variants of the same question — comparing normalized exact/stem match, embedding similarity, hybrids, and corpus scope (working directory of in-progress Items + already-published Content Packs)?

## Answer (short)

Use a **three-stage hybrid gate**, not embeddings alone: (1) **normalized exact fingerprint** of prompt (+ type + answer key fingerprint) → hard reject; (2) **lexical near-dup** (character/word n-gram Jaccard or TF-IDF cosine on the same normalized text, plus an explicit **numeric/operator signature** for Maths) → hard reject above a high threshold; (3) **optional multilingual embedding** cosine only as a **soft review / candidate** band for paraphrases that stages 1–2 miss. Default corpus = **current job working directory ∪ all published packs for the same Subject×Grade**. Prefer **false negatives slightly over false positives** for auto-reject (kids repeating the same Item is bad, but blocking a legitimately different number variant is also bad — auto-reject only high-confidence hits; send the embedding band to a human/grill checklist). Keep Czech **diacritics**; do not strip them for the primary key. Skip MorphoDiTa for v1 (licensing + complexity).

---

## Official / primary sources used

| Source | Role |
| --- | --- |
| [Unicode Standard Annex #15 — Unicode Normalization Forms](https://unicode.org/reports/tr15/) | NFKC/NFKD vs NFC/NFD; compatibility equivalence for duplicate-prone characters |
| [Python `unicodedata.normalize`](https://docs.python.org/3/library/unicodedata.html) | First-party API for NFC/NFKC in a one-shot job |
| [Python `str.casefold`](https://docs.python.org/3/library/stdtypes.html#str.casefold) / Unicode Default Case Folding | Caseless matching stronger than `lower()` |
| [Broder 1997 — On the resemblance and containment of documents](https://www.cs.princeton.edu/courses/archive/spring13/cos598C/broder97resemblance.pdf) | Resemblance = Jaccard of shingles; sketching foundation for near-dup docs |
| [Charikar 2002 STOC — Similarity estimation techniques from rounding algorithms](https://www.cs.princeton.edu/courses/archive/spring04/cos598B/bib/CharikarEstim.pdf) | SimHash / LSH for cosine (angle) similarity sketches |
| [Manning, Raghavan, Schütze — *Introduction to Information Retrieval*, Near-duplicates and shingling](https://nlp.stanford.edu/IR-book/html/htmledition/near-duplicates-and-shingling-1.html) | Textbook treatment of shingles + MinHash-style Jaccard estimation |
| [scikit-learn TF-IDF / `TfidfVectorizer`](https://scikit-learn.org/stable/modules/feature_extraction.html#tfidf-term-weighting) | Official TF-IDF + L2-normalized vectors; note on short-text noise |
| [scikit-learn `cosine_similarity`](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html) | Cosine = normalized dot product |
| [Elasticsearch similarity / BM25](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-modules-similarity.html) | BM25 as default IR scorer; notes it suits short fields |
| [Ahasanuzzaman et al., MSR 2016 — Mining duplicate questions in Stack Overflow](https://dl.acm.org/doi/10.1145/2901739.2901770) ([PDF](https://clones.usask.ca/pubfiles/articles/AhasanuzzamanDuplicateMSR2016.pdf)) | Production-style Q&A dedup: candidate filter + BM25 + lexical/cosine features + classifier |
| [Reimers & Gurevych, EMNLP 2019 — Sentence-BERT](https://arxiv.org/abs/1908.10084) | Sentence embeddings + cosine for semantic similarity |
| [sentence-transformers STS docs](https://www.sbert.net/docs/sentence_transformer/usage/semantic_textual_similarity.html) | Cosine as default similarity; paraphrase mining for corpus pairs |
| [Model card: `paraphrase-multilingual-MiniLM-L12-v2`](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2) | Multilingual paraphrase embeddings; lists **Czech (`cs`)** among supported languages |
| [MorphoDiTa (ÚFAL)](https://ufal.mff.cuni.cz/morphodita) / [Users’ Manual](https://ufal.mff.cuni.cz/morphodita/users-manual) / [Straková et al. ACL 2014](https://aclanthology.org/P14-5003/) | Czech lemmatization/tagging primary tool; model licence CC BY-NC-SA |
| Example Content Packs under `src/lib/training-runtime/content-packs/*/pack.json` | Item shape: `prompt`, MC `choices` / short-answer `acceptedAnswers` |

Secondary notes (Quora Question Pairs as a *task* corpus, blog explainers) were used only to locate primary papers; claims below cite the owning sources above.

---

## What “duplicate Item” means here

PoC Items are short prompt-and-response units (`multipleChoice` or `shortAnswer`) inside a Content Pack keyed by Subject×Grade (see `CONTEXT.md` and packs such as `maths-grade-2/pack.json`).

Two notions must stay separate:

| Kind | Example | Product treatment |
| --- | --- | --- |
| **Surface / paraphrase near-dup** | “Kolik je 3 + 4?” vs “Vypočti 3+4.” | **Reject** — same micro-skill *and* same numbers/facts |
| **Pedagogical sibling (not a near-dup)** | “Kolik je 3 + 4?” vs “Kolik je 5 + 6?” | **Keep** — same template, different practice instance |
| **Shared filler, different skill** | Two Czech Items both containing “Které slovo…” | **Keep** — surface words overlap; skill/answer differ |

**Implication:** pure semantic similarity (embeddings) will often score pedagogical siblings very high. For Training content, especially Maths, **numbers and operators are identity**, not noise to ignore. This is the main reason a hybrid with an explicit numeric signature beats “embeddings only.”

---

## Text normalization (Czech + English)

### Unicode form

Unicode defines NFC/NFD (canonical) and NFKC/NFKD (compatibility). Compatibility decomposition merges characters that look interchangeable for search/dedup (e.g. compatibility forms) but can also change meaning in edge cases ([UAX #15](https://unicode.org/reports/tr15/)). Python exposes all four via `unicodedata.normalize` ([docs](https://docs.python.org/3/library/unicodedata.html)).

**Practical choice for this gate:**

1. `NFKC` (or NFC if you want fewer aggressive merges)  
2. `str.casefold()` for caseless match ([Python](https://docs.python.org/3/library/stdtypes.html#str.casefold); Unicode Default Case Folding)  
3. Collapse whitespace; strip outer punctuation lightly (keep `+ − × ÷ = ?` and digits)  
4. Optionally map common operator glyphs (`×`/`·`/`*`, `−`/`–`/`-`) to a small canonical set

### Czech diacritics: keep vs strip

Czech diacritics are **meaning-bearing** (e.g. *byt* vs *být*; *hrad* vs forms with háček). Stripping them for a primary fingerprint raises **false positives** on distinct words and is a poor default for kids’ Czech Items.

**Policy:**

- **Primary key / Stage 1–2:** **keep diacritics** after NFKC + casefold.  
- **Optional secondary soft key (not auto-reject alone):** a diacritic-folded form (NFD → drop combining marks) only to *surface* candidates for review when Stage 3 is enabled — never as sole hard reject.

### Stemming / lemmatization (MorphoDiTa)

MorphoDiTa (ÚFAL) performs morphological analysis, tagging, and lemmatization for Czech at high throughput ([MorphoDiTa site](https://ufal.mff.cuni.cz/morphodita); [ACL 2014 demo paper](https://aclanthology.org/P14-5003/)). Lemmas are structured (raw lemma + lemma id + comments); use converters such as `strip_lemma_id` for raw lemmas ([Users’ Manual](https://ufal.mff.cuni.cz/morphodita/users-manual)).

**Why not for v1 AFK gate:**

- Czech models are under **CC BY-NC-SA** ([MorphoDiTa](https://ufal.mff.cuni.cz/morphodita)) — awkward for a commercial/offline product pipeline without a separate licence path.  
- Kids’ Items are short; lemmatization buys little over NFKC + casefold + n-grams, and can **over-merge** pedagogical siblings.  
- Adds native binary/model packaging to an otherwise simple one-shot job.

Stack Overflow duplicate research *did* stem English text (Porter) before cosine/overlap features ([Ahasanuzzaman et al. MSR 2016](https://clones.usask.ca/pubfiles/articles/AhasanuzzamanDuplicateMSR2016.pdf)). That is reasonable for English; for bilingual CS/EN packs, prefer **language-agnostic character n-grams** over Czech stemming unless licensing is cleared later.

---

## Exact / fingerprint methods

### Normalized exact equality

After the normalization pipeline, hash the **canonical Item text** (at least `prompt`; include sorted choice labels or accepted answers for a stricter key). Equality → hard duplicate.

- **Hits:** regenerations of the same stem, whitespace/case/diacritic-composition variants, trivial punctuation churn.  
- **Misses:** paraphrases (“Kolik je…” vs “Vypočti…”), reordered phrasing, synonym swaps.

This is the sturdy baseline Broder-style pipelines assume before sketching: canonicalize, then compare ([Broder 1997](https://www.cs.princeton.edu/courses/archive/spring13/cos598C/broder97resemblance.pdf) stresses a canonical token sequence before shingling).

### Shingles, MinHash, SimHash

Broder defines **resemblance** as Jaccard similarity of *w*-shingle sets: \(r_w(A,B)=|S(A)\cap S(B)|/|S(A)\cup S(B)|\) ([Broder 1997](https://www.cs.princeton.edu/courses/archive/spring13/cos598C/broder97resemblance.pdf)). Fixed-size sketches estimate resemblance without pairwise full-text compare — historically used at AltaVista scale for near-duplicate web pages.

Charikar’s LSH / rounding construction yields sketches whose collision probability tracks cosine/angle similarity (the family underlying **SimHash**) ([Charikar STOC 2002](https://www.cs.princeton.edu/courses/archive/spring04/cos598B/bib/CharikarEstim.pdf)). Manning et al. present the same shingle + MinHash-style estimator as the standard IR near-dup recipe ([IIR §19.6](https://nlp.stanford.edu/IR-book/html/htmledition/near-duplicates-and-shingling-1.html)).

**When they work:** long documents with small edits (boilerplate, timestamps).  
**When they miss for Items:** short stems have few shingles; a single-word paraphrase can destroy Jaccard; they do **not** capture meaning-preserving rewrites. Ahasanuzzaman et al. explicitly note that classic near-dup document assumptions (documents differ in a small portion) **do not hold** for duplicate *questions* ([MSR 2016](https://clones.usask.ca/pubfiles/articles/AhasanuzzamanDuplicateMSR2016.pdf)).

**For Smart Critters scale (hundreds–thousands of Items):** full pairwise Jaccard on character *n*-grams is cheap enough that MinHash/SimHash are **optional optimizations**, not required infrastructure. Prefer exact Jaccard / TF-IDF cosine first; add MinHash only if corpus growth makes \(O(n^2)\) painful.

---

## Lexical similarity (classic IR)

| Method | What it measures | Primary reference |
| --- | --- | --- |
| **Jaccard / n-gram overlap** | Set overlap of tokens or character *n*-grams | Broder resemblance; IIR shingling |
| **TF-IDF + cosine** | Weighted bag-of-words angle | [scikit-learn TF-IDF](https://scikit-learn.org/stable/modules/feature_extraction.html#tfidf-term-weighting); [`cosine_similarity`](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html) |
| **BM25** | Probabilistic IR ranking (saturation + length norm) | [Elasticsearch BM25](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-modules-similarity.html); used as candidate scorer in [Ahasanuzzaman et al.](https://clones.usask.ca/pubfiles/articles/AhasanuzzamanDuplicateMSR2016.pdf) |

scikit-learn notes that **very short texts** can have noisy TF-IDF values and that binary occurrence features can be more stable ([TF-IDF docs](https://scikit-learn.org/stable/modules/feature_extraction.html#tfidf-term-weighting)). That matches our Item length: prefer **character 3–5-grams** and/or binary TF for Stage 2, not only word TF-IDF.

Elasticsearch documents BM25 as the default similarity and notes it “is supposed to work better for short fields” ([docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/index-modules-similarity.html)). For an offline one-shot job, BM25 via a library (or a tiny inverted index) is fine; spinning up Elasticsearch is **not** required.

**Numeric signature (domain-specific, recommended):** extract ordered list of numbers and operators from the prompt (and answers). Treat as a second fingerprint:

- Same template + **same** numeric signature → near-dup (with high lexical score).  
- Same template + **different** numeric signature → pedagogical sibling → **do not auto-reject** even if embedding cosine is high.

---

## Embedding similarity

Sentence-BERT maps sentences to dense vectors and compares them with cosine similarity ([Reimers & Gurevych 2019](https://arxiv.org/abs/1908.10084)). Official sentence-transformers docs use **cosine** by default for STS and provide `paraphrase_mining()` for all-pairs paraphrase search in a corpus ([STS](https://www.sbert.net/docs/sentence_transformer/usage/semantic_textual_similarity.html); [paraphrase mining](https://www.sbert.net/examples/sentence_transformer/applications/paraphrase-mining/README.html)).

**Model fit for CS/EN kids’ text:** `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2` maps to 384-d vectors and lists **Czech** among supported languages ([model card](https://huggingface.co/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2)). It is small enough for CPU one-shot jobs.

**Pitfalls for this product:**

1. **Thresholds are not transferable.** Cosine ≥ 0.85 may be fine for FAQ paraphrase and disastrous for Maths siblings. Always calibrate on a labeled set of *this* pack style.  
2. **Short text + high template overlap** → inflated similarity for distinct Items.  
3. **Numerical / commutative variants** (“3+5” vs “5+3”, “7−2” vs “7−3”) often land close in embedding space even when they must remain distinct Training Items.  
4. Embeddings help the **paraphrase** case that lexical methods miss — use them as Stage 3, not Stage 1.

---

## Hybrid pipelines in duplicate-question literature

Production-like Q&A dedup is staged:

1. **Cheap candidate generation** (tags / shared terms / BM25 top-*k*), not full \(n \times n\) neural compare.  
2. **Lexical / IR features** (cosine, term overlap, BM25).  
3. **Classifier or deeper semantic model** on the shortlist.

Ahasanuzzaman et al. (Stack Overflow) combine BM25 candidate retrieval with cosine similarity, term overlap, entity overlap, etc., then a discriminative classifier; they note exact duplicates are rare but paraphrastic duplicates are common ([MSR 2016](https://clones.usask.ca/pubfiles/articles/AhasanuzzamanDuplicateMSR2016.pdf)). Broder/Charikar-style fingerprints appear in their related-work as **document** near-dup tools that underfit question paraphrase.

**Transfer to Smart Critters:** same shape, simpler — no need for a trained classifier in v1. Hard rules + thresholds suffice until a labeled FP/FN set exists for grilling (#45).

---

## Corpus scope

| Scope | Pros | Cons |
| --- | --- | --- |
| **(a) Working directory only** | Fast; catches within-job regeneration | Misses already-shipped pack duplicates |
| **(b) Published packs, same Subject×Grade** | Matches how Sessions draw Items; primary user-facing collision | Misses rare cross-grade copies |
| **(c) Cross-grade / cross-subject** | Maximal uniqueness | High FP risk (same stem in Maths G2 vs G4 may be intentional difficulty ladder); more compute |

**Default recommendation:** compare each candidate Item against **(a) ∪ (b)** — the job’s in-progress Items **plus** all published Content Packs for that **Subject×Grade**.

- Cross-grade: optional **warn** only (same normalized prompt across grades may be OK).  
- Cross-subject: **out of default gate** (collision is rare and often false).

---

## Practicality for offline AFK

| Approach | Offline-friendly? | Cost at ~10³ Items | Multilingual |
| --- | --- | --- | --- |
| Normalized exact hash | Excellent | Negligible | Yes (Unicode) |
| Char n-gram Jaccard / TF-IDF cosine | Excellent (pure Python / sklearn) | Negligible–low | Yes |
| MinHash/SimHash | Optional | Overkill at this size | Yes |
| Multilingual MiniLM encode + cosine | Good (local model download once) | Seconds–minutes on CPU | Yes (`cs`+`en`) |
| MorphoDiTa lemmas | Possible but heavier | Low CPU, high ops/licence cost | Czech-specific |

No exotic infra: one CLI job, local files, optional `sentence-transformers` wheel. Do not require Elasticsearch or a vector DB for v1; brute-force cosine over a few thousand 384-d vectors is fine ([paraphrase mining](https://www.sbert.net/examples/sentence_transformer/applications/paraphrase-mining/README.html) documents chunked all-pairs for larger corpora).

---

## Recommended AFK Item dedup gate

### Stages (ordered)

1. **Normalize**  
   - Fields: `prompt` + Item `type` + answer fingerprint (MC: sorted choice labels + correct id/label; short answer: sorted `acceptedAnswers`).  
   - Steps: NFKC → casefold → whitespace collapse → operator glyph canonicalize.  
   - **Keep Czech diacritics.**

2. **Stage A — Exact fingerprint (hard reject)**  
   - SHA-256 (or similar) of normalized blob.  
   - Hit = duplicate.

3. **Stage B — Lexical near-dup (hard reject)**  
   - Character 3–5-gram Jaccard **or** binary/char TF-IDF cosine on normalized prompt.  
   - Plus **numeric/operator signature** equality check for Maths (and any Item with digits).  
   - **Hard reject** if lexical score ≥ \(T_\text{lex}\) **and** (non-math **or** numeric signatures equal).  
   - If lexical score ≥ \(T_\text{lex}\) but numeric signatures **differ** → **accept** (pedagogical sibling).

4. **Stage C — Embedding band (soft)**  
   - Encode normalized prompt with `paraphrase-multilingual-MiniLM-L12-v2`.  
   - If cosine ∈ \([T_\text{soft}, T_\text{hard})\) → flag for human/grill review (do not auto-drop).  
   - If cosine ≥ \(T_\text{hard}\) **and** numeric signatures equal (or non-numeric Subject) → hard reject.  
   - If cosine ≥ \(T_\text{hard}\) but numeric signatures differ → **accept** (override embedding).

### Starting thresholds (tune on a labeled sample — not gospel)

| Symbol | Suggested start | Role |
| --- | --- | --- |
| \(T_\text{lex}\) | **0.90** Jaccard (char 4-grams) or **0.92** TF-IDF cosine | Auto near-dup |
| \(T_\text{hard}\) | **0.92** embedding cosine | Auto paraphrase dup (with numeric guard) |
| \(T_\text{soft}\) | **0.80** embedding cosine | Review band |

Calibrate separately for Maths vs Czech/English; Maths should lean on the numeric guard more than on \(T_\text{hard}\).

### What to store for resume / republish

Per published Item (and per working-dir draft):

| Artifact | Purpose |
| --- | --- |
| `item_id`, Subject, Grade, type | Corpus identity |
| `norm_text` | Debug / rehash |
| `exact_hash` | Stage A |
| `char_ngram_sketch` or sparse TF vector ref | Stage B (or recompute from `norm_text`) |
| `numeric_signature` | Maths sibling guard |
| `embedding` (384-d, float16 OK) | Stage C; version with `model_id` + model revision |

Index by Subject×Grade. Rebuild embeddings when the model revision changes.

### Czech diacritics policy

**Keep** on primary path. Optional diacritic-folded hash only as an extra Stage C candidate hint, never sole auto-reject.

### FP vs FN bias

| Error | User impact |
| --- | --- |
| **FN** (missed dup) | Child sees the same Item again across Sessions / packs → boring, feels broken |
| **FP** (blocked distinct Item) | Pipeline under-produces; especially painful for Maths number variants |

**Bias for auto-reject:** prefer **precision** (avoid FPs) — high thresholds + numeric signature guard. Prefer **recall** in the **soft review band** (catch paraphrases for a human checklist in #45). Net: kids should rarely see exact near-dups; the AFK job should rarely delete a distinct “3+4” vs “5+6” pair without a person looking.

---

## Decisions implied for [#45 — Decide AFK Item dedup gate](https://github.com/ventrion/smart-critters/issues/45)

- Lock hybrid stages A→B→C (not embeddings-only).  
- Lock corpus = working dir ∪ published same Subject×Grade.  
- Lock diacritics-kept + numeric signature for Maths.  
- Confirm whether Stage C is mandatory in v1 or deferred until paraphrase FNs appear.  
- Confirm soft-band routing (fail job vs write `needs-review.json`).

---

## Gaps / uncertainties for grilling (#45)

- Exact \(T_\text{lex}\) / \(T_\text{soft}\) / \(T_\text{hard}\) on a **labeled** set of Smart Critters-style Items (none exists yet).  
- Whether commutative Maths forms (“3+5” vs “5+3”) should count as duplicates (product pedagogy choice).  
- Whether answer-key fingerprint belongs in Stage A for all types or prompt-only for MC (choices may be shuffled).  
- MorphoDiTa / commercial Czech lemma licence if later deepening Czech lexical matching.  
- Soft-band ownership: fully AFK-fail vs human review artifact before publish.

# Smart Critters

Educational game context for a Czech primary-school trainer (grades 1–5 ambition; PoC focuses on 2 and 4) with offline-generated content and later companion/reward systems.

## Language

**Content Pack**:
A versioned bundle of training content a client loads and uses; produced offline, never generated live on the device.
_Avoid_: live generation, on-device generation, streaming questions

**Training**:
A practice activity a child runs from a Content Pack to exercise a subject skill.
_Avoid_: lesson (unless we later mean teacher-led instruction), quiz (too narrow), mission (reserved if we introduce goal-framed journeys later)

**Session**:
One bounded Training run: a set of items with immediate feedback and a short end summary. PoC Sessions are simple; adaptive difficulty and missions come later.
_Avoid_: round (unless we mean a sub-segment inside a Session), attempt (one answer try)

**Critter**:
An animated digital companion mascot the child can choose and unlock as a reward for Training progress. The PoC includes one default Critter (present, not unlock-gated); further Critters come later.
_Avoid_: pet, avatar (unless we mean a separate player representation), mascot (informal synonym only)

**Cara**:
The PoC default Critter — a capybara–mermaid hybrid holding peach bubble tea. Shown as still poses first; animation later.
_Avoid_: using "Cara" as a generic synonym for Critter

**Subject**:
A school subject area the product trains — for the near term Maths, Czech, and English; Social Sciences is in scope for planning (especially question/render shapes) but not first Training content. For Czech grades 1–5, product Social Sciences maps to RVP educational area Člověk a jeho svět (not Člověk a společnost).
_Avoid_: course, class, topic (topic is finer-grained inside a Subject), Člověk a společnost (wrong stage for 1–5)

**Chrome Language**:
The language of the app shell (navigation, buttons, feedback chrome), distinct from the language of Subject content inside a Content Pack. PoC supports a Czech/English toggle.
_Avoid_: locale (implementation term), UI language (looser synonym)

**Item**:
A single prompt-and-response unit inside a Content Pack, with a type that selects how it is rendered and scored. PoC Item types are multiple choice and short answer.
_Avoid_: question (informal synonym), exercise (broader/school term), card

**XP**:
A thin local points balance earned from Training, used in the PoC to experiment with progress visualization; later it can feed Critter unlocks and mini-game access. PoC XP is per install (one balance); profiles come later. Not a currency with sinks in the PoC.
_Avoid_: coins, stars (unless we introduce a separate cosmetic currency), score (Session-local result only)




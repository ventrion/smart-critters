/**
 * Frozen domain types for the Training Runtime seam.
 *
 * These mirror the Content Pack contract locked in `docs/poc-definition.md`
 * and `CONTEXT.md`. The Runtime consumes packs and preferences typed by this
 * module; UI and PWA adapters (built in later stages) depend only on these
 * shapes plus the {@link TrainingRuntime} surface exported from `index.ts`.
 *
 * Do NOT encode Session length or XP here — those are client policy
 * (see `session.ts` for the constants the PoC locks in).
 */

/** Subjects the PoC trains. Social Sciences is intentionally out of scope. */
export type Subject = 'maths' | 'czech' | 'english';

export const SUBJECTS: readonly Subject[] = ['maths', 'czech', 'english'];

/** Sticky per-install Grade selector. PoC focuses on grades 2 and 4. */
export const GRADES = [2, 4] as const;
export type Grade = (typeof GRADES)[number];

/**
 * Chrome Language — the language of the app shell (navigation, buttons,
 * feedback chrome), distinct from the language of Subject content. PoC supports
 * a Czech/English toggle. Stored canonically as the ISO 639-1 code.
 */
export type ChromeLanguage = 'cs' | 'en';

export const CHROME_LANGUAGES: readonly ChromeLanguage[] = ['cs', 'en'];

// ---------------------------------------------------------------------------
// Item payloads — frozen shapes per the Content Pack decision.
// ---------------------------------------------------------------------------

export interface MultipleChoiceChoice {
	id: string;
	label: string;
}

export interface MultipleChoicePayload {
	readonly prompt: string;
	readonly choices: readonly MultipleChoiceChoice[];
	readonly correctChoiceId: string;
}

export interface ShortAnswerPayload {
	readonly prompt: string;
	/** Accepted responses. Diacritics are significant; matching normalizes
	 *  only trim + case-fold + collapsed whitespace (see `scoring.ts`). */
	readonly acceptedAnswers: readonly string[];
}

export type ItemType = 'multipleChoice' | 'shortAnswer';

export interface MultipleChoiceItem {
	readonly id: string;
	readonly type: 'multipleChoice';
	readonly payload: MultipleChoicePayload;
}

export interface ShortAnswerItem {
	readonly id: string;
	readonly type: 'shortAnswer';
	readonly payload: ShortAnswerPayload;
}

/**
 * Item envelope — the frozen `{ id, type, payload }` shape every Content Pack
 * emits. The `type` discriminates the payload.
 */
export type Item = MultipleChoiceItem | ShortAnswerItem;

// ---------------------------------------------------------------------------
// Content Pack
// ---------------------------------------------------------------------------

/**
 * One Content Pack = one Subject x Grade. Inlined items. `schemaVersion`
 * starts at 1; bump only on a breaking envelope change (freely while
 * greenfield). Packs do NOT carry Session length or XP — those belong to the
 * client (Runtime) so policy stays out of content.
 */
export interface Pack {
	readonly schemaVersion: 1;
	readonly subject: Subject;
	readonly grade: Grade;
	readonly items: readonly Item[];
}

// ---------------------------------------------------------------------------
// Install preferences
// ---------------------------------------------------------------------------

/**
 * Per-install preferences. One child per install; XP is a single balance.
 * Persisted through the injected {@link PersistencePort}.
 */
export interface Preferences {
	readonly grade: Grade;
	readonly chromeLanguage: ChromeLanguage;
	readonly xpTotal: number;
}

// ---------------------------------------------------------------------------
// Session outcomes
// ---------------------------------------------------------------------------

export interface SessionComplete {
	readonly kind: 'complete';
	/** Number of correct responses (0..total). */
	readonly correct: number;
	/** Session length (PoC: 8). */
	readonly total: number;
	/** XP earned this Session: +10 per correct + +20 bonus at >=70% correct. */
	readonly xpDelta: number;
	/** Install XP total AFTER committing this Session's delta. */
	readonly xpTotal: number;
}

export interface SessionExit {
	readonly kind: 'exit';
	/** Exit earns nothing for the abandoned Session. */
	readonly xpDelta: 0;
	/** Install XP total — UNCHANGED by Exit (read-only, no commit). */
	readonly xpTotal: number;
}

export type SessionOutcome = SessionComplete | SessionExit;

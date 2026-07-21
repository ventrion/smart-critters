/**
 * Training Runtime — the testable seam that owns Session construction, scoring,
 * XP policy, and install preferences. UI and PWA adapters are built later; they
 * depend on this surface plus the types in `types.ts`.
 *
 * The Runtime talks to storage only through the injected {@link PersistencePort}
 * and to content only through the injected {@link PackRepository}. Tests inject
 * an {@link InMemoryPersistence} (and may pass a fake repository / seeded RNG).
 */

import type {
	ChromeLanguage,
	Grade,
	Item,
	SessionComplete,
	SessionExit,
	Subject
} from './types.js';
import {
	InMemoryPersistence,
	loadPreferences,
	PREF_KEYS,
	type PersistencePort
} from './persistence.js';
import { defaultPackRepository, type PackRepository } from './packs.js';
import { scoreItem } from './scoring.js';
import { computeSessionXp, SESSION_LENGTH, shuffleTakeN, type Rng } from './session.js';

/** A live Session: 8 items, per-item scoring, and a single terminal outcome. */
export interface Session {
	readonly subject: Subject;
	readonly grade: Grade;
	/** The 8 Items drawn for this Session (shuffled, no replacement). */
	readonly items: readonly Item[];
	/** Raw response recorded per item index, or `undefined` if unanswered. */
	readonly responses: readonly (string | undefined)[];
	/** Correctness recorded per item index, or `undefined` if unanswered. */
	readonly results: readonly (boolean | undefined)[];

	/**
	 * Record a response for the item at `index` (MC -> choice id, short answer ->
	 * typed text). Returns whether it was correct. Throws if the Session has
	 * already ended or the index is out of range.
	 */
	respond(index: number, response: string): boolean;

	/** End the Session: tally correct, compute + commit XP, return outcome. */
	complete(): SessionComplete;

	/**
	 * Abandon the Session. The install XP total is NOT read-modify-written —
	 * Exit earns nothing and leaves the total byte-for-byte unchanged.
	 */
	exit(): SessionExit;
}

interface SessionInternals {
	subject: Subject;
	grade: Grade;
	items: readonly Item[];
	getXpTotal: () => number;
	addXp: (delta: number) => number;
}

function createSession(internals: SessionInternals): Session {
	const { subject, grade, items, getXpTotal, addXp } = internals;
	const responses: (string | undefined)[] = new Array(items.length).fill(undefined);
	const results: (boolean | undefined)[] = new Array(items.length).fill(undefined);
	let ended: 'complete' | 'exit' | null = null;

	const guardOpen = (op: string) => {
		if (ended) throw new Error(`Session already ended (${ended}); cannot ${op}`);
	};

	return {
		subject,
		grade,
		items,
		get responses() {
			return responses;
		},
		get results() {
			return results;
		},
		respond(index, response) {
			guardOpen('respond');
			const item = items[index];
			if (!item) throw new RangeError(`Session.respond: no item at index ${index}`);
			const correct = scoreItem(item, response);
			responses[index] = response;
			results[index] = correct;
			return correct;
		},
		complete() {
			guardOpen('complete');
			ended = 'complete';
			const total = items.length;
			const correct = results.reduce<number>((n, r) => n + (r === true ? 1 : 0), 0);
			const xpDelta = computeSessionXp(correct, total);
			const xpTotal = addXp(xpDelta);
			return { kind: 'complete', correct, total, xpDelta, xpTotal };
		},
		exit() {
			guardOpen('exit');
			ended = 'exit';
			// Deliberately read-only: Exit must not commit anything.
			return { kind: 'exit', xpDelta: 0, xpTotal: getXpTotal() };
		}
	};
}

export interface TrainingRuntimeOptions {
	/** Defaults to a fresh {@link InMemoryPersistence}. */
	persistence?: PersistencePort;
	/** Defaults to the six shipped packs. */
	packRepository?: PackRepository;
	/** Defaults to `Math.random`. Inject a seedable PRNG for deterministic tests. */
	rng?: Rng;
}

/**
 * Owns install preferences + Session lifecycle. Stateless across Sessions
 * except for what the persistence port holds; constructing two runtimes on the
 * same port sees the same preferences (used in the round-trip test).
 */
export class TrainingRuntime {
	private readonly persistence: PersistencePort;
	private readonly packs: PackRepository;
	private readonly rng: Rng;

	constructor(options: TrainingRuntimeOptions = {}) {
		this.persistence = options.persistence ?? new InMemoryPersistence();
		this.packs = options.packRepository ?? defaultPackRepository;
		this.rng = options.rng ?? Math.random;
	}

	/** The injected persistence port (for adapters / tests). */
	get port(): PersistencePort {
		return this.persistence;
	}

	/** Current install preferences (grade, chrome language, XP total). */
	getPreferences() {
		return loadPreferences(this.persistence);
	}

	setGrade(grade: Grade): void {
		this.persistence.write(PREF_KEYS.grade, String(grade));
	}

	setChromeLanguage(language: ChromeLanguage): void {
		this.persistence.write(PREF_KEYS.chromeLanguage, language);
	}

	private getXpTotal(): number {
		return this.getPreferences().xpTotal;
	}

	private addXp(delta: number): number {
		const next = this.getXpTotal() + delta;
		this.persistence.write(PREF_KEYS.xpTotal, String(next));
		return next;
	}

	/**
	 * Begin a Session. Resolves the pack for `subject` x `grade` (defaulting
	 * grade to the current install preference), shuffles its items and takes
	 * {@link SESSION_LENGTH} (8) without replacement.
	 */
	startSession(subject: Subject, grade?: Grade): Session {
		const resolvedGrade = grade ?? this.getPreferences().grade;
		const pack = this.packs.get(subject, resolvedGrade);
		const items = shuffleTakeN(pack.items, SESSION_LENGTH, this.rng);
		return createSession({
			subject,
			grade: resolvedGrade,
			items,
			getXpTotal: () => this.getXpTotal(),
			addXp: (delta) => this.addXp(delta)
		});
	}
}

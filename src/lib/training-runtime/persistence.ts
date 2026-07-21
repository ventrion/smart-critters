/**
 * Persistence port — a deliberately small key/value interface that the Runtime
 * depends on. The PoC ships an in-memory fake (below) for tests and for any
 * non-browser caller. A later stage will provide a `localStorage`-backed
 * adapter; the Runtime never touches storage directly, so swapping the adapter
 * changes no Runtime code.
 */

import {
	CHROME_LANGUAGES,
	GRADES,
	type ChromeLanguage,
	type Grade,
	type Preferences
} from './types.js';

/** Minimal key/value persistence contract. */
export interface PersistencePort {
	/** Read a key, or `null` when unset. */
	read(key: string): string | null;
	/** Write a key (overwrite if present). */
	write(key: string, value: string): void;
}

/** Preference / XP storage keys. Namespaced so future keys don't collide. */
export const PREF_KEYS = {
	grade: 'smart-critters:prefs:grade',
	chromeLanguage: 'smart-critters:prefs:chrome-language',
	xpTotal: 'smart-critters:xp:total'
} as const;

/** Default install preferences per the locked PoC definition. */
export const DEFAULT_GRADE: Grade = 2;
export const DEFAULT_CHROME_LANGUAGE: ChromeLanguage = 'cs';
export const DEFAULT_XP_TOTAL = 0;

function isGrade(value: unknown): value is Grade {
	return typeof value === 'number' && (GRADES as readonly number[]).includes(value);
}

function isChromeLanguage(value: unknown): value is ChromeLanguage {
	return typeof value === 'string' && (CHROME_LANGUAGES as readonly string[]).includes(value);
}

function parseGrade(raw: string | null): Grade | null {
	if (raw === null) return null;
	const n = Number(raw);
	return isGrade(n) ? n : null;
}

function parseChromeLanguage(raw: string | null): ChromeLanguage | null {
	return isChromeLanguage(raw) ? raw : null;
}

function parseXp(raw: string | null): number | null {
	if (raw === null) return null;
	const n = Number(raw);
	return Number.isFinite(n) && n >= 0 && Number.isInteger(n) ? n : null;
}

/** Load all install preferences from a persistence port, applying defaults. */
export function loadPreferences(p: PersistencePort): Preferences {
	return {
		grade: parseGrade(p.read(PREF_KEYS.grade)) ?? DEFAULT_GRADE,
		chromeLanguage: parseChromeLanguage(p.read(PREF_KEYS.chromeLanguage)) ?? DEFAULT_CHROME_LANGUAGE,
		xpTotal: parseXp(p.read(PREF_KEYS.xpTotal)) ?? DEFAULT_XP_TOTAL
	};
}

/**
 * In-memory PersistencePort fake. Used directly as the default port (no
 * `localStorage` adapter exists yet) and in tests. Records every write so a
 * test can assert not just the value but WHETHER a key was written (e.g. Exit
 * must not write the XP total at all).
 */
export class InMemoryPersistence implements PersistencePort {
	private readonly store = new Map<string, string>();
	/** Ordered log of every write — handy for asserting no-op behavior. */
	public readonly writes: { key: string; value: string }[] = [];

	read(key: string): string | null {
		return this.store.get(key) ?? null;
	}

	write(key: string, value: string): void {
		this.store.set(key, value);
		this.writes.push({ key, value });
	}

	/** Count writes for a specific key (0 means the key was never written). */
	writeCount(key: string): number {
		return this.writes.filter((w) => w.key === key).length;
	}
}

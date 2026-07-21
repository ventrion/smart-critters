import { describe, expect, it } from 'vitest';
import { LocalStoragePersistence, type StorageLike } from './local-storage-adapter';
import {
	PREF_KEYS,
	SESSION_LENGTH,
	TrainingRuntime,
	type Item
} from '../training-runtime/index.js';

/** Minimal Storage stand-in (the vitest suite runs in node). Fresh map each call. */
function fakeStorage(): StorageLike {
	const store = new Map<string, string>();
	return {
		getItem: (key: string) => store.get(key) ?? null,
		setItem: (key: string, value: string) => {
			store.set(key, value);
		}
	};
}

/** The response that scores an item correctly, derived from the item itself. */
function correctResponse(item: Item): string {
	return item.type === 'multipleChoice'
		? item.payload.correctChoiceId
		: item.payload.acceptedAnswers[0];
}

describe('LocalStoragePersistence — port contract', () => {
	it('round-trips a key/value through the injected storage', () => {
		const adapter = new LocalStoragePersistence(fakeStorage());
		expect(adapter.read(PREF_KEYS.grade)).toBeNull();
		adapter.write(PREF_KEYS.grade, '4');
		expect(adapter.read(PREF_KEYS.grade)).toBe('4');
	});

	it('keeps keys isolated', () => {
		const adapter = new LocalStoragePersistence(fakeStorage());
		adapter.write(PREF_KEYS.grade, '2');
		adapter.write(PREF_KEYS.xpTotal, '120');
		adapter.write(PREF_KEYS.chromeLanguage, 'en');
		expect(adapter.read(PREF_KEYS.grade)).toBe('2');
		expect(adapter.read(PREF_KEYS.xpTotal)).toBe('120');
		expect(adapter.read(PREF_KEYS.chromeLanguage)).toBe('en');
	});

	it('shares state between two adapters over the same storage (simulates reload)', () => {
		const storage = fakeStorage();
		const first = new LocalStoragePersistence(storage);
		first.write(PREF_KEYS.grade, '4');

		// A fresh adapter over the SAME storage observes the write.
		const reloaded = new LocalStoragePersistence(storage);
		expect(reloaded.read(PREF_KEYS.grade)).toBe('4');
	});
});

describe('LocalStoragePersistence — resilience (prerender / blocked storage)', () => {
	it('degrades to null reads and dropped writes when storage is unavailable', () => {
		const adapter = new LocalStoragePersistence(null);
		expect(adapter.read(PREF_KEYS.grade)).toBeNull();
		expect(() => adapter.write(PREF_KEYS.grade, '2')).not.toThrow();
		expect(adapter.read(PREF_KEYS.grade)).toBeNull();
	});

	it('swallows a throwing storage without propagating errors', () => {
		const throwing: StorageLike = {
			getItem: () => {
				throw new Error('unavailable');
			},
			setItem: () => {
				throw new Error('quota exceeded');
			}
		};
		const adapter = new LocalStoragePersistence(throwing);
		expect(adapter.read(PREF_KEYS.grade)).toBeNull();
		expect(() => adapter.write(PREF_KEYS.grade, '2')).not.toThrow();
	});
});

describe('LocalStoragePersistence wired into TrainingRuntime', () => {
	it('persists Grade, Chrome Language, and XP across two runtimes on the same storage', () => {
		const storage = fakeStorage();
		const a = new TrainingRuntime({ persistence: new LocalStoragePersistence(storage) });
		a.setGrade(4);
		a.setChromeLanguage('en');

		// Commit XP via a perfect Session — the runtime writes xpTotal through
		// the adapter.
		const session = a.startSession('maths');
		session.items.forEach((item, i) => session.respond(i, correctResponse(item)));
		const outcome = session.complete();
		expect(outcome.kind).toBe('complete');
		expect(outcome.correct).toBe(SESSION_LENGTH);
		expect(outcome.xpTotal).toBeGreaterThan(0);

		// A brand-new runtime + adapter over the SAME storage observes the
		// persisted install state (this is the "survives reload" path).
		const b = new TrainingRuntime({ persistence: new LocalStoragePersistence(storage) });
		const prefs = b.getPreferences();
		expect(prefs.grade).toBe(4);
		expect(prefs.chromeLanguage).toBe('en');
		expect(prefs.xpTotal).toBe(outcome.xpTotal);
	});
});

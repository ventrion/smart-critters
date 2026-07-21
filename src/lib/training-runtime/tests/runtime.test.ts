import { describe, expect, it } from 'vitest';
import {
	InMemoryPersistence,
	PREF_KEYS,
	SESSION_LENGTH,
	TrainingRuntime,
	defaultPackRepository,
	packKey,
	SHIPPED_PACKS
} from '../index.js';
import type { Grade, Item, Subject } from '../index.js';

const SUBJECTS: Subject[] = ['maths', 'czech', 'english'];
const GRADES: Grade[] = [2, 4];

/** The response that scores an item correctly (derived from the item itself). */
function correctResponse(item: Item): string {
	return item.type === 'multipleChoice'
		? item.payload.correctChoiceId
		: item.payload.acceptedAnswers[0];
}

/** A response guaranteed to be wrong for either item type. */
function wrongResponse(item: Item): string {
	return item.type === 'multipleChoice' ? '__bad-choice-id__' : '__not-an-accepted-answer__';
}

describe('TrainingRuntime — preferences round-trip via the injected store', () => {
	it('exposes the locked defaults on a fresh store', () => {
		const rt = new TrainingRuntime();
		const prefs = rt.getPreferences();
		expect(prefs.grade).toBe(2);
		expect(prefs.chromeLanguage).toBe('cs');
		expect(prefs.xpTotal).toBe(0);
	});

	it('round-trips Grade and Chrome Language through the injected store', () => {
		const store = new InMemoryPersistence();
		const rt = new TrainingRuntime({ persistence: store });

		rt.setGrade(4);
		rt.setChromeLanguage('en');

		// Raw values land under the namespaced keys.
		expect(store.read(PREF_KEYS.grade)).toBe('4');
		expect(store.read(PREF_KEYS.chromeLanguage)).toBe('en');

		// A brand-new runtime on the SAME store observes them (simulates reload).
		const reloaded = new TrainingRuntime({ persistence: store });
		const prefs = reloaded.getPreferences();
		expect(prefs.grade).toBe(4);
		expect(prefs.chromeLanguage).toBe('en');
	});

	it('round-trips XP across runtimes via the same store', () => {
		const store = new InMemoryPersistence();
		const rt = new TrainingRuntime({ persistence: store });

		// Drive a perfect Session and commit its XP.
		const session = rt.startSession('czech', 4);
		session.items.forEach((item, i) => session.respond(i, correctResponse(item)));
		const outcome = session.complete();
		expect(outcome.kind).toBe('complete');
		expect(outcome.correct).toBe(SESSION_LENGTH);
		expect(outcome.xpDelta).toBe(SESSION_LENGTH * 10 + 20); // 100

		// Total survives a "reload": a brand-new runtime reads the same store.
		const reloaded = new TrainingRuntime({ persistence: store });
		expect(reloaded.getPreferences().xpTotal).toBe(outcome.xpTotal);
	});
});

describe('TrainingRuntime — Session construction (shuffle + take 8)', () => {
	it('startSession resolves the pack from the current Grade preference when omitted', () => {
		const store = new InMemoryPersistence();
		const rt = new TrainingRuntime({ persistence: store });
		rt.setGrade(4);
		const session = rt.startSession('english');
		expect(session.grade).toBe(4);
		// Every item must belong to the english-grade-4 pack.
		const pack = SHIPPED_PACKS[packKey('english', 4)];
		const packIds = new Set(pack.items.map((i) => i.id));
		session.items.forEach((item) => expect(packIds).toContain(item.id));
	});

	for (const subject of SUBJECTS) {
		for (const grade of GRADES) {
			it(`draws exactly 8 unique items from ${packKey(subject, grade)} across many runs`, () => {
				const rt = new TrainingRuntime();
				const pack = SHIPPED_PACKS[packKey(subject, grade)];
				const packIds = new Set(pack.items.map((i) => i.id));
				for (let run = 0; run < 10; run++) {
					const session = rt.startSession(subject, grade);
					expect(session.items).toHaveLength(SESSION_LENGTH);
					const ids = session.items.map((i) => i.id);
					expect(new Set(ids).size).toBe(SESSION_LENGTH); // no replacement
					ids.forEach((id) => expect(packIds).toContain(id));
				}
			});
		}
	}
});

describe('TrainingRuntime — XP: +10 per correct, +20 bonus at >=70%', () => {
	it('awards +10 per correct with NO bonus at 5/8', () => {
		const store = new InMemoryPersistence();
		const rt = new TrainingRuntime({ persistence: store });
		const session = rt.startSession('maths', 2);

		// 5 correct, 3 wrong.
		session.items.forEach((item, i) => {
			session.respond(i, i < 5 ? correctResponse(item) : wrongResponse(item));
		});
		const outcome = session.complete();

		expect(outcome.kind).toBe('complete');
		expect(outcome.correct).toBe(5);
		expect(outcome.total).toBe(SESSION_LENGTH);
		expect(outcome.xpDelta).toBe(50); // 5 * 10, no bonus
		expect(outcome.xpTotal).toBe(50);
		expect(rt.getPreferences().xpTotal).toBe(50);
	});

	it('awards +10 per correct AND +20 bonus at 6/8', () => {
		const store = new InMemoryPersistence();
		const rt = new TrainingRuntime({ persistence: store });
		const session = rt.startSession('czech', 4);

		// 6 correct, 2 wrong.
		session.items.forEach((item, i) => {
			session.respond(i, i < 6 ? correctResponse(item) : wrongResponse(item));
		});
		const outcome = session.complete();

		expect(outcome.correct).toBe(6);
		expect(outcome.xpDelta).toBe(80); // 6 * 10 + 20 bonus
		expect(outcome.xpTotal).toBe(80);
	});

	it('awards the bonus on a perfect Session', () => {
		const store = new InMemoryPersistence();
		const rt = new TrainingRuntime({ persistence: store });
		const session = rt.startSession('english', 2);
		session.items.forEach((item, i) => session.respond(i, correctResponse(item)));
		const outcome = session.complete();
		expect(outcome.correct).toBe(SESSION_LENGTH);
		expect(outcome.xpDelta).toBe(SESSION_LENGTH * 10 + 20); // 100
	});
});

describe('TrainingRuntime — Exit yields 0 Session XP and does not mutate the total', () => {
	it('exit outcome carries xpDelta 0', () => {
		const store = new InMemoryPersistence();
		const rt = new TrainingRuntime({ persistence: store });
		// Seed a known total so we can prove Exit leaves it untouched.
		store.write(PREF_KEYS.xpTotal, '120');
		const before = rt.getPreferences().xpTotal;
		expect(before).toBe(120);

		const xpWritesBefore = store.writeCount(PREF_KEYS.xpTotal);

		const session = rt.startSession('maths', 2);
		// Even after some correct responses, Exit abandons the run.
		session.respond(0, correctResponse(session.items[0]));
		const outcome = session.exit();

		expect(outcome.kind).toBe('exit');
		expect(outcome.xpDelta).toBe(0);
		expect(outcome.xpTotal).toBe(120); // unchanged
		expect(rt.getPreferences().xpTotal).toBe(120); // still unchanged

		// And the XP key was NOT written during Exit.
		const xpWritesAfter = store.writeCount(PREF_KEYS.xpTotal);
		expect(xpWritesAfter).toBe(xpWritesBefore);
	});

	it('a later completed Session still accrues on top of the untouched total', () => {
		const store = new InMemoryPersistence();
		store.write(PREF_KEYS.xpTotal, '100');
		const rt = new TrainingRuntime({ persistence: store });

		// Abandon one.
		rt.startSession('czech', 2).exit();
		expect(rt.getPreferences().xpTotal).toBe(100);

		// Complete another with 6/8 -> +80.
		const session = rt.startSession('english', 4);
		session.items.forEach((item, i) => {
			session.respond(i, i < 6 ? correctResponse(item) : wrongResponse(item));
		});
		const outcome = session.complete();
		expect(outcome.xpDelta).toBe(80);
		expect(outcome.xpTotal).toBe(180); // 100 + 80
		expect(rt.getPreferences().xpTotal).toBe(180);
	});
});

describe('TrainingRuntime — injected PackRepository', () => {
	it('honours a custom repository (fake pack with exactly 12 items)', () => {
		const fakeItems: Item[] = Array.from({ length: 12 }, (_, i) => ({
			id: `fake-${i}`,
			type: 'multipleChoice' as const,
			payload: {
				prompt: `q${i}`,
				choices: [
					{ id: 'a', label: 'A' },
					{ id: 'b', label: 'B' }
				],
				correctChoiceId: 'a'
			}
		}));
		const fakeRepo = {
			get: () => ({
				schemaVersion: 1 as const,
				subject: 'maths' as const,
				grade: 2 as const,
				items: fakeItems
			})
		};
		const rt = new TrainingRuntime({
			persistence: new InMemoryPersistence(),
			packRepository: fakeRepo
		});
		const session = rt.startSession('maths', 2);
		expect(session.items).toHaveLength(SESSION_LENGTH);
		expect(new Set(session.items.map((i) => i.id)).size).toBe(SESSION_LENGTH);
	});

	it('uses the default repository when none is provided', () => {
		const rt = new TrainingRuntime();
		// defaultPackRepository exposes all six packs; spot-check via startSession.
		expect(defaultPackRepository.get('czech', 2)).toBe(SHIPPED_PACKS['czech-grade-2']);
		expect(() => rt.startSession('czech', 2)).not.toThrow();
	});
});

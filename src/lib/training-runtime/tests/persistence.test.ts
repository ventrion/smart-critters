import { describe, expect, it } from 'vitest';
import {
	assertPack,
	InMemoryPersistence,
	loadPreferences,
	PREF_KEYS
} from '../index.js';

describe('InMemoryPersistence', () => {
	it('returns null for unset keys and round-trips written values', () => {
		const p = new InMemoryPersistence();
		expect(p.read('x')).toBeNull();
		p.write('x', '1');
		expect(p.read('x')).toBe('1');
		p.write('x', '2');
		expect(p.read('x')).toBe('2');
	});

	it('logs every write and counts per key', () => {
		const p = new InMemoryPersistence();
		p.write('a', '1');
		p.write('b', '2');
		p.write('a', '3');
		expect(p.writes).toHaveLength(3);
		expect(p.writeCount('a')).toBe(2);
		expect(p.writeCount('b')).toBe(1);
		expect(p.writeCount('unset')).toBe(0);
	});
});

describe('loadPreferences defaults and resilience', () => {
	it('applies the locked defaults on an empty store', () => {
		const prefs = loadPreferences(new InMemoryPersistence());
		expect(prefs.grade).toBe(2);
		expect(prefs.chromeLanguage).toBe('cs');
		expect(prefs.xpTotal).toBe(0);
	});

	it('falls back to defaults when stored values are out of range / malformed', () => {
		const p = new InMemoryPersistence();
		p.write(PREF_KEYS.grade, '3'); // grade 3 is not a PoC grade
		p.write(PREF_KEYS.chromeLanguage, 'fr'); // unsupported language
		p.write(PREF_KEYS.xpTotal, 'not-a-number');
		const prefs = loadPreferences(p);
		expect(prefs.grade).toBe(2);
		expect(prefs.chromeLanguage).toBe('cs');
		expect(prefs.xpTotal).toBe(0);
	});
});

describe('assertPack', () => {
	it('rejects an unknown item type', () => {
		expect(() =>
			assertPack({
				schemaVersion: 1,
				subject: 'maths',
				grade: 2,
				items: [{ id: 'x', type: 'dragDrop', payload: {} }]
			})
		).toThrow(/unknown item type/);
	});

	it('rejects a multiple-choice item whose correctChoiceId is not among the choices', () => {
		expect(() =>
			assertPack({
				schemaVersion: 1,
				subject: 'maths',
				grade: 2,
				items: [
					{
						id: 'x',
						type: 'multipleChoice',
						payload: {
							prompt: 'p',
							choices: [
								{ id: 'a', label: 'A' },
								{ id: 'b', label: 'B' }
							],
							correctChoiceId: 'z'
						}
					}
				]
			})
		).toThrow(/correctChoiceId/);
	});

	it('rejects a wrong schemaVersion', () => {
		expect(() =>
			assertPack({ schemaVersion: 2, subject: 'maths', grade: 2, items: [] })
		).toThrow(/schemaVersion/);
	});
});

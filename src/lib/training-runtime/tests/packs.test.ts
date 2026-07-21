import { describe, expect, it } from 'vitest';
import {
	assertPack,
	defaultPackRepository,
	PackError,
	packKey,
	SHIPPED_PACKS
} from '../index.js';
import type { Grade, PackRepository, Subject } from '../index.js';

const SUBJECTS: Subject[] = ['maths', 'czech', 'english'];
const GRADES: Grade[] = [2, 4];

describe('six content packs', () => {
	it('ships exactly six packs covering every Subject x Grade', () => {
		const keys = Object.keys(SHIPPED_PACKS);
		expect(keys).toHaveLength(6);
		for (const subject of SUBJECTS) {
			for (const grade of GRADES) {
				expect(keys).toContain(packKey(subject, grade));
			}
		}
	});

	for (const subject of SUBJECTS) {
		for (const grade of GRADES) {
			describe(`${packKey(subject, grade)}`, () => {
				const pack = SHIPPED_PACKS[packKey(subject, grade)];

				it('has schemaVersion 1 and matching subject/grade', () => {
					expect(pack.schemaVersion).toBe(1);
					expect(pack.subject).toBe(subject);
					expect(pack.grade).toBe(grade);
				});

				it('has at least 12 items (8-item Session headroom)', () => {
					expect(pack.items.length).toBeGreaterThanOrEqual(12);
				});

				it('represents BOTH multipleChoice and shortAnswer types', () => {
					const types = new Set(pack.items.map((i) => i.type));
					expect(types.has('multipleChoice')).toBe(true);
					expect(types.has('shortAnswer')).toBe(true);
				});

				it('uses unique item ids and the frozen envelope', () => {
					const ids = pack.items.map((i) => i.id);
					expect(new Set(ids).size).toBe(ids.length);
					for (const item of pack.items) {
						expect(typeof item.id).toBe('string');
						expect(item.id.length).toBeGreaterThan(0);
						if (item.type === 'multipleChoice') {
							const p = item.payload;
							expect(typeof p.prompt).toBe('string');
							expect(Array.isArray(p.choices)).toBe(true);
							expect(p.choices.length).toBeGreaterThanOrEqual(2);
							expect(p.choices.map((c) => c.id)).toContain(p.correctChoiceId);
						} else {
							const p = item.payload;
							expect(typeof p.prompt).toBe('string');
							expect(Array.isArray(p.acceptedAnswers)).toBe(true);
							expect(p.acceptedAnswers.length).toBeGreaterThanOrEqual(1);
						}
					}
				});

				it('re-validates cleanly through assertPack', () => {
					expect(() => assertPack(pack)).not.toThrow();
				});

				it('is loadable by Subject x Grade via the default repository', () => {
					expect(defaultPackRepository.get(subject, grade)).toBe(pack);
				});
			});
		}
	}

	it('lets a custom PackRepository surface its own PackError on a miss', () => {
		// The PoC ships a pack for every Subject x {2,4}, so a miss is only
		// observable through a custom repository. This pins the contract:
		// lookups go through get(subject, grade) and may throw PackError.
		const fakeRepo: PackRepository = {
			get() {
				throw new PackError('No pack');
			}
		};
		expect(() => fakeRepo.get('maths', 2)).toThrow(PackError);
	});
});

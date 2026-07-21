import { describe, expect, it } from 'vitest';
import {
	BONUS_THRESHOLD,
	computeSessionXp,
	SESSION_BONUS,
	SESSION_LENGTH,
	shuffleTakeN,
	XP_PER_CORRECT
} from '../index.js';

describe('shuffleTakeN', () => {
	it('takes exactly N unique items (no replacement) from a larger pool', () => {
		const pool = Array.from({ length: 20 }, (_, i) => i);
		const taken = shuffleTakeN(pool, 8);
		expect(taken).toHaveLength(8);
		expect(new Set(taken).size).toBe(8); // all unique
		taken.forEach((v) => expect(pool).toContain(v));
	});

	it('produces 8 unique items across many runs from a 12-item pool (pack headroom)', () => {
		const pool = Array.from({ length: 12 }, (_, i) => `id-${i}`);
		for (let run = 0; run < 50; run++) {
			const taken = shuffleTakeN(pool, 8);
			expect(taken).toHaveLength(8);
			expect(new Set(taken).size).toBe(8);
		}
	});

	it('returns every pool item (no padding, no duplicates) when pool < N', () => {
		const pool = ['a', 'b', 'c'];
		const taken = shuffleTakeN(pool, 8);
		expect(taken).toHaveLength(3);
		expect(new Set(taken).size).toBe(3);
	});

	it('is deterministic when an RNG is injected', () => {
		const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
		const makeRng = (seed: number) => {
			let s = seed >>> 0;
			return () => {
				s = (s * 1664525 + 1013904223) >>> 0;
				return s / 4294967296;
			};
		};
		const a = shuffleTakeN(pool, 5, makeRng(12345));
		const b = shuffleTakeN(pool, 5, makeRng(12345));
		expect(a).toEqual(b);
	});
});

describe('computeSessionXp — +10 per correct', () => {
	it('awards exactly XP_PER_CORRECT for each correct item', () => {
		expect(XP_PER_CORRECT).toBe(10);
		expect(computeSessionXp(1, 8)).toBe(10);
		expect(computeSessionXp(3, 8)).toBe(30);
		expect(computeSessionXp(5, 8)).toBe(50);
	});
});

describe('computeSessionXp — Session bonus boundary at 70%', () => {
	it('qualifies for +20 bonus at exactly 6/8 (75% >= 70%)', () => {
		expect(SESSION_BONUS).toBe(20);
		expect(BONUS_THRESHOLD).toBe(0.7);
		expect(6 / 8).toBeGreaterThanOrEqual(BONUS_THRESHOLD);
		expect(computeSessionXp(6, 8)).toBe(6 * 10 + 20); // 80
	});

	it('does NOT award the bonus at 5/8 (62.5% < 70%)', () => {
		expect(5 / 8).toBeLessThan(BONUS_THRESHOLD);
		expect(computeSessionXp(5, 8)).toBe(5 * 10); // 50, no bonus
	});

	it('awards the bonus for 7/8 and 8/8', () => {
		expect(computeSessionXp(7, 8)).toBe(70 + 20);
		expect(computeSessionXp(8, 8)).toBe(80 + 20);
	});

	it('returns 0 for an empty Session', () => {
		expect(computeSessionXp(0, 0)).toBe(0);
	});
});

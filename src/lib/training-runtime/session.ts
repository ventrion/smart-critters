/**
 * Session construction and XP policy — pure functions.
 *
 * The Runtime owns Session length and XP (client policy). Content Packs carry
 * neither. Constants below are the locked PoC values.
 *
 *   - Session length: exactly 8 Items, shuffled from the pack WITHOUT
 *     replacement (the same Item may recur across Sessions).
 *   - XP: +10 per correct Item; +20 Session bonus at >=70% correct; Exit -> 0.
 *
 * 6/8 = 75% qualifies for the bonus; 5/8 = 62.5% does not.
 */

/** PoC Session length. Fixed; adaptive/demand-aware length is a later concern. */
export const SESSION_LENGTH = 8;

/** XP earned per correct Item. */
export const XP_PER_CORRECT = 10;

/** Bonus added to a completed Session whose correctness ratio clears the bar. */
export const SESSION_BONUS = 20;

/** Correctness ratio at/above which the Session bonus is awarded (>= 70%). */
export const BONUS_THRESHOLD = 0.7;

/** RNG signature (so a seedable PRNG can be injected for deterministic tests). */
export type Rng = () => number;

/**
 * Partial Fisher-Yates: shuffle the pool in place just far enough to expose N
 * unique items at the front, then return them. Equivalent to "shuffle all then
 * take first N" but cheaper. Never samples with replacement, so the result
 * contains no duplicates when the input has none.
 *
 * If the pool has fewer than N items, returns all of them (shuffled). The PoC
 * requires packs with >=12 items, so the 8-item Session always has headroom.
 */
export function shuffleTakeN<T>(items: readonly T[], n: number, rng: Rng = Math.random): T[] {
	const pool = items.slice();
	const limit = Math.min(n, pool.length);
	for (let i = 0; i < limit; i++) {
		const j = i + Math.floor(rng() * (pool.length - i));
		const tmp = pool[i];
		pool[i] = pool[j];
		pool[j] = tmp;
	}
	return pool.slice(0, limit);
}

/**
 * XP delta for a completed Session: +10 per correct + +20 bonus when the
 * correctness ratio is >= {@link BONUS_THRESHOLD} (and at least one item was
 * answered). Returns 0 for an empty Session (no items) — there is nothing to
 * reward and no ratio to clear.
 */
export function computeSessionXp(correct: number, total: number): number {
	if (total <= 0) return 0;
	const base = correct * XP_PER_CORRECT;
	const ratio = correct / total;
	const bonus = ratio >= BONUS_THRESHOLD ? SESSION_BONUS : 0;
	return base + bonus;
}

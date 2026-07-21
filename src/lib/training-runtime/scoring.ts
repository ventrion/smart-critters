/**
 * Item scoring — pure functions.
 *
 * Multiple choice: exact match on choice id.
 * Short answer: normalize both the response and each accepted answer, then
 * compare. Normalization is `trim` + `toLowerCase` + collapse internal
 * whitespace runs to a single space. Crucially we do NOT fold diacritics —
 * `Praha` matches `praha` (case only) but `čaj` does NOT match `caj`
 * (accent still matters). This matches the locked PoC rule.
 *
 * Pure so the same helpers feed both the stateful {@link Session} and tests.
 */

import type { Item, MultipleChoiceItem, ShortAnswerItem } from './types.js';

/**
 * Normalize a short-answer string: trim, case-fold, collapse whitespace.
 * Diacritics are preserved on purpose.
 */
export function normalizeShortAnswer(input: string): string {
	return input.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Multiple choice is correct iff the chosen id equals the pack's correct id. */
export function scoreMultipleChoice(item: MultipleChoiceItem, choiceId: string): boolean {
	return item.payload.correctChoiceId === choiceId;
}

/** Short answer is correct iff the normalized response matches any accepted answer. */
export function scoreShortAnswer(item: ShortAnswerItem, answer: string): boolean {
	const normalized = normalizeShortAnswer(answer);
	return item.payload.acceptedAnswers.some(
		(accepted) => normalizeShortAnswer(accepted) === normalized
	);
}

/**
 * Score an Item by its raw response string. For a multiple-choice item the
 * response is the chosen choice id; for a short-answer item it is the typed
 * text. Throws if the response shape is wrong for the item type — the caller
 * (UI / test) is expected to route responses by item type.
 */
export function scoreItem(item: Item, response: string): boolean {
	switch (item.type) {
		case 'multipleChoice':
			return scoreMultipleChoice(item, response);
		case 'shortAnswer':
			return scoreShortAnswer(item, response);
	}
}

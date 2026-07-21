import { describe, expect, it } from 'vitest';
import {
	normalizeShortAnswer,
	scoreItem,
	scoreMultipleChoice,
	scoreShortAnswer
} from '../index.js';
import type { MultipleChoiceItem, ShortAnswerItem } from '../index.js';

describe('normalizeShortAnswer', () => {
	it('trims surrounding whitespace', () => {
		expect(normalizeShortAnswer('  Praha ')).toBe('praha');
	});

	it('case-folds to lower case', () => {
		expect(normalizeShortAnswer('PRAHA')).toBe('praha');
		expect(normalizeShortAnswer('PrAhA')).toBe('praha');
	});

	it('collapses internal whitespace runs to a single space', () => {
		expect(normalizeShortAnswer('Kladno   nad   Metují')).toBe('kladno nad metují');
		expect(normalizeShortAnswer('a\tb\n\nc')).toBe('a b c');
	});

	it('keeps diacritics (does NOT fold accents)', () => {
		expect(normalizeShortAnswer('Čaj')).toBe('čaj');
		expect(normalizeShortAnswer('MĚSTO')).toBe('město');
		expect(normalizeShortAnswer('ě š č ř ž ý á í é ů ú')).toBe('ě š č ř ž ý á í é ů ú');
	});
});

describe('short-answer scoring', () => {
	const capital: ShortAnswerItem = {
		id: 'x',
		type: 'shortAnswer',
		payload: { prompt: 'capital', acceptedAnswers: ['Praha', 'Hlavní město'] }
	};

	it('matches ignoring case and surrounding whitespace', () => {
		expect(scoreShortAnswer(capital, 'praha')).toBe(true);
		expect(scoreShortAnswer(capital, '  PRAHA ')).toBe(true);
	});

	it('matches any accepted answer', () => {
		expect(scoreShortAnswer(capital, 'hlavní město')).toBe(true);
		expect(scoreShortAnswer(capital, 'HLAVNÍ MĚSTO')).toBe(true);
	});

	it('keeps diacritics significant — accents still matter', () => {
		const drink: ShortAnswerItem = {
			id: 'tea',
			type: 'shortAnswer',
			payload: { prompt: 'drink', acceptedAnswers: ['čaj'] }
		};
		// Same accents -> match.
		expect(scoreShortAnswer(drink, 'čaj')).toBe(true);
		expect(scoreShortAnswer(drink, 'ČAJ')).toBe(true);
		// Missing accent -> no match.
		expect(scoreShortAnswer(drink, 'caj')).toBe(false);

		// 'Praha' matches 'praha' (case only) but 'hlavni mesto' (no accents)
		// must NOT match 'Hlavní město' (accents differ).
		expect(scoreShortAnswer(capital, 'hlavni mesto')).toBe(false);
		expect(scoreShortAnswer(capital, 'praHa')).toBe(true);
	});

	it('rejects unrelated answers', () => {
		expect(scoreShortAnswer(capital, 'Brno')).toBe(false);
		expect(scoreShortAnswer(capital, '')).toBe(false);
	});

	it('normalizes whitespace inside the answer', () => {
		expect(scoreShortAnswer(capital, 'Hlavní     město')).toBe(true);
	});
});

describe('multiple-choice scoring', () => {
	const item: MultipleChoiceItem = {
		id: 'm',
		type: 'multipleChoice',
		payload: {
			prompt: '1+1',
			choices: [
				{ id: 'a', label: '1' },
				{ id: 'b', label: '2' },
				{ id: 'c', label: '3' }
			],
			correctChoiceId: 'b'
		}
	};

	it('is correct on an exact choice-id match', () => {
		expect(scoreMultipleChoice(item, 'b')).toBe(true);
	});

	it('is wrong on any other id', () => {
		expect(scoreMultipleChoice(item, 'a')).toBe(false);
		expect(scoreMultipleChoice(item, 'c')).toBe(false);
		expect(scoreMultipleChoice(item, '__missing__')).toBe(false);
	});

	it('scoreItem routes by item type', () => {
		expect(scoreItem(item, 'b')).toBe(true);
		expect(scoreItem(item, 'a')).toBe(false);
	});
});

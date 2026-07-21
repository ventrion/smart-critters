/**
 * Content Pack validation + lookup.
 *
 * The frozen envelope (`{ id, type, payload }`) and the two payload shapes are
 * validated at load time so the Runtime can trust the types downstream. The
 * default repository imports the six hand-authored packs that ship with the
 * PoC (one pack.json per Subject x Grade folder under `content-packs/`); tests
 * can build their own fake repository by implementing {@link PackRepository}.
 */

import type {
	Grade,
	Item,
	MultipleChoicePayload,
	Pack,
	ShortAnswerPayload,
	Subject
} from './types.js';
import { GRADES, SUBJECTS } from './types.js';

import mathsGrade2Raw from './content-packs/maths-grade-2/pack.json';
import mathsGrade4Raw from './content-packs/maths-grade-4/pack.json';
import czechGrade2Raw from './content-packs/czech-grade-2/pack.json';
import czechGrade4Raw from './content-packs/czech-grade-4/pack.json';
import englishGrade2Raw from './content-packs/english-grade-2/pack.json';
import englishGrade4Raw from './content-packs/english-grade-4/pack.json';

/** Thrown when a pack fails validation or a lookup misses. */
export class PackError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'PackError';
	}
}

/** Repository contract: look up the pack for one Subject x Grade. */
export interface PackRepository {
	get(subject: Subject, grade: Grade): Pack;
}

function assertString(value: unknown, ctx: string): string {
	if (typeof value !== 'string') {
		throw new PackError(`${ctx}: expected string, got ${typeof value}`);
	}
	return value;
}

function assertNonEmptyString(value: unknown, ctx: string): string {
	const s = assertString(value, ctx);
	if (s.length === 0) throw new PackError(`${ctx}: must be non-empty`);
	return s;
}

function assertMultipleChoicePayload(raw: unknown, ctx: string): MultipleChoicePayload {
	if (typeof raw !== 'object' || raw === null) throw new PackError(`${ctx}: payload missing`);
	const obj = raw as Record<string, unknown>;
	const prompt = assertNonEmptyString(obj.prompt, `${ctx}.prompt`);
	if (!Array.isArray(obj.choices)) throw new PackError(`${ctx}.choices: expected array`);
	const choices = obj.choices.map((c, i) => {
		if (typeof c !== 'object' || c === null) throw new PackError(`${ctx}.choices[${i}]: not an object`);
		const o = c as Record<string, unknown>;
		return {
			id: assertNonEmptyString(o.id, `${ctx}.choices[${i}].id`),
			label: assertString(o.label, `${ctx}.choices[${i}].label`)
		};
	});
	if (choices.length < 2) throw new PackError(`${ctx}.choices: need at least 2`);
	const ids = new Set(choices.map((c) => c.id));
	if (ids.size !== choices.length) throw new PackError(`${ctx}.choices: duplicate ids`);
	const correctChoiceId = assertString(obj.correctChoiceId, `${ctx}.correctChoiceId`);
	if (!ids.has(correctChoiceId)) {
		throw new PackError(`${ctx}.correctChoiceId: not among choice ids`);
	}
	return { prompt, choices, correctChoiceId };
}

function assertShortAnswerPayload(raw: unknown, ctx: string): ShortAnswerPayload {
	if (typeof raw !== 'object' || raw === null) throw new PackError(`${ctx}: payload missing`);
	const obj = raw as Record<string, unknown>;
	const prompt = assertNonEmptyString(obj.prompt, `${ctx}.prompt`);
	if (!Array.isArray(obj.acceptedAnswers)) {
		throw new PackError(`${ctx}.acceptedAnswers: expected array`);
	}
	const acceptedAnswers = obj.acceptedAnswers.map((a, i) =>
		assertNonEmptyString(a, `${ctx}.acceptedAnswers[${i}]`)
	);
	if (acceptedAnswers.length < 1) {
		throw new PackError(`${ctx}.acceptedAnswers: need at least one`);
	}
	return { prompt, acceptedAnswers };
}

function assertItem(raw: unknown, index: number): Item {
	const ctx = `Item[${index}]`;
	if (typeof raw !== 'object' || raw === null) throw new PackError(`${ctx}: not an object`);
	const obj = raw as Record<string, unknown>;
	const id = assertNonEmptyString(obj.id, `${ctx}.id`);
	switch (obj.type) {
		case 'multipleChoice':
			return { id, type: 'multipleChoice', payload: assertMultipleChoicePayload(obj.payload, ctx) };
		case 'shortAnswer':
			return { id, type: 'shortAnswer', payload: assertShortAnswerPayload(obj.payload, ctx) };
		default:
			throw new PackError(`${ctx}.type: unknown item type ${String(obj.type)}`);
	}
}

/** Validate and narrow an untrusted parsed pack to a typed {@link Pack}. */
export function assertPack(raw: unknown): Pack {
	if (typeof raw !== 'object' || raw === null) throw new PackError('Pack: not an object');
	const obj = raw as Record<string, unknown>;
	if (obj.schemaVersion !== 1) {
		throw new PackError(`Pack.schemaVersion: expected 1, got ${String(obj.schemaVersion)}`);
	}
	if (!(SUBJECTS as readonly string[]).includes(obj.subject as string)) {
		throw new PackError(`Pack.subject: invalid subject ${String(obj.subject)}`);
	}
	const subject = obj.subject as Subject;
	if (!(GRADES as readonly number[]).includes(obj.grade as number)) {
		throw new PackError(`Pack.grade: invalid grade ${String(obj.grade)}`);
	}
	const grade = obj.grade as Grade;
	if (!Array.isArray(obj.items)) throw new PackError('Pack.items: expected array');
	const items = obj.items.map((it, i) => assertItem(it, i));
	return { schemaVersion: 1, subject, grade, items };
}

/** Stable key matching the on-disk pack folder name: `{subject}-grade-{n}`. */
export function packKey(subject: Subject, grade: Grade): string {
	return `${subject}-grade-${grade}`;
}

// Validate the six packs once at module load. A malformed pack fails loudly at
// import time rather than surfacing mid-Session.
const REGISTRY: Record<string, Pack> = {
	[packKey('maths', 2)]: assertPack(mathsGrade2Raw),
	[packKey('maths', 4)]: assertPack(mathsGrade4Raw),
	[packKey('czech', 2)]: assertPack(czechGrade2Raw),
	[packKey('czech', 4)]: assertPack(czechGrade4Raw),
	[packKey('english', 2)]: assertPack(englishGrade2Raw),
	[packKey('english', 4)]: assertPack(englishGrade4Raw)
};

/** All six shipped packs, keyed by `{subject}-grade-{n}`. */
export const SHIPPED_PACKS: Readonly<Record<string, Pack>> = REGISTRY;

/**
 * Default repository backed by the six shipped packs. Throws {@link PackError}
 * if a Subject x Grade has no pack (the PoC covers every Subject x {2,4}).
 */
export const defaultPackRepository: PackRepository = {
	get(subject, grade) {
		const pack = REGISTRY[packKey(subject, grade)];
		if (!pack) throw new PackError(`No pack for subject "${subject}" grade ${grade}`);
		return pack;
	}
};

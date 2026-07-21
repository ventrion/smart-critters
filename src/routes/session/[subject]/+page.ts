import { error } from '@sveltejs/kit';
import { SUBJECTS, type Subject } from '$lib/training-runtime';
import type { EntryGenerator, PageLoad } from './$types';

// The three Subjects are the only prerenderable Session routes (the PoC ships
// Maths / Czech / English only). With full prerender + adapter-static strict,
// `entries` makes the param space explicit so all three are prerendered even
// before link discovery.
export const entries: EntryGenerator = () =>
	SUBJECTS.map((subject) => ({ subject }));

export const load: PageLoad = ({ params }) => {
	const subject = params.subject as Subject;
	if (!SUBJECTS.includes(subject)) {
		throw error(404, `Unknown subject: ${params.subject}`);
	}
	return { subject };
};

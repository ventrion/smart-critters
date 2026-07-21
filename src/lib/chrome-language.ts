/**
 * Chrome Language strings — the labels of the app SHELL (grade control, Chrome
 * Language toggle, subject entry buttons, navigation chrome), keyed by the
 * install's Chrome Language. This is the language of the chrome only, distinct
 * from the language of Subject content inside a Content Pack (see CONTEXT.md).
 *
 * Pure data; no runes, no side effects. Consumed by Home and (later) Session /
 * Summary chrome so every route agrees on label text for the current Chrome
 * Language.
 */
import type { ChromeLanguage, Subject } from '$lib/training-runtime';

/** Self-label shown on each Chrome Language toggle option. */
export const chromeLanguageSelfLabel: Record<ChromeLanguage, string> = {
	cs: 'Čeština',
	en: 'English'
};

/** Chrome strings for one Chrome Language. */
export interface ChromeStrings {
	/** Grade control caption. */
	readonly grade: string;
	/** Caption for the Chrome Language toggle. */
	readonly language: string;
	/** XP badge suffix. */
	readonly xp: string;
	/** "Back to Home" link label. */
	readonly home: string;
	/** Subject entry button label per Subject. */
	readonly subjects: Record<Subject, string>;
	/** Session screen chrome (coach strip, feedback, Exit confirm). */
	readonly session: SessionStrings;
	/** Summary screen chrome (title, score, XP earned, primary CTA). */
	readonly summary: SummaryStrings;
}

/**
 * Session-screen chrome. Cara's speech-bubble text and the Exit confirmation
 * prompt are localizable here so the whole Session loop follows the install's
 * Chrome Language. Item payloads (prompts, choices, accepted answers) are NOT
 * translated here — they ship inside each Content Pack.
 */
export interface SessionStrings {
	/** Cara's opening line before the child answers the current item. */
	readonly bubblePrompt: string;
	/** Cara's line after a correct response. */
	readonly bubbleCorrect: string;
	/** Cara's line after an incorrect response. */
	readonly bubbleIncorrect: string;
	/** Caption for the short-answer submit button. */
	readonly check: string;
	/** Caption for the advance button after answering. */
	readonly next: string;
	/** Caption for the advance button on the last item. */
	readonly finish: string;
	/** Short-label position indicator, e.g. "3 / 8". */
	readonly position: (n: number, total: number) => string;
	/** Exit control label. */
	readonly exit: string;
	/** Title of the Exit confirmation prompt. */
	readonly exitConfirmTitle: string;
	/** Body of the Exit confirmation prompt (explains the 0-XP consequence). */
	readonly exitConfirmBody: string;
	/** Confirm button on the Exit prompt — ends the Session. */
	readonly exitConfirmYes: string;
	/** Cancel button on the Exit prompt — returns to the Session. */
	readonly exitConfirmNo: string;
}

/** Summary-screen chrome, including Cara's reaction line by pose. */
export interface SummaryStrings {
	/** Cara's line on a happy Summary (>= 70% correct). */
	readonly happyTitle: string;
	/** Cara's line on a try-again Summary (< 70% correct). */
	readonly tryAgainTitle: string;
	/** Label prefixing the score (correct / total). */
	readonly scoreLabel: string;
	/** Label prefixing the XP earned this Session. */
	readonly xpEarned: string;
	/** Single primary CTA back to Home. */
	readonly backHome: string;
}

export const chromeStrings: Record<ChromeLanguage, ChromeStrings> = {
	cs: {
		grade: 'Ročník',
		language: 'Jazyk',
		xp: 'XP',
		home: 'Domů',
		subjects: { maths: 'Matematika', czech: 'Čeština', english: 'Angličtina' },
		session: {
			bubblePrompt: 'Jaká je tvoje odpověď?',
			bubbleCorrect: 'Správně! Výborně!',
			bubbleIncorrect: 'Tentokrát ne. Zkusme další!',
			check: 'Zkontrolovat',
			next: 'Další',
			finish: 'Výsledky',
			position: (n, total) => `${n} / ${total}`,
			exit: 'Odejít',
			exitConfirmTitle: 'Ukončit relaci?',
			exitConfirmBody: 'Nezískáš žádné XP za tuto relaci.',
			exitConfirmYes: 'Ukončit',
			exitConfirmNo: 'Hrát dál'
		},
		summary: {
			happyTitle: 'Skvělá práce!',
			tryAgainTitle: 'Dobrý pokus — zkus to znovu!',
			scoreLabel: 'Skóre',
			xpEarned: 'Získané XP',
			backHome: 'Zpět domů'
		}
	},
	en: {
		grade: 'Grade',
		language: 'Language',
		xp: 'XP',
		home: 'Home',
		subjects: { maths: 'Maths', czech: 'Czech', english: 'English' },
		session: {
			bubblePrompt: "What's your answer?",
			bubbleCorrect: 'Correct! Great job!',
			bubbleIncorrect: "Not quite — let's try the next one!",
			check: 'Check',
			next: 'Next',
			finish: 'See results',
			position: (n, total) => `${n} / ${total}`,
			exit: 'Exit',
			exitConfirmTitle: 'End session?',
			exitConfirmBody: "You'll earn 0 XP for this session.",
			exitConfirmYes: 'End session',
			exitConfirmNo: 'Keep playing'
		},
		summary: {
			happyTitle: 'Great job!',
			tryAgainTitle: 'Good try — give it another go!',
			scoreLabel: 'Score',
			xpEarned: 'XP earned',
			backHome: 'Back to Home'
		}
	}
};

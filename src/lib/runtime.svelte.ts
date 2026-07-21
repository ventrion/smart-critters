/**
 * Install-wide Training Runtime binding for the UI.
 *
 * Owns the single {@link TrainingRuntime} instance and wires it to the browser
 * {@link LocalStoragePersistence} adapter, so the install's Grade, Chrome
 * Language, and XP total survive reload on the same install. Surfaces those
 * preferences as Svelte 5 reactive state (`$state`) plus small actions; Home
 * (and later Session / Summary) read and mutate through this module so every
 * route agrees on one install state.
 *
 * Runes (`$state`) are permitted in `.svelte.ts` modules. The module is
 * evaluated once per JS realm: once under Node during prerender (where the
 * adapter has no persistent store and the state sits at the fresh-install
 * defaults, which is what the prerendered HTML must show) and once in the
 * browser, where components hydrate persisted preferences via `hydratePrefs()`
 * from a browser-only hook.
 */
import {
	DEFAULT_CHROME_LANGUAGE,
	DEFAULT_GRADE,
	DEFAULT_XP_TOTAL,
	TrainingRuntime,
	type ChromeLanguage,
	type Grade
} from '$lib/training-runtime';
import { LocalStoragePersistence } from '$lib/persistence/local-storage-adapter';

/**
 * The single install runtime. Backed by `localStorage` in the browser; during
 * prerender the adapter resolves a build-only (or null) store and the runtime
 * reports the fresh-install defaults.
 */
export const runtime = new TrainingRuntime({ persistence: new LocalStoragePersistence() });

/**
 * Reactive install preferences. Seeded with the locked fresh-install defaults so
 * the very first client render matches the prerendered HTML (no hydration
 * mismatch). `hydratePrefs()` overwrites these from storage after mount.
 */
export const installPrefs = $state({
	grade: DEFAULT_GRADE as Grade,
	chromeLanguage: DEFAULT_CHROME_LANGUAGE as ChromeLanguage,
	xpTotal: DEFAULT_XP_TOTAL
});

/**
 * Pull the persisted preferences (Grade, Chrome Language, XP total) from the
 * runtime into reactive state. Call from a browser-only hook (the root layout's
 * `onMount`); during prerender it does not run, so the prerendered HTML always
 * carries the fresh-install defaults regardless of storage state.
 *
 * Idempotent — safe to call on every layout mount (one full page load).
 */
export function hydratePrefs(): void {
	const prefs = runtime.getPreferences();
	installPrefs.grade = prefs.grade;
	installPrefs.chromeLanguage = prefs.chromeLanguage;
	installPrefs.xpTotal = prefs.xpTotal;
}

/** Set the sticky install Grade and persist it. */
export function setGrade(grade: Grade): void {
	runtime.setGrade(grade);
	installPrefs.grade = grade;
}

/** Set the install Chrome Language and persist it. */
export function setChromeLanguage(chromeLanguage: ChromeLanguage): void {
	runtime.setChromeLanguage(chromeLanguage);
	installPrefs.chromeLanguage = chromeLanguage;
}

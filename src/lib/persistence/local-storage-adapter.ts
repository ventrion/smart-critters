/**
 * Browser persistence adapter — a {@link PersistencePort} backed by the Web
 * Storage (`localStorage`) API.
 *
 * The Training Runtime (#31) never touches storage directly; it depends on the
 * port. Wiring this adapter into the runtime gives the install's preferences
 * (Grade, Chrome Language, XP total) survival across reload on the same browser.
 *
 * The PoC is fully prerendered (adapter-static, no SPA fallback), so this module
 * must not assume `localStorage` exists: during prerender/SSR it may resolve to
 * a build-only store, and in some browsers it throws on any access (private
 * mode, disabled-by-user, sandboxed iframe). The adapter resolves the global
 * `localStorage` lazily, wraps every access so a thrown SecurityError never
 * escapes, and degrades to a best-effort no-op sink (reads -> null, writes ->
 * dropped) when storage is unavailable.
 */
import type { PersistencePort } from '$lib/training-runtime';

/** Subset of the Web Storage API the adapter relies on. */
export interface StorageLike {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

/**
 * Resolve the global `localStorage`, or `null` when it is unavailable.
 * Wrapped so a thrown `SecurityError` (or a `ReferenceError` on a runtime that
 * lacks the global) never escapes.
 */
function resolveLocalStorage(): StorageLike | null {
	try {
		const ls = globalThis.localStorage;
		return ls ?? null;
	} catch {
		return null;
	}
}

/**
 * `PersistencePort` backed by `localStorage`. Construct one per runtime realm;
 * two instances over the SAME underlying storage see the same data (this is
 * what makes preferences survive reload — each load builds a fresh adapter
 * against the same persistent store).
 */
export class LocalStoragePersistence implements PersistencePort {
	private readonly storage: StorageLike | null;

	/**
	 * @param storage Inject a Storage-like for testing. Defaults to the resolved
	 *   global `localStorage` (or `null` when unavailable).
	 */
	constructor(storage: StorageLike | null = resolveLocalStorage()) {
		this.storage = storage;
	}

	read(key: string): string | null {
		try {
			return this.storage?.getItem(key) ?? null;
		} catch {
			return null;
		}
	}

	write(key: string, value: string): void {
		try {
			this.storage?.setItem(key, value);
		} catch {
			// Quota exceeded / storage disabled: persistence is best-effort and
			// must never break the UI. The value simply won't survive reload.
		}
	}
}

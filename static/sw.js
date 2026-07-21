/*
 * Smart Critters service worker.
 *
 * Goal (issue #34, PoC definition "After first load/cache, a Training Session
 * can run offline"): cache the app shell and Content Packs so a Session runs
 * with the network offline after the first successful load/cache.
 *
 * Registration: served at `<base>/sw.js` (e.g. /smart-critters/sw.js on the
 * GitHub Pages project URL). The browser gives it the default scope of its
 * own directory, `<base>/`. We derive every cached URL from
 * `self.registration.scope`, so the SW is path-agnostic and follows whatever
 * base it was registered under — no hard-coded `/smart-critters` here.
 *
 * Content Packs: the six `pack.json` files are imported as JSON modules at
 * build time (see `src/lib/training-runtime/packs.ts`) and inlined into the
 * JS chunks under `_app/immutable/`. Caching those chunks therefore caches
 * the packs — there are no separate pack URLs to handle. Install preferences
 * (Grade / Chrome Language / XP total) live in localStorage, which is
 * available offline once the browser has loaded the shell.
 */

const CACHE = 'smart-critters-v1';
const SCOPE = self.registration.scope; // e.g. https://<user>.github.io/smart-critters/
const SCOPE_PATH = new URL(SCOPE).pathname; // e.g. /smart-critters/

/*
 * Known prerendered navigations + shared static assets. The hashed JS/CSS
 * chunks under `_app/immutable/` are not listed here on purpose — they are
 * picked up at runtime by the cache-first fetch handler on first load.
 */
const APP_SHELL_PATHS = [
	'',
	'session/maths',
	'session/czech',
	'session/english',
	'manifest.webmanifest',
	'critters/cara/idle.png',
	'critters/cara/happy.png',
	'critters/cara/try-again.png',
	'icons/icon-192.png',
	'icons/icon-512.png'
];

function shellUrls() {
	return APP_SHELL_PATHS.map((p) => new URL(p, SCOPE).href);
}

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE);
			// Best-effort precache. A single missing URL must not abort
			// install (e.g. the .html-vs-directory form of a route varies by
			// host); the runtime fetch handler fills gaps on first load.
			await Promise.allSettled(shellUrls().map((url) => cache.add(url)));
			await self.skipWaiting();
		})()
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(
				keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
			);
			await self.clients.claim();
		})()
	);
});

self.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET') return;

	const url = new URL(req.url);

	// Only handle same-origin GETs under our base path; let everything else
	// (cross-origin, etc.) pass straight through to the network.
	if (url.origin !== self.location.origin) return;
	if (!url.pathname.startsWith(SCOPE_PATH)) return;

	if (req.mode === 'navigate') {
		event.respondWith(networkFirstNavigation(req));
		return;
	}

	event.respondWith(cacheFirst(req));
});

/*
 * Navigations: network-first so the prerendered HTML can be updated while
 * online, falling back to the cached shell (with a couple of pathname
 * variants) when offline.
 */
async function networkFirstNavigation(req) {
	try {
		const fresh = await fetch(req);
		const cache = await caches.open(CACHE);
		cache.put(req, fresh.clone());
		return fresh;
	} catch (_err) {
		const direct = await caches.match(req, { ignoreSearch: true });
		if (direct) return direct;

		const url = new URL(req.url);
		const candidates = [
			new URL('./' + url.pathname.slice(SCOPE_PATH.length) + '/', SCOPE).href,
			new URL(
				'./' + url.pathname.slice(SCOPE_PATH.length).replace(/\/$/, '') + '.html',
				SCOPE
			).href,
			SCOPE
		];
		for (const candidate of candidates) {
			const hit = await caches.match(candidate, { ignoreSearch: true });
			if (hit) return hit;
		}
		return new Response('Offline and page not cached.', {
			status: 503,
			statusText: 'Service Unavailable'
		});
	}
}

/*
 * Static assets (JS/CSS/JSON/PNG under _app/immutable/ and the base):
 * cache-first with runtime population, falling back to network.
 */
async function cacheFirst(req) {
	const cached = await caches.match(req, { ignoreSearch: true });
	if (cached) return cached;
	try {
		const fresh = await fetch(req);
		// Only cache successful, same-origin basic responses.
		if (fresh.ok && fresh.type === 'basic') {
			const cache = await caches.open(CACHE);
			cache.put(req, fresh.clone());
		}
		return fresh;
	} catch (_err) {
		return new Response('Offline and resource not cached.', {
			status: 503,
			statusText: 'Service Unavailable'
		});
	}
}

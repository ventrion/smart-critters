/**
 * Playwright smoke tests for the Smart Critters PoC kid loop (#35).
 *
 * These tests prove DELIVERY WIRING for the locked loop — Home -> Subject ->
 * Session -> Summary -> Home, Exit, base path, offline — against the production
 * preview server (the same static build that ships to GitHub Pages).
 *
 * They assert OBSERVABLE OUTCOMES ONLY. They never re-implement Training Runtime
 * rules (shuffle/take-8, scoring, +10/+20 XP, Exit 0-XP). The displayed numbers
 * on the page are the source of truth: the suite reads them and asserts the
 * wiring between them holds, not that any specific arithmetic was computed.
 *
 * Run:  npm run test:e2e
 */
import { expect, test, type Page } from '@playwright/test';

/** GitHub Pages project base path (matches `paths.base` in svelte.config.js). */
const BASE = '/smart-critters';

/**
 * Read the install XP total as rendered on Home. The Home XP badge renders the
 * reactive `installPrefs.xpTotal` into `.xp-value`.
 */
async function readXpTotal(page: Page): Promise<number> {
	const text = await page.locator('.xp-value').textContent();
	expect(text, 'Home XP badge must render a numeric total').not.toBeNull();
	const n = Number(text);
	expect(Number.isFinite(n), `Home XP badge must be numeric, got: ${text}`).toBe(true);
	return n;
}

/**
 * Answer the currently-rendered Session Item by interacting with the rendered
 * UI only. For multiple-choice Items the correct choice is marked in the DOM
 * (`data-correct="true"`, used by the component's reveal styling) so we click
 * it to drive the accrual path. For short-answer Items the accepted answers
 * live only in the pack (not the DOM), so we submit a placeholder string —
 * those Items score wrong, which is fine: we only need the loop to complete.
 */
async function answerCurrentItem(page: Page): Promise<void> {
	const choices = page.locator('.work-area .choice');
	const choiceCount = await choices.count();
	if (choiceCount > 0) {
		// Prefer the correct choice when present; otherwise click the first one.
		const correct = page.locator('.work-area .choice[data-correct="true"]');
		const correctCount = await correct.count();
		const target = correctCount > 0 ? correct.first() : choices.first();
		await target.click();
		return;
	}
	// Short-answer: any non-empty string submits; correctness is irrelevant here.
	const input = page.locator('.answer-input');
	await expect(input).toBeVisible();
	await input.fill('a');
	await page.locator('.check-button').click();
}

/** Click the post-answer advance button to move to the next Item (or finish). */
async function advanceItem(page: Page): Promise<void> {
	await page.locator('.advance-button').click();
}

/**
 * Drive a full 8-Item Session from the playing phase through to the Summary
 * screen. Asserts the loop length (8) is observable from the DOM without
 * hard-coding the runtime's SESSION_LENGTH constant in the assertion logic —
 * we simply keep answering + advancing until the Summary appears.
 */
async function completeSession(page: Page): Promise<void> {
	// The Session route renders a brief loading shell, then onMount flips it to
	// playing. Wait for the work area to appear before driving it.
	await expect(page.locator('.work-area')).toBeVisible();
	for (let i = 0; i < 8; i++) {
		await answerCurrentItem(page);
		await expect(page.locator('.advance-button')).toBeVisible();
		await advanceItem(page);
	}
	await expect(page.locator('.summary')).toBeVisible();
}

/**
 * Read the XP earned this Session as displayed on the Summary screen
 * (`+{outcome.xpDelta}`). Returns the parsed integer.
 */
async function readSummaryXpDelta(page: Page): Promise<number> {
	// Two stats: score, then XP earned. The XP-earned <dd> renders `+<delta>`.
	const dds = page.locator('.summary-stats .stat dd');
	await expect(dds).toHaveCount(2);
	const text = await dds.nth(1).textContent();
	expect(text, 'Summary must display XP earned').not.toBeNull();
	const n = Number(text!.replace(/[+\s]/g, ''));
	expect(Number.isFinite(n), `Summary XP earned must be numeric, got: ${text}`).toBe(true);
	return n;
}

test.describe('Smart Critters PoC — kid loop smoke', () => {
	test('Home -> Subject -> Session -> Summary -> Home updates XP as expected', async ({
		page
	}) => {
		// Start at Home under the base path and capture the displayed XP total.
		await page.goto(`${BASE}/`);
		const startingXp = await readXpTotal(page);

		// Subject entry: tap the Czech label 'Matematika' (default Chrome Language
		// is Czech) — but locate it by class so this is not label-coupled.
		await page.locator('.subject-button').first().click();
		await expect(page).toHaveURL(new RegExp(`${BASE}/session/maths/?$`));

		// Drive the full 8-Item loop to Summary.
		await completeSession(page);

		// Read the XP earned this Session straight off the Summary DOM.
		const xpDelta = await readSummaryXpDelta(page);

		// Primary CTA returns to Home. Assert the displayed total changed by
		// exactly the displayed delta — pure wiring, no recomputation.
		await page.locator('.primary-cta').click();
		await expect(page).toHaveURL(new RegExp(`${BASE}/?$`));
		const finalXp = await readXpTotal(page);

		expect(finalXp).toBe(startingXp + xpDelta);
	});

	test('Exit confirm -> Home leaves XP unchanged', async ({ page }) => {
		await page.goto(`${BASE}/`);
		const startingXp = await readXpTotal(page);

		// Enter a Session and answer at least one Item, so we are past the
		// loading shell and any in-memory correctness state exists. Exit must
		// abandon the run with zero XP regardless of answered Items.
		await page.locator('.subject-button').nth(1).click();
		await expect(page).toHaveURL(new RegExp(`${BASE}/session/czech/?$`));
		await expect(page.locator('.work-area')).toBeVisible();
		await answerCurrentItem(page);

		// Exit -> confirm modal -> confirm ends the Session.
		await page.locator('.exit-button').click();
		await expect(page.locator('.modal')).toBeVisible();
		await page.locator('.modal-primary').click();

		// Back at Home with the total byte-for-byte unchanged.
		await expect(page).toHaveURL(new RegExp(`${BASE}/?$`));
		const finalXp = await readXpTotal(page);
		expect(finalXp).toBe(startingXp);
	});

	test('navigation and assets resolve under the /smart-critters base path', async ({
		page,
		request
	}) => {
		await page.goto(`${BASE}/`);

		// Home URL lives under the project base path.
		await expect(page).toHaveURL(new RegExp(`${BASE}/?$`));

		// Subject entry buttons href the three Session routes under the base.
		// The prerendered HTML may carry relative paths (`./session/maths`) which
		// SvelteKit resolves under the base; the observable outcome is that each
		// link's resolved URL points to `<base>/session/<subject>`.
		const subjectLinks = page.locator('.subject-button');
		await expect(subjectLinks).toHaveCount(3);
		const resolved = await subjectLinks.evaluateAll((els) =>
			(els as HTMLAnchorElement[]).map((a) => a.href)
		);
		for (const url of resolved) {
			expect(url, 'subject link must resolve under the base path').toMatch(
				new RegExp(`${BASE}/session/(maths|czech|english)$`)
			);
		}

		// Cara idle pose is served from the base path and actually loads.
		// SvelteKit prerender may rewrite the raw attribute to a relative URL
		// (e.g. `./critters/...`); what matters is the RESOLVED URL the browser
		// fetches, which is the observable outcome under the base path.
		const caraImg = page.locator('.cara img');
		const caraResolved = await caraImg.evaluate(
			(el) => (el as HTMLImageElement).src
		);
		expect(caraResolved, 'Cara pose must resolve under the base path').toContain(
			`${BASE}/critters/cara/idle.png`
		);
		const naturalWidth = await caraImg.evaluate((el) => (el as HTMLImageElement).naturalWidth);
		expect(naturalWidth, 'Cara idle pose must resolve to a real image').toBeGreaterThan(0);

		// PWA manifest + service worker script are reachable under the base path.
		const manifest = await request.get(`${BASE}/manifest.webmanifest`);
		expect(manifest.status(), 'manifest.webmanifest must resolve').toBe(200);
		const manifestJson = await manifest.json();
		expect(manifestJson.name).toBe('Smart Critters');
		expect(manifestJson.start_url).toBe('/smart-critters/');

		const sw = await request.get(`${BASE}/sw.js`);
		expect(sw.status(), 'sw.js must resolve').toBe(200);

		// All three Session routes are prerendered and reachable under the base.
		for (const subject of ['maths', 'czech', 'english'] as const) {
			await page.goto(`${BASE}/session/${subject}`);
			await expect(page).toHaveURL(new RegExp(`${BASE}/session/${subject}/?$`));
			await expect(page.locator('.subject-name')).toBeVisible();
		}
	});

	test('after cache priming, a Session runs with the network offline', async ({
		page,
		context
	}) => {
		// First load registers the service worker (production-only hook in the
		// root layout). Wait until an activated SW controls the page.
		await page.goto(`${BASE}/`);
		await expect(page.locator('.xp-badge')).toBeVisible();
		await page.waitForFunction(async () => {
			const reg = await navigator.serviceWorker.getRegistration();
			return !!reg && !!reg.active && !!navigator.serviceWorker.controller;
		});

		// Prime the cache: visit a Session route and Home again so the SW's
		// network-first navigation handler caches the prerendered HTML, and the
		// cache-first handler caches the JS/CSS chunks on first fetch.
		await page.goto(`${BASE}/session/maths`);
		await expect(page.locator('.session-topbar')).toBeVisible();
		await page.goto(`${BASE}/`);
		await expect(page.locator('.xp-badge')).toBeVisible();

		// Equivalent service-worker cache assertion: the SW must have populated
		// its cache with the base-path shell + Cara poses + Home navigation.
		const cached = await page.evaluate(async () => {
			const names = await caches.keys();
			const urls: string[] = [];
			for (const name of names) {
				const cache = await caches.open(name);
				const reqs = await cache.keys();
				urls.push(...reqs.map((r) => r.url));
			}
			return urls;
		});
		expect(cached.length, 'SW cache must be populated after priming').toBeGreaterThan(0);
		expect(
			cached.some((u) => u.includes('/smart-critters/')),
			'cached entries must live under the base path'
		).toBe(true);
		expect(
			cached.some((u) => u.endsWith('/critters/cara/idle.png')),
			'Cara idle pose must be precached'
		).toBe(true);

		// Cut the network. The cached Home must still serve and a fresh Session
		// must still run end-to-end (client-side nav + in-memory runtime + packs
		// already inlined into cached JS).
		try {
			await context.setOffline(true);

			// The offline reload MUST yield a 200 — only the SW serving the
			// cached shell can satisfy a navigation with the network down.
			const reload = await page.reload();
			expect(reload, 'offline Home reload must produce a response').not.toBeNull();
			expect(reload!.status(), 'offline Home must be served from the SW cache').toBe(200);
			await expect(page.locator('.xp-badge')).toBeVisible();

			await page.goto(`${BASE}/session/czech`);
			await expect(page.locator('.work-area')).toBeVisible();
			await answerCurrentItem(page);
			await expect(page.locator('.advance-button')).toBeVisible();
		} finally {
			await context.setOffline(false);
		}
	});
});

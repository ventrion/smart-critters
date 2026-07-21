import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the Smart Critters PoC smoke suite (#35).
 *
 * Tests run against the production preview server (the same static build that
 * ships to GitHub Pages), served under the `/smart-critters` base path. We do
 * NOT drive `vite dev`: the kid loop depends on the service worker, which only
 * registers in non-dev mode, and acceptance criteria require proving delivery
 * wiring under the real base path.
 *
 * `webServer` builds once and serves `build/` via `vite preview`. The poll URL
 * is the base path root so the webServer only hands off once the prerendered
 * Home is actually reachable.
 */
export default defineConfig({
	testDir: './tests',
	// Tests share a build output and exercise the same offline cache; keep them
	// serial so a stale SW/controller from one test cannot poison another.
	fullyParallel: false,
	workers: 1,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: process.env.CI ? 'list' : 'list',
	use: {
		baseURL: 'http://localhost:4173',
		trace: 'on-first-retry',
		// Service workers need a real browser back-end; headless Chromium is the
		// PoC's primary target (Android tablet + Chrome).
		...devices['Desktop Chrome']
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	],
	webServer: {
		command: 'npm run build && npm run preview -- --port 4173 --strictPort',
		url: 'http://localhost:4173/smart-critters/',
		reuseExistingServer: !process.env.CI,
		timeout: 180_000
	}
});

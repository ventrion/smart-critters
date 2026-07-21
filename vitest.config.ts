import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

// Dedicated Vitest config. Kept separate from vite.config.ts so the production
// build stays unaware of the test runner. The Training Runtime is pure TS, so
// the node environment is enough; no DOM/jsdom dependency.
export default defineConfig({
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{ts,js}'],
		environment: 'node'
	}
});

import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// Fully prerendered static site for GitHub Pages.
		// No SPA fallback: every route must be prerenderable (root layout sets
		// `export const prerender = true`, which cascades to all pages).
		adapter: adapter({
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		// Production assets/links live under the GitHub Pages project path.
		// In dev (`vite dev`) we keep an empty base so the local server serves '/'
		// directly; every other command (build / preview / check) uses the base.
		paths: {
			base: process.argv.includes('dev') ? '' : '/smart-critters'
		}
	}
};

export default config;

<script lang="ts">
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { base } from '$app/paths';
	import { hydratePrefs } from '$lib/runtime.svelte';

	let { children } = $props();

	// Hydrate persisted install prefs (Grade / Chrome Language / XP total) once
	// per browser page load. The layout wraps every route, so Home / Session /
	// Summary all see the persisted values. No-op during prerender: onMount does
	// not run there, and the runtime reports the fresh-install defaults anyway,
	// so the prerendered HTML is stable.
	onMount(() => {
		hydratePrefs();

		// Register the offline service worker in production only. In dev the
		// SW would aggressively cache the shell and hide code changes, so we
		// skip it. onMount does not run during prerender, so this never leaks
		// into the prerendered HTML.
		if (dev) return;
		if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;

		const register = (): void => {
			navigator.serviceWorker.register(`${base}/sw.js`, { scope: `${base}/` }).catch(() => {
				// Unsupported or blocked: the app still works online-only.
			});
		};
		// Defer until the window has loaded so the SW install does not compete
		// with first paint / pack fetches on the very first visit.
		if (document.readyState === 'complete') {
			register();
		} else {
			window.addEventListener('load', register, { once: true });
		}
	});
</script>

<svelte:head>
	<!-- PWA manifest + installability. `base` is '' in dev and '/smart-critters'
	     in prod, so this prerenders to the GitHub Pages project URL. -->
	<link rel="manifest" href={`${base}/manifest.webmanifest`} />
	<meta name="theme-color" content="#6c2bd9" />
	<link rel="icon" href={`${base}/icons/icon-192.png`} type="image/png" />
	<link rel="apple-touch-icon" href={`${base}/icons/icon-192.png`} />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta name="apple-mobile-web-app-title" content="Smart Critters" />
</svelte:head>

{@render children()}

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		font-family:
			system-ui,
			-apple-system,
			Segoe UI,
			Roboto,
			sans-serif;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(button) {
		font-family: inherit;
	}
</style>

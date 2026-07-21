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
	<meta name="theme-color" content="#1f6f7a" />
	<link rel="icon" href={`${base}/icons/icon-192.png`} type="image/png" />
	<link rel="apple-touch-icon" href={`${base}/icons/icon-192.png`} />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="default" />
	<meta name="apple-mobile-web-app-title" content="Smart Critters" />
	<!-- Prototype type stacks: companion-stage Home (Nunito/Fredoka), Session
	     coach strip (Fraunces/IBM Plex), celebration Summary (Fraunces/Literata). -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600&family=Fraunces:opsz,wght@9..144,500;9..144,650&family=IBM+Plex+Sans:wght@500;650;700&family=Literata:opsz,wght@7..72,500;7..72,600&family=Nunito:wght@600;700;800&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		font-family: 'Nunito', system-ui, sans-serif;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(button) {
		font-family: inherit;
	}

	:global(button:focus-visible),
	:global(input:focus-visible),
	:global(a:focus-visible) {
		outline: 2px solid #fff8ef;
		outline-offset: 2px;
	}
</style>

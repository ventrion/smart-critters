<script lang="ts">
	import { base } from '$app/paths';
	import { GRADES, SUBJECTS, type ChromeLanguage, type Subject } from '$lib/training-runtime';
	import { chromeStrings } from '$lib/chrome-language';
	import { installPrefs, setChromeLanguage, setGrade } from '$lib/runtime.svelte';

	// Internal route per Subject. Session UI is filled in by a later stage; Home
	// only needs to route into it.
	const subjectRoute: Record<Subject, string> = {
		maths: `${base}/session/maths`,
		czech: `${base}/session/czech`,
		english: `${base}/session/english`
	};

	// Reactive chrome strings for the current Chrome Language — subject button
	// labels and control captions follow the chosen language.
	const strings = $derived(chromeStrings[installPrefs.chromeLanguage]);

	function toggleChromeLanguage(): void {
		const next: ChromeLanguage = installPrefs.chromeLanguage === 'cs' ? 'en' : 'cs';
		setChromeLanguage(next);
	}
</script>

<svelte:head>
	<title>Smart Critters</title>
</svelte:head>

<!-- Companion-stage Home (prototype/xp-cara-home VariantA): Cara dominates;
     XP is a badge on the character; Grade + Subjects live in a bottom sheet.
     PoC locks no Level — badge shows XP total only. -->
<main class="stage">
	<header class="top">
		<span class="brand">{strings.brand}</span>
		<button
			class="lang"
			type="button"
			aria-label={strings.language}
			onclick={toggleChromeLanguage}
		>
			{installPrefs.chromeLanguage === 'cs' ? 'EN' : 'CS'}
		</button>
	</header>

	<section class="hero" aria-label="Cara">
		<img
			class="cara"
			src={`${base}/critters/cara/idle.png`}
			alt="Cara the capybara–mermaid Critter, idle pose"
			width="420"
			height="420"
		/>
		<div class="badge" title={strings.xp} aria-live="polite">
			<strong>{installPrefs.xpTotal}</strong>
			<span>{strings.xp}</span>
		</div>
	</section>

	<section class="controls">
		<div class="grade" role="group" aria-label={strings.grade}>
			<span>{strings.grade}</span>
			{#each GRADES as g (g)}
				<button
					type="button"
					class:on={installPrefs.grade === g}
					aria-pressed={installPrefs.grade === g}
					onclick={() => setGrade(g)}
				>
					{g}
				</button>
			{/each}
		</div>

		<nav class="subjects">
			{#each SUBJECTS as subject (subject)}
				<a class="subject" href={subjectRoute[subject]}>
					{strings.subjects[subject]}
				</a>
			{/each}
		</nav>
	</section>
</main>

<style>
	.stage {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		padding: 1rem 1rem 0;
		background:
			radial-gradient(ellipse 80% 50% at 50% 20%, #ffe8c8 0%, transparent 55%),
			linear-gradient(180deg, #7ec8c4 0%, #2f6f7a 55%, #1a3d45 100%);
		color: #14252a;
		font-family: 'Nunito', system-ui, sans-serif;
	}

	.top {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.brand {
		font-family: 'Fredoka', 'Nunito', sans-serif;
		font-weight: 600;
		font-size: 1.35rem;
		color: #fff8ef;
		text-shadow: 0 2px 0 rgb(0 0 0 / 0.15);
	}

	.lang {
		appearance: none;
		border: 2px solid #fff8ef;
		background: transparent;
		color: #fff8ef;
		border-radius: 0.5rem;
		padding: 0.25rem 0.55rem;
		font: 700 0.85rem/1 'Nunito', sans-serif;
		cursor: pointer;
	}

	.hero {
		position: relative;
		display: grid;
		place-items: end center;
		flex: 1 1 auto;
		min-height: 48dvh;
		margin: 0.5rem 0 1rem;
	}

	.cara {
		width: min(78vw, 420px);
		height: auto;
		filter: drop-shadow(0 18px 28px rgb(0 0 0 / 0.28));
		animation: bob 3.2s ease-in-out infinite;
	}

	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px);
		}
	}

	.badge {
		position: absolute;
		right: max(0.5rem, 8vw);
		top: 12%;
		display: grid;
		place-items: center;
		width: 5.5rem;
		height: 5.5rem;
		border-radius: 50%;
		background: #ffb070;
		color: #3a1f0a;
		box-shadow: 0 6px 0 #d67a3a;
		animation: pop 0.45s ease;
	}

	@keyframes pop {
		from {
			transform: scale(0.7);
		}
		to {
			transform: scale(1);
		}
	}

	.badge strong {
		font-size: 1.55rem;
		line-height: 1;
	}

	.badge span {
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.06em;
	}

	.controls {
		background: rgb(255 248 239 / 0.92);
		border-radius: 1.25rem 1.25rem 0 0;
		padding: 1rem 1rem 1.25rem;
		margin: 0 -1rem;
	}

	.grade {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
		font-weight: 800;
	}

	.grade button,
	.subject {
		appearance: none;
		border: 0;
		cursor: pointer;
		font: 800 1rem/1.1 'Nunito', sans-serif;
	}

	.grade button {
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 0.7rem;
		background: #d7ebe9;
		color: #1a3d45;
	}

	.grade button.on {
		background: #1a3d45;
		color: #fff8ef;
	}

	.subjects {
		display: grid;
		gap: 0.55rem;
	}

	.subject {
		display: block;
		padding: 0.95rem 1rem;
		border-radius: 1rem;
		background: #1a3d45;
		color: #fff8ef;
		text-decoration: none;
		text-align: center;
	}

	.subject:active {
		transform: translateY(1px);
	}
</style>

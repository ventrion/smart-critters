<script lang="ts">
	import { base } from '$app/paths';
	import {
		CHROME_LANGUAGES,
		GRADES,
		SUBJECTS,
		type Subject
	} from '$lib/training-runtime';
	import { chromeLanguageSelfLabel, chromeStrings } from '$lib/chrome-language';
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
</script>

<svelte:head>
	<title>Smart Critters</title>
</svelte:head>

<main>
	<header class="topbar">
		<div class="xp-badge" title={strings.xp}>
			<span class="xp-value">{installPrefs.xpTotal}</span>
			<span class="xp-suffix">{strings.xp}</span>
		</div>

		<div class="lang-toggle" role="group" aria-label={strings.language}>
			{#each CHROME_LANGUAGES as lang (lang)}
				<button
					type="button"
					class:active={installPrefs.chromeLanguage === lang}
					aria-pressed={installPrefs.chromeLanguage === lang}
					onclick={() => setChromeLanguage(lang)}
				>
					{chromeLanguageSelfLabel[lang]}
				</button>
			{/each}
		</div>
	</header>

	<section class="cara" aria-label="Cara">
		<img
			src={`${base}/critters/cara/idle.png`}
			alt="Cara the capybara–mermaid Critter, idle pose"
			width="320"
			height="320"
		/>
	</section>

	<section class="grade-control">
		<span class="control-label">{strings.grade}</span>
		<div class="grade-buttons" role="group" aria-label={strings.grade}>
			{#each GRADES as g (g)}
				<button
					type="button"
					class:active={installPrefs.grade === g}
					aria-pressed={installPrefs.grade === g}
					onclick={() => setGrade(g)}
				>
					{g}
				</button>
			{/each}
		</div>
	</section>

	<nav class="subjects">
		{#each SUBJECTS as subject (subject)}
			<a class="subject-button" href={subjectRoute[subject]}>
				{strings.subjects[subject]}
			</a>
		{/each}
	</nav>
</main>

<style>
	main {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 1.5rem 1.25rem 2.5rem;
		text-align: center;
		background: #fdfaff;
		color: #2a2333;
	}

	.topbar {
		width: 100%;
		max-width: 32rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
	}

	.xp-badge {
		display: inline-flex;
		align-items: baseline;
		gap: 0.35rem;
		padding: 0.45rem 0.9rem;
		border-radius: 999px;
		background: #ffd9ec;
		color: #7a1f4b;
		font-weight: 700;
	}

	.xp-value {
		font-size: 1.25rem;
	}

	.xp-suffix {
		font-size: 0.85rem;
		letter-spacing: 0.05em;
	}

	.lang-toggle {
		display: inline-flex;
		border-radius: 999px;
		overflow: hidden;
		border: 1px solid #e2d6ea;
		background: #fff;
	}

	.lang-toggle button {
		border: none;
		background: transparent;
		padding: 0.4rem 0.75rem;
		font-size: 0.85rem;
		cursor: pointer;
		color: inherit;
	}

	.lang-toggle button.active {
		background: #6c2bd9;
		color: #fff;
		font-weight: 600;
	}

	.cara img {
		max-width: min(70vw, 320px);
		height: auto;
		border-radius: 1.5rem;
	}

	.grade-control {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
	}

	.control-label {
		font-size: 0.9rem;
		opacity: 0.75;
	}

	.grade-buttons {
		display: inline-flex;
		gap: 0.5rem;
	}

	.grade-buttons button {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		border: 2px solid #e2d6ea;
		background: #fff;
		font-size: 1.1rem;
		font-weight: 700;
		cursor: pointer;
		color: inherit;
	}

	.grade-buttons button.active {
		background: #6c2bd9;
		border-color: #6c2bd9;
		color: #fff;
	}

	.subjects {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
		max-width: 22rem;
	}

	.subject-button {
		display: block;
		padding: 1rem 1.25rem;
		border-radius: 1rem;
		background: #6c2bd9;
		color: #fff;
		font-size: 1.15rem;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
	}

	.subject-button:active {
		transform: translateY(1px);
	}
</style>

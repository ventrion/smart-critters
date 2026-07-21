<script lang="ts">
	// Session + Summary Training loop.
	//
	// Subject entry starts an 8-Item Session drawn from the sticky Grade's pack
	// for the tapped Subject (runtime handles shuffle + take-8 + scoring + XP).
	// This component owns the per-Session UI state machine and renders three
	// phases against that single Session object:
	//
	//   loading      -> prerender-safe initial shell (no Session yet). onMount
	//                   starts the Session in the browser only.
	//   playing      -> Cara coach strip (Cara idle + speech bubble + progress
	//                   dots) BESIDE the Item work area; immediate feedback.
	//   confirm-exit -> Exit confirmation overlay; confirming calls exit()
	//                   (0 XP, no total mutation) and routes to Home.
	//   summary      -> Celebration beat: oversized XP count, score, Cara pose
	//                   happy (>=70%) or try-again (below), CTA back to Home.
	//
	// The Cara POSE stays `idle` throughout the Session; only the bubble text
	// reacts to per-item feedback. The pose swaps to `happy` / `try-again` on
	// the Summary screen, then back to `idle` when Home remounts.
	//
	// Visual language locked to prototypes:
	//   Session  -> prototype/training-session VariantB (coach strip)
	//   Summary  -> prototype/xp-cara-home VariantC (loud celebration)
	import { onDestroy, onMount } from 'svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { chromeStrings } from '$lib/chrome-language';
	import { hydratePrefs, installPrefs, runtime } from '$lib/runtime.svelte';
	import {
		SESSION_LENGTH,
		BONUS_THRESHOLD,
		XP_PER_CORRECT,
		type Item,
		type Session,
		type SessionComplete
	} from '$lib/training-runtime';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type Phase = 'loading' | 'playing' | 'confirm-exit' | 'summary';

	let session = $state<Session | null>(null);
	let phase = $state<Phase>('loading');
	let currentIndex = $state(0);
	let currentResponse = $state('');
	let answered = $state(false);
	let lastCorrect = $state(false);
	let outcome = $state<SessionComplete | null>(null);
	let shownXp = $state(0);
	let xpTicker: ReturnType<typeof setInterval> | undefined;

	const strings = $derived(chromeStrings[installPrefs.chromeLanguage]);
	const sessionStrings = $derived(strings.session);
	const summaryStrings = $derived(strings.summary);
	const currentItem = $derived<Item | null>(session?.items[currentIndex] ?? null);

	// Start the Session in the browser only. Prerender never runs onMount, so
	// the prerendered HTML carries the safe loading shell regardless of the
	// install's persisted prefs (same pattern Home uses for hydratePrefs).
	onMount(() => {
		session = runtime.startSession(data.subject, installPrefs.grade);
		currentIndex = 0;
		currentResponse = '';
		answered = false;
		lastCorrect = false;
		phase = 'playing';
	});

	onDestroy(() => {
		if (xpTicker !== undefined) clearInterval(xpTicker);
	});

	function respond(raw: string): void {
		if (!session || answered) return;
		lastCorrect = session.respond(currentIndex, raw);
		answered = true;
	}

	function submitShortAnswer(event: SubmitEvent): void {
		event.preventDefault();
		if (!session || answered) return;
		if (currentResponse.trim() === '') return;
		respond(currentResponse);
	}

	function advance(): void {
		if (!session) return;
		if (currentIndex + 1 >= SESSION_LENGTH) {
			finishSession();
			return;
		}
		currentIndex += 1;
		currentResponse = '';
		answered = false;
		lastCorrect = false;
	}

	function finishSession(): void {
		if (!session) return;
		outcome = session.complete();
		// Pull the committed XP total into reactive install state so Home, when
		// we route back, shows the updated value (the runtime already persisted
		// it via the injected localStorage adapter).
		hydratePrefs();
		phase = 'summary';
		startXpCountUp(outcome.xpDelta);
	}

	function startXpCountUp(target: number): void {
		shownXp = 0;
		if (xpTicker !== undefined) clearInterval(xpTicker);
		if (target <= 0) {
			shownXp = 0;
			return;
		}
		const step = Math.max(1, Math.round(target / 18));
		xpTicker = setInterval(() => {
			shownXp = Math.min(target, shownXp + step);
			if (shownXp >= target && xpTicker !== undefined) {
				clearInterval(xpTicker);
				xpTicker = undefined;
			}
		}, 40);
	}

	function requestExit(): void {
		phase = 'confirm-exit';
	}

	function cancelExit(): void {
		phase = 'playing';
	}

	function confirmExit(): void {
		if (!session) return;
		// Exit is read-only on the XP total and earns 0 for this Session.
		session.exit();
		goto(`${base}/`);
	}

	// Speech-bubble copy follows per-item feedback. Cara stays visually idle.
	const bubbleText = $derived(
		!answered
			? sessionStrings.bubblePrompt
			: lastCorrect
				? sessionStrings.bubbleCorrect
				: sessionStrings.bubbleIncorrect
	);

	// Progress dots match VariantB: done / now only (no correct/incorrect tint).
	type DotState = 'done' | 'now' | 'todo';
	const dots = $derived<DotState[]>(
		session
			? Array.from({ length: SESSION_LENGTH }, (_, i): DotState => {
					if (i < currentIndex) return 'done';
					if (i === currentIndex) {
						if (answered) return 'done';
						return 'now';
					}
					return 'todo';
				})
			: []
	);

	// Summary Cara pose and title by the >=70% rule (matches Runtime XP bonus).
	const ratio = $derived(outcome ? outcome.correct / outcome.total : 0);
	const isHappy = $derived(outcome !== null && ratio >= BONUS_THRESHOLD);
	const caraSummaryPose = $derived(isHappy ? 'happy' : 'try-again');
	const caraSummaryAlt = $derived(
		isHappy
			? 'Cara the capybara–mermaid Critter, happy pose'
			: 'Cara the capybara–mermaid Critter, try-again pose'
	);
	const summaryTitle = $derived(isHappy ? summaryStrings.happyTitle : summaryStrings.tryAgainTitle);
	const itemXp = $derived(outcome ? outcome.correct * XP_PER_CORRECT : 0);
	const sessionBonus = $derived(outcome ? outcome.xpDelta - itemXp : 0);
</script>

<svelte:head>
	<title>Session — {strings.subjects[data.subject]}</title>
</svelte:head>

{#if phase === 'summary' && outcome}
	<!-- SUMMARY celebration beat (xp-cara VariantC loud Summary). -->
	<main class="summary" class:happy={isHappy}>
		<img
			class="summary-cara"
			src={`${base}/critters/cara/${caraSummaryPose}.png`}
			alt={caraSummaryAlt}
			width="340"
			height="510"
		/>
		<p class="summary-label">{summaryStrings.earned}</p>
		<p class="summary-count" data-xp-delta={outcome.xpDelta} aria-live="polite">+{shownXp}</p>
		<p class="summary-title">{summaryTitle}</p>
		<p class="summary-score">
			{summaryStrings.scoreLabel}
			{outcome.correct}/{outcome.total}
		</p>
		<p class="summary-breakdown">
			{summaryStrings.itemXp} +{itemXp}
			{#if sessionBonus > 0}
				· {summaryStrings.bonus} +{sessionBonus}
			{/if}
		</p>
		<p class="summary-total">{summaryStrings.totalXp}: {outcome.xpTotal}</p>
		<a class="summary-cta" href={`${base}/`}>{summaryStrings.backHome}</a>
	</main>
{:else if session && currentItem && (phase === 'playing' || phase === 'confirm-exit')}
	<!-- SESSION coach strip (training-session VariantB). -->
	<div class="shell">
		<aside class="coach" aria-label="Cara coach">
			<div class="coach-top">
				<strong class="brand">{strings.brand}</strong>
				<span class="subject-chip">{strings.subjects[data.subject]}</span>
			</div>
			<img
				class="cara"
				src={`${base}/critters/cara/idle.png`}
				alt="Cara the capybara–mermaid Critter, idle pose"
				width="220"
				height="330"
			/>
			<p class="bubble" role="status" aria-live="polite">{bubbleText}</p>
			<div class="dots" aria-label={sessionStrings.position(currentIndex + 1, SESSION_LENGTH)}>
				{#each dots as state, i (i)}
					<span class:done={state === 'done'} class:now={state === 'now'}></span>
				{/each}
			</div>
		</aside>

		<main class="work">
			{#if phase === 'confirm-exit'}
				<section class="card">
					<h2 id="exit-confirm-title">{sessionStrings.exitConfirmTitle}</h2>
					<p>{sessionStrings.exitConfirmBody}</p>
					<div class="row">
						<button type="button" class="primary" onclick={cancelExit}>
							{sessionStrings.exitConfirmNo}
						</button>
						<button type="button" class="ghost" onclick={confirmExit}>
							{sessionStrings.exitConfirmYes}
						</button>
					</div>
				</section>
			{:else}
				<div class="toolbar">
					<span>{sessionStrings.position(currentIndex + 1, SESSION_LENGTH)}</span>
					<button type="button" class="ghost" onclick={requestExit}>
						{sessionStrings.exit}
					</button>
				</div>

				<section class="card">
					<h1 class="prompt">{currentItem.payload.prompt}</h1>

					{#if answered}
						<button type="button" class="primary" onclick={advance}>
							{currentIndex + 1 >= SESSION_LENGTH ? sessionStrings.finish : sessionStrings.next}
						</button>
					{:else if currentItem.type === 'multipleChoice'}
						<div class="choices">
							{#each currentItem.payload.choices as choice (choice.id)}
								<button type="button" class="choice" onclick={() => respond(choice.id)}>
									{choice.label}
								</button>
							{/each}
						</div>
					{:else}
						<form class="short-answer" onsubmit={submitShortAnswer}>
							<input
								type="text"
								class="answer-input"
								bind:value={currentResponse}
								autocomplete="off"
								autocapitalize="off"
								spellcheck="false"
							/>
							<button type="submit" class="primary" disabled={currentResponse.trim() === ''}>
								{sessionStrings.check}
							</button>
						</form>
					{/if}
				</section>
			{/if}
		</main>
	</div>
{:else}
	<!-- loading shell: prerender-safe, replaced once the Session starts. -->
	<main class="shell loading">
		<p class="loading-label">{strings.subjects[data.subject]}</p>
	</main>
{/if}

<style>
	/* ----- Session coach strip (VariantB sea–sand–peach) ----- */

	.shell {
		--ink: #17343f;
		--sea: #1f6f7a;
		--peach: #f0b48a;
		--sand: #f6efe4;
		--foam: #e7f3f4;
		display: grid;
		grid-template-columns: minmax(220px, 280px) 1fr;
		min-height: 100dvh;
		max-width: 980px;
		margin: 0 auto;
		background: linear-gradient(160deg, #c8e4e6 0%, var(--sand) 45%, #f3e4d4 100%);
		color: var(--ink);
		font-family: 'IBM Plex Sans', system-ui, sans-serif;
	}

	@media (max-width: 720px) {
		.shell {
			grid-template-columns: 1fr;
			grid-template-rows: auto 1fr;
		}
	}

	.coach {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1rem;
		background: color-mix(in oklab, var(--foam) 70%, white);
		border-right: 2px solid color-mix(in oklab, var(--sea) 20%, white);
	}

	@media (max-width: 720px) {
		.coach {
			border-right: 0;
			border-bottom: 2px solid color-mix(in oklab, var(--sea) 20%, white);
		}
	}

	.coach-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.brand {
		font-weight: 700;
	}

	.subject-chip {
		font-size: 0.85rem;
		font-weight: 650;
		opacity: 0.75;
	}

	.cara {
		width: min(100%, 220px);
		height: auto;
		aspect-ratio: 2 / 3;
		object-fit: contain;
		margin: 0 auto;
		display: block;
		filter: drop-shadow(0 10px 18px rgb(23 52 63 / 0.18));
	}

	.bubble {
		margin: 0;
		padding: 0.75rem 0.9rem;
		border-radius: 1rem 1rem 1rem 0.35rem;
		background: #fff;
		border: 2px solid color-mix(in oklab, var(--peach) 55%, white);
		font-family: 'Fraunces', Georgia, serif;
		font-size: 1.15rem;
		font-weight: 650;
	}

	.dots {
		display: flex;
		gap: 0.4rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.dots span {
		width: 0.7rem;
		height: 0.7rem;
		border-radius: 999px;
		background: #bcd4d7;
	}

	.dots span.done {
		background: var(--sea);
	}

	.dots span.now {
		outline: 2px solid var(--peach);
		outline-offset: 2px;
	}

	.work {
		padding: 1rem 1.1rem 1.5rem;
	}

	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.8rem;
		font-weight: 650;
	}

	.card {
		background: #fffdf9;
		border-radius: 1.25rem;
		padding: 1.35rem 1.2rem;
		border: 2px solid color-mix(in oklab, var(--sea) 18%, white);
		box-shadow: 0 12px 30px rgb(23 52 63 / 0.08);
	}

	.card h2 {
		margin: 0 0 0.5rem;
		font-family: 'Fraunces', Georgia, serif;
		font-size: 1.25rem;
		font-weight: 650;
	}

	.card p {
		margin: 0 0 1rem;
	}

	.prompt {
		margin: 0 0 1.1rem;
		font-family: 'Fraunces', Georgia, serif;
		font-size: clamp(1.7rem, 4vw, 2.35rem);
		font-weight: 650;
		line-height: 1.15;
	}

	.choices {
		display: grid;
		gap: 0.65rem;
	}

	.choice,
	.primary,
	.ghost {
		appearance: none;
		border: 0;
		cursor: pointer;
		font: inherit;
		font-weight: 700;
	}

	.choice {
		text-align: left;
		padding: 0.95rem 1rem;
		border-radius: 0.85rem;
		background: var(--foam);
		border: 2px solid transparent;
		font-size: 1.2rem;
		color: inherit;
	}

	.choice:hover {
		border-color: var(--sea);
	}

	.primary {
		margin-top: 0.85rem;
		width: 100%;
		padding: 0.95rem 1rem;
		border-radius: 0.85rem;
		background: var(--sea);
		color: #fff;
		font-size: 1.1rem;
	}

	.primary:disabled {
		opacity: 0.45;
		cursor: default;
	}

	.ghost {
		padding: 0.4rem 0.7rem;
		border-radius: 0.55rem;
		background: transparent;
		border: 2px solid color-mix(in oklab, var(--sea) 25%, white);
		color: var(--ink);
	}

	.short-answer {
		display: flex;
		flex-direction: column;
		gap: 0.7rem;
	}

	.answer-input {
		font: inherit;
		font-size: 1.35rem;
		font-weight: 650;
		padding: 0.85rem 1rem;
		border-radius: 0.85rem;
		border: 2px solid color-mix(in oklab, var(--sea) 25%, white);
		background: #fff;
		color: inherit;
	}

	.row {
		display: flex;
		gap: 0.6rem;
	}

	.row .primary,
	.row .ghost {
		flex: 1;
		margin: 0;
	}

	.loading {
		display: grid;
		place-items: center;
		padding: 2rem;
	}

	.loading-label {
		font-size: 1.1rem;
		font-weight: 650;
		opacity: 0.6;
	}

	/* ----- Summary celebration (VariantC) ----- */

	.summary {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 1.25rem;
		background: #2c241c;
		color: #f7f1e8;
		font-family: 'Literata', Georgia, serif;
	}

	.summary.happy {
		background: radial-gradient(circle at 50% 20%, #5a3d28 0%, #2c241c 55%);
	}

	.summary-cara {
		width: min(70vw, 340px);
		height: auto;
		aspect-ratio: 2 / 3;
		object-fit: contain;
		margin-bottom: 0.5rem;
		filter: drop-shadow(0 14px 24px rgb(0 0 0 / 0.35));
		animation: cheer 0.55s ease;
	}

	@keyframes cheer {
		0% {
			transform: scale(0.92);
			opacity: 0.4;
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.summary-label {
		margin: 0;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		font-size: 0.75rem;
		opacity: 0.75;
	}

	.summary-count {
		margin: 0.15rem 0 0.35rem;
		font-family: 'Fraunces', serif;
		font-size: clamp(3rem, 14vw, 5rem);
		font-weight: 650;
		line-height: 1;
	}

	.summary-title {
		margin: 0.35rem 0 0.5rem;
		font-family: 'Fraunces', serif;
		font-size: 1.35rem;
		font-weight: 650;
	}

	.summary-score,
	.summary-breakdown,
	.summary-total {
		margin: 0.2rem 0;
	}

	.summary-breakdown {
		opacity: 0.75;
		font-size: 0.95rem;
	}

	.summary-total {
		margin-top: 0.65rem;
		font-weight: 600;
	}

	.summary-cta {
		display: inline-block;
		margin-top: 1.4rem;
		padding: 0.95rem 1.8rem;
		border-radius: 999px;
		background: #f0a35e;
		color: #2c241c;
		font: 650 1.05rem/1 'Fraunces', serif;
		text-decoration: none;
	}

	.summary-cta:active {
		transform: translateY(1px);
	}
</style>

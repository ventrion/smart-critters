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
	//   summary      -> Score (correct / 8), XP earned, Cara happy (>=70%) or
	//                   try-again (below), single primary CTA back to Home.
	//
	// The Cara POSE stays `idle` throughout the Session; only the bubble text
	// reacts to per-item feedback. The pose swaps to `happy` / `try-again` on
	// the Summary screen, then back to `idle` when Home remounts.
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { chromeStrings } from '$lib/chrome-language';
	import { hydratePrefs, installPrefs, runtime } from '$lib/runtime.svelte';
	import {
		SESSION_LENGTH,
		BONUS_THRESHOLD,
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

	// One state per progress dot, derived from the Session's recorded results.
	type DotState = 'correct' | 'incorrect' | 'current' | 'todo';
	const dots = $derived<DotState[]>(
		session
			? Array.from({ length: SESSION_LENGTH }, (_, i): DotState => {
					if (phase === 'playing' && i === currentIndex) return 'current';
					const r = session!.results[i];
					if (r === undefined) return 'todo';
					return r ? 'correct' : 'incorrect';
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
</script>

<svelte:head>
	<title>Session — {strings.subjects[data.subject]}</title>
</svelte:head>

{#if phase === 'summary' && outcome}
	<!-- SUMMARY screen: score, XP earned this Session, Cara pose, single CTA. -->
	<main class="summary">
		<section class="summary-cara" aria-label="Cara">
			<img
				src={`${base}/critters/cara/${caraSummaryPose}.png`}
				alt={caraSummaryAlt}
				width="320"
				height="320"
			/>
		</section>

		<h1 class="summary-title">{summaryTitle}</h1>

		<dl class="summary-stats">
			<div class="stat">
				<dt>{summaryStrings.scoreLabel}</dt>
				<dd>{outcome.correct} / {outcome.total}</dd>
			</div>
			<div class="stat">
				<dt>{summaryStrings.xpEarned}</dt>
				<dd>+{outcome.xpDelta}</dd>
			</div>
		</dl>

		<a class="primary-cta" href={`${base}/`}>{summaryStrings.backHome}</a>
	</main>
{:else if session && currentItem && (phase === 'playing' || phase === 'confirm-exit')}
	<!-- SESSION screen: coach strip beside work area, Exit control. -->
	<main class="session">
		<header class="session-topbar">
			<span class="subject-name">{strings.subjects[data.subject]}</span>
			<button type="button" class="exit-button" onclick={requestExit}>
				{sessionStrings.exit}
			</button>
		</header>

		<div class="session-body">
			<section class="coach-strip" aria-label="Cara coach">
				<img
					class="cara-idle"
					src={`${base}/critters/cara/idle.png`}
					alt="Cara the capybara–mermaid Critter, idle pose"
					width="180"
					height="180"
				/>
				<div class="bubble" role="status" aria-live="polite">
					{bubbleText}
				</div>
				<ol class="dots" aria-label={sessionStrings.position(currentIndex + 1, SESSION_LENGTH)}>
					{#each dots as state, i (i)}
						<li class="dot" data-state={state} aria-label={sessionStrings.position(i + 1, SESSION_LENGTH)}></li>
					{/each}
				</ol>
			</section>

			<section class="work-area" aria-label="Item">
				<p class="position">{sessionStrings.position(currentIndex + 1, SESSION_LENGTH)}</p>
				<h2 class="prompt">{currentItem.payload.prompt}</h2>

				{#if currentItem.type === 'multipleChoice'}
					{@const chosen = session.responses[currentIndex] ?? null}
					{@const correctId = currentItem.payload.correctChoiceId}
					<div class="choices">
						{#each currentItem.payload.choices as choice (choice.id)}
							{@const isChosen = chosen === choice.id}
							{@const isCorrect = choice.id === correctId}
							<button
								type="button"
								class="choice"
								disabled={answered}
								data-chosen={isChosen}
								data-correct={isCorrect}
								data-reveal={answered}
								onclick={() => respond(choice.id)}
							>
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
							disabled={answered}
							autocomplete="off"
							autocapitalize="off"
							spellcheck="false"
						/>
						{#if !answered}
							<button
								type="submit"
								class="check-button"
								disabled={currentResponse.trim() === ''}
							>
								{sessionStrings.check}
							</button>
						{/if}
					</form>
					{#if answered}
						<p class="short-answer-result" data-correct={lastCorrect}>
							{currentResponse}
						</p>
					{/if}
				{/if}

				{#if answered}
					<button type="button" class="advance-button" onclick={advance}>
						{currentIndex + 1 >= SESSION_LENGTH ? sessionStrings.finish : sessionStrings.next}
					</button>
				{/if}
			</section>
		</div>

		{#if phase === 'confirm-exit'}
			<div class="modal-backdrop" role="presentation"></div>
			<div class="modal" role="dialog" aria-modal="true" aria-labelledby="exit-confirm-title">
				<h2 id="exit-confirm-title">{sessionStrings.exitConfirmTitle}</h2>
				<p>{sessionStrings.exitConfirmBody}</p>
				<div class="modal-actions">
					<button type="button" class="modal-secondary" onclick={cancelExit}>
						{sessionStrings.exitConfirmNo}
					</button>
					<button type="button" class="modal-primary" onclick={confirmExit}>
						{sessionStrings.exitConfirmYes}
					</button>
				</div>
			</div>
		{/if}
	</main>
{:else}
	<!-- loading shell: prerender-safe, replaced once the Session starts. -->
	<main class="session loading">
		<p class="loading-label">{strings.subjects[data.subject]}</p>
	</main>
{/if}

<style>
	main {
		min-height: 100dvh;
		display: flex;
		flex-direction: column;
		padding: 1.25rem;
		background: #fdfaff;
		color: #2a2333;
	}

	/* ----- Session ----- */

	.session {
		gap: 1rem;
	}

	.session-topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: 100%;
	}

	.subject-name {
		font-size: 1.05rem;
		font-weight: 700;
	}

	.exit-button {
		border: 1px solid #e2d6ea;
		background: #fff;
		color: inherit;
		padding: 0.45rem 0.85rem;
		border-radius: 999px;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.exit-button:active {
		transform: translateY(1px);
	}

	.session-body {
		flex: 1;
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem;
		align-items: flex-start;
		justify-content: center;
	}

	.coach-strip {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		flex: 0 0 18rem;
		min-width: 16rem;
	}

	.cara-idle {
		max-width: min(45vw, 180px);
		height: auto;
		border-radius: 1.25rem;
	}

	.bubble {
		position: relative;
		background: #fff;
		border: 1px solid #e2d6ea;
		border-radius: 1rem;
		padding: 0.6rem 0.85rem;
		font-size: 0.95rem;
		text-align: center;
		max-width: 16rem;
	}

	.dots {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: 0.4rem;
	}

	.dot {
		width: 0.85rem;
		height: 0.85rem;
		border-radius: 50%;
		background: #ece2f3;
		border: 1px solid #d6c6e2;
	}

	.dot[data-state='current'] {
		background: #6c2bd9;
		border-color: #6c2bd9;
		transform: scale(1.15);
	}

	.dot[data-state='correct'] {
		background: #4cb782;
		border-color: #4cb782;
	}

	.dot[data-state='incorrect'] {
		background: #e8829b;
		border-color: #e8829b;
	}

	.work-area {
		flex: 1 1 18rem;
		min-width: 16rem;
		display: flex;
		flex-direction: column;
		gap: 0.9rem;
		background: #fff;
		border: 1px solid #ece2f3;
		border-radius: 1.25rem;
		padding: 1.25rem;
	}

	.position {
		margin: 0;
		font-size: 0.8rem;
		opacity: 0.7;
		letter-spacing: 0.04em;
	}

	.prompt {
		margin: 0;
		font-size: 1.3rem;
		font-weight: 600;
		line-height: 1.3;
	}

	.choices {
		display: flex;
		flex-direction: column;
		gap: 0.55rem;
	}

	.choice {
		border: 2px solid #e2d6ea;
		background: #fff;
		color: inherit;
		padding: 0.75rem 1rem;
		border-radius: 0.85rem;
		font-size: 1.05rem;
		text-align: left;
		cursor: pointer;
		transition:
			background-color 0.1s ease,
			border-color 0.1s ease;
	}

	.choice:disabled {
		cursor: default;
	}

	/* Reveal state after answering: chosen-wrong turns pink, chosen-right and the
	   correct id both turn green. */
	.choice[data-reveal='true'][data-correct='true'] {
		border-color: #4cb782;
		background: #e7f6ee;
		color: #1f6c45;
		font-weight: 600;
	}

	.choice[data-reveal='true'][data-chosen='true'][data-correct='false'] {
		border-color: #e8829b;
		background: #fce8ee;
		color: #8a2742;
		font-weight: 600;
	}

	.short-answer {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.answer-input {
		flex: 1 1 12rem;
		min-width: 10rem;
		padding: 0.7rem 0.9rem;
		font-size: 1.05rem;
		border: 2px solid #e2d6ea;
		border-radius: 0.75rem;
		background: #fff;
		color: inherit;
	}

	.answer-input:focus {
		outline: none;
		border-color: #6c2bd9;
	}

	.answer-input:disabled {
		opacity: 0.85;
	}

	.check-button,
	.advance-button {
		border: none;
		background: #6c2bd9;
		color: #fff;
		padding: 0.7rem 1.1rem;
		border-radius: 0.75rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
	}

	.check-button:disabled,
	.advance-button:disabled {
		opacity: 0.55;
		cursor: default;
	}

	.advance-button {
		align-self: stretch;
		margin-top: 0.25rem;
	}

	.short-answer-result {
		margin: 0;
		padding: 0.55rem 0.85rem;
		border-radius: 0.6rem;
		font-weight: 600;
	}

	.short-answer-result[data-correct='true'] {
		background: #e7f6ee;
		color: #1f6c45;
	}

	.short-answer-result[data-correct='false'] {
		background: #fce8ee;
		color: #8a2742;
		text-decoration: line-through;
	}

	/* ----- Exit confirmation modal ----- */

	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(42, 35, 51, 0.45);
	}

	.modal {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #fff;
		color: #2a2333;
		padding: 1.25rem 1.25rem 1rem;
		border-radius: 1rem;
		width: min(90vw, 22rem);
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		box-shadow: 0 10px 30px rgba(42, 35, 51, 0.2);
	}

	.modal h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	.modal p {
		margin: 0;
		font-size: 0.95rem;
		opacity: 0.85;
	}

	.modal-actions {
		display: flex;
		gap: 0.5rem;
		justify-content: flex-end;
		margin-top: 0.4rem;
	}

	.modal-secondary {
		border: 1px solid #e2d6ea;
		background: #fff;
		color: inherit;
		padding: 0.5rem 0.85rem;
		border-radius: 0.6rem;
		cursor: pointer;
	}

	.modal-primary {
		border: none;
		background: #b0324b;
		color: #fff;
		padding: 0.5rem 0.85rem;
		border-radius: 0.6rem;
		font-weight: 600;
		cursor: pointer;
	}

	/* ----- Summary ----- */

	.summary {
		align-items: center;
		justify-content: center;
		gap: 1.1rem;
		text-align: center;
	}

	.summary-cara img {
		max-width: min(60vw, 320px);
		height: auto;
		border-radius: 1.5rem;
	}

	.summary-title {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 700;
	}

	.summary-stats {
		display: flex;
		gap: 1.5rem;
		margin: 0;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
		background: #fff;
		border: 1px solid #ece2f3;
		border-radius: 1rem;
		padding: 0.85rem 1.25rem;
		min-width: 7rem;
	}

	.stat dt {
		font-size: 0.8rem;
		opacity: 0.7;
		letter-spacing: 0.04em;
	}

	.stat dd {
		margin: 0;
		font-size: 1.4rem;
		font-weight: 700;
	}

	.primary-cta {
		display: inline-block;
		margin-top: 0.5rem;
		padding: 0.85rem 1.5rem;
		border-radius: 1rem;
		background: #6c2bd9;
		color: #fff;
		font-size: 1.1rem;
		font-weight: 600;
		text-decoration: none;
	}

	.primary-cta:active {
		transform: translateY(1px);
	}

	/* ----- Loading ----- */

	.loading {
		align-items: center;
		justify-content: center;
	}

	.loading-label {
		font-size: 1.1rem;
		font-weight: 600;
		opacity: 0.6;
	}
</style>

<script lang="ts">
	import { matchWinner } from '$lib/match';
	import type { ResolvedMatch, MatchRoster } from '$lib/types';
	import RosterLogo from '../ui/RosterLogo.svelte';

	type Props = {
		match: ResolvedMatch;
		seasonSlug: string;
		prevMatches: number;
		isFirst: boolean;
		isLast: boolean;
		hoveredId?: string | null;
	};

	let {
		match,
		seasonSlug,
		prevMatches,
		isFirst,
		isLast,
		hoveredId = $bindable(null)
	}: Props = $props();

	const winner = $derived(matchWinner(match));
	const verticalLineHeight = $derived(66 * prevMatches - 48);

	function setHovered(rosterId?: string | null) {
		hoveredId = rosterId ?? null;
	}
</script>

<div
	class={[!isFirst && 'not-first-match', !isLast && 'not-last-match', 'relative flex h-[100px]']}
>
	<div class="grow">
		{@render side(match.rosterA, winner === 'A', match.teamAScore, 'rounded-t-lg')}

		<div class="h-[2px] w-full bg-gray-200"></div>

		{@render side(match.rosterB, winner === 'B', match.teamBScore, 'rounded-b-lg')}
	</div>

	{#if !isFirst}
		<div
			class="vertical-line"
			style="top: calc(-{verticalLineHeight}% + 1px); bottom: calc(-{verticalLineHeight}% + 1px);"
		></div>
	{/if}
</div>

{#snippet side(
	roster?: MatchRoster | null,
	won?: boolean | null,
	score?: number | null,
	extraClass?: string
)}
	<div
		class={[
			extraClass,
			'flex h-12 items-center pr-4 transition-all',
			roster && hoveredId === roster?.id
				? 'bg-gray-50'
				: match.played
					? won
						? 'bg-gray-200'
						: 'bg-gray-50'
					: 'bg-gray-100'
		]}
		onmouseenter={() => setHovered(roster?.id)}
		onmouseleave={() => setHovered(null)}
		onfocus={() => setHovered(roster?.id)}
		onblur={() => setHovered(null)}
		tabindex={roster ? 0 : undefined}
		role="button"
	>
		{#if roster}
			<div
				class={[
					match.played ? 'text-2xl font-extrabold' : 'text-lg font-medium',
					won ? 'text-accent-600' : 'text-gray-400',
					'flex h-full shrink-0 items-center justify-center px-4 text-center'
				]}
			>
				{score ?? '?'}
			</div>

			<RosterLogo id={roster.id} class="mr-2 size-8" />
			<a
				href="/lag/{roster?.slug}/{seasonSlug}"
				class={[
					match.played
						? won
							? 'font-semibold text-gray-900'
							: 'font-medium text-gray-700'
						: 'font-medium text-gray-800',
					'mr-auto truncate hover:text-accent-600 hover:underline'
				]}
			>
				{roster?.name}
			</a>
		{:else}
			<div class="grow text-center font-medium text-gray-400">???</div>
		{/if}
	</div>
{/snippet}

<style>
	.not-last-match::after,
	.not-first-match::before {
		content: '';
		position: absolute;
		background-color: var(--color-gray-200);
		height: 2px;
		z-index: -1;
	}

	.not-last-match::after {
		top: calc(50% - 2px);
		right: -24px;
		left: 100%;
	}

	.not-first-match::before {
		top: calc(50% - 2px);
		right: 100%;
		left: -24px;
	}

	.vertical-line {
		position: absolute;
		left: -24px;
		width: 2px;
		transform: translateY(-1px);
		background-color: var(--color-gray-200);
		z-index: -1;
	}
</style>

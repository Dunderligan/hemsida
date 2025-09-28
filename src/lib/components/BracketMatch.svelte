<script lang="ts">
	import type { ResolvedMatch, MatchRoster } from '$lib/types';
	import RosterLogo from './RosterLogo.svelte';

	type Props = {
		match: ResolvedMatch;
		seasonSlug: string;
	};

	let { match, seasonSlug }: Props = $props();

	const teamAWon =
		match.played === false ? null : (match.teamAScore ?? 0) > (match.teamBScore ?? 0);
</script>

<div class="flex flex-col gap-1 overflow-hidden rounded-lg">
	{@render side(match.rosterA, teamAWon === true, match.teamAScore)}

	{@render side(match.rosterB, teamAWon === false, match.teamBScore)}
</div>

{#snippet side(
	roster: MatchRoster | undefined | null,
	won: boolean,
	score: number | undefined | null
)}
	<div class={['flex h-14 items-center pr-2', won ? 'bg-gray-200' : 'bg-gray-100']}>
		<div
			class={[
				won ? 'bg-accent-600 text-white' : 'text-gray-600',
				'flex h-full w-10 shrink-0 items-center justify-center font-display text-2xl font-extrabold'
			]}
		>
			{score ?? '-'}
		</div>

		{#if roster}
			<RosterLogo id={roster.id} class="mx-2 size-12" />
			<a
				href="/lag/{seasonSlug}/{roster?.slug}"
				class={[
					won ? 'font-semibold text-gray-800' : 'font-semibold text-gray-600',
					'mr-auto truncate hover:text-accent-600 hover:underline'
				]}
			>
				{roster?.name}
			</a>
		{:else}
			<div class="font-medium text-gray-400 italic">Ska beslutas...</div>
		{/if}
	</div>
{/snippet}

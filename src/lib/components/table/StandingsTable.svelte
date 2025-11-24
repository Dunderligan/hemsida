<script lang="ts">
	import type { Roster } from '$lib/types';
	import type { TableScore } from '$lib/util';
	import RosterLogo from '../ui/RosterLogo.svelte';
	import Table from './Table.svelte';

	type Props = {
		rosters: Roster[];
		scores: { rosterId: string; score: TableScore }[];
		seasonSlug: string;
	};

	let { rosters, scores, seasonSlug }: Props = $props();
</script>

<Table
	columns={[
		'#',
		{
			label: 'Lag',
			center: false
		},
		'Poäng',
		'W/L/D',
		'Matcher'
	]}
	rows={scores}
	key={(row) => row.rosterId}
	class="max-w-2xl grid-cols-[40px_1fr_50px_60px_70px] sm:grid-cols-[50px_1fr_80px_60px_80px]"
>
	{#snippet row({ index, value: { rosterId, score } })}
		{@const { id, name, slug } = rosters.find((roster) => roster.id === rosterId)!}

		<div
			class="flex items-center justify-center bg-gray-100 text-lg font-semibold transition-colors duration-200 group-hover:bg-gray-50"
		>
			{index + 1}
		</div>

		<div
			class="flex min-w-0 items-center gap-2 bg-gray-100 py-2 text-lg font-semibold transition-colors duration-200 group-hover:bg-gray-50"
		>
			<RosterLogo {id} class="size-12 transition-transform duration-200 group-hover:scale-110" />

			<a
				href="/lag/{slug}/{seasonSlug}"
				class="truncate transition-colors duration-200 hover:text-accent-600 hover:underline"
				>{name}</a
			>
		</div>

		<div
			class="flex items-center justify-center bg-gray-100 text-xl font-semibold transition-colors duration-200 group-hover:bg-gray-50"
		>
			{score.mapWins}
		</div>

		<div
			class="flex items-center justify-center bg-gray-100 text-lg font-medium transition-colors duration-200 group-hover:bg-gray-50"
		>
			{score.mapWins}/{score.mapLosses}/{score.mapDraws}
		</div>

		<div
			class="flex items-center justify-center bg-gray-100 text-lg font-medium transition-colors duration-200 group-hover:bg-gray-50"
		>
			{score.matchesPlayed}
		</div>
	{/snippet}
</Table>

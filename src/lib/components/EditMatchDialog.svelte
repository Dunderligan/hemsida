<script lang="ts">
	import { RosterState } from '$lib/state/rosters.svelte';
	import Dialog from './Dialog.svelte';
	import RosterSelect from './RosterSelect.svelte';

	const rosters = RosterState.get();

	const match = $derived(rosters.editingMatch);

	let open = $derived(match !== null);

	$effect(() => {
		if (!match) return;
		match.played = match.teamAScore !== null || match.teamBScore !== null || match.draws !== null;
	});
</script>

<Dialog
	title="Redigera match"
	{open}
	onOpenChange={(state) => {
		if (!state) {
			rosters.stopEditing();
		}
	}}
>
	{#if match}
		<div class="flex">
			<RosterSelect bind:selectedId={match.rosterAId} disabled={!rosters.canEditRosters} />
			<input class="min-w-0 grow" bind:value={match.teamAScore} type="number" min="0" max="3" />
		</div>
		<div class="flex">
			<RosterSelect bind:selectedId={match.rosterBId} disabled={!rosters.canEditRosters} />
			<input class="min-w-0 grow" bind:value={match.teamBScore} type="number" min="0" max="3" />
		</div>
	{/if}
</Dialog>

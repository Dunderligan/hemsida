<script lang="ts">
	import { RosterState } from '$lib/state/rosters.svelte';

	type Props = {
		selectedId?: string | null;
		disabled?: boolean;
	};

	let { selectedId = $bindable(), disabled }: Props = $props();

	const rosters = RosterState.get();
</script>

<select bind:value={selectedId} {disabled}>
	{#each rosters.map as [id, { name }] (id)}
		<option value={id}>{name}</option>
	{/each}
</select>

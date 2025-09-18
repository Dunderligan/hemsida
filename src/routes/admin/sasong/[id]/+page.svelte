<script lang="ts">
	import Dialog from '$lib/components/Dialog.svelte';
	import { createDivision } from './page.remote.js';

	const { data } = $props();

	const season = $state(data.season);

	let createDialogOpen = $state(false);
	let newDivisionName = $state('');

	async function submitDivision() {
		const { division } = await createDivision({
			name: newDivisionName,
			seasonId: season.id
		});

		season.divisions.push(division);
		createDialogOpen = false;
		newDivisionName = '';

		//await goto(`/admin/division/${division.id}`);
	}
</script>

<div class="space-y-6">
	<h1 class="text-4xl font-bold">{season.name}</h1>

	<button onclick={() => (createDialogOpen = true)}>Skapa division</button>

	<table class="w-full">
		<thead>
			<tr>
				<th> Namn </th>
				<th> </th>
			</tr>
		</thead>
		<tbody>
			{#each season.divisions as { id, name }, i (id)}
				<tr>
					<td>
						<a href="/admin/division/{id}">{name}</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<Dialog title="Skapa division" bind:open={createDialogOpen}>
	<input type="text" bind:value={newDivisionName} />
	<button onclick={submitDivision}>Skapa</button>
</Dialog>

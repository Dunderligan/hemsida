<script lang="ts">
	import { goto } from '$app/navigation';
	import Dialog from '$lib/components/Dialog.svelte';
	import { createGroup, deleteDivision } from './page.remote';

	const { data } = $props();

	const division = $state(data.division);
	const season = $derived(division.season);

	let createDialogOpen = $state(false);
	let newGroupName = $state('');

	async function submitGroup() {
		const { group } = await createGroup({
			name: newGroupName,
			divisionId: division.id
		});

		division.groups.push(group);
		createDialogOpen = false;
		newGroupName = '';

		//await goto(`/admin/grupp/${group.id}`);
	}

	async function submitDelete() {
		await deleteDivision({
			id: division.id
		});

		await goto(`/admin/sasong/${season.id}`);
	}
</script>

<div class="space-y-6">
	<a class="text-xl font-semibold" href="/admin/sasong/{season.id}">{season.name}</a>
	<h1 class="text-4xl font-bold">{division.name}</h1>

	<button onclick={() => (createDialogOpen = true)}>Skapa grupp</button>

	<table class="w-full">
		<thead>
			<tr>
				<th> Namn </th>
			</tr>
		</thead>
		<tbody>
			{#each division.groups as { id, name, slug }, i (id)}
				<tr>
					<td>
						<a href="/admin/grupp/{id}">{name}</a>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>

	<button onclick={submitDelete}>Radera division</button>
</div>

<Dialog title="Skapa grupp" bind:open={createDialogOpen}>
	<input type="text" bind:value={newGroupName} />
	<button onclick={submitGroup}>Skapa</button>
</Dialog>

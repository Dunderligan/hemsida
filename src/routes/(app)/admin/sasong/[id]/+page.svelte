<script lang="ts">
	import { goto } from '$app/navigation';
	import AdminCard from '$lib/components/AdminCard.svelte';
	import AdminLink from '$lib/components/AdminLink.svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Button from '$lib/components/Button.svelte';
	import Dialog from '$lib/components/Dialog.svelte';
	import InputField from '$lib/components/InputField.svelte';
	import Label from '$lib/components/Label.svelte';
	import { createDivision, deleteSeason } from './page.remote.js';

	const { data } = $props();

	const season = $state(data.season);

	let createDialogOpen = $state(false);
	let newDivisionName = $state('');

	let name = $state(season.name);

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

	async function submitDelete() {
		await deleteSeason({
			id: season.id
		});

		await goto('/admin');
	}
</script>

<Breadcrumbs crumbs={[{ label: season.name, href: `/admin/sasong/${season.id}` }]} />

<AdminCard title="Divisioner">
	<div class="space-y-1 overflow-hidden rounded-lg">
		{#each season.divisions as { id, name } (id)}
			<AdminLink href="/admin/division/{id}">
				{name}
			</AdminLink>
		{/each}
	</div>

	<Button icon="mdi:plus" kind="secondary" onclick={() => (createDialogOpen = true)} />
</AdminCard>

<AdminCard title="Inställningar">
	<Label label="Namn">
		<InputField bind:value={name} />
	</Label>

	<Button icon="mdi:trash-can" label="Radera säsong" kind="negative" onclick={submitDelete} />
</AdminCard>

<Dialog title="Skapa division" bind:open={createDialogOpen}>
	<input type="text" bind:value={newDivisionName} />
	<button onclick={submitDivision}>Skapa</button>
</Dialog>

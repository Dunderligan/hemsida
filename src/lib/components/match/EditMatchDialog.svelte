<script lang="ts">
	import { RosterContext } from '$lib/state/rosters.svelte';
	import { SaveContext } from '$lib/state/save.svelte';
	import Dialog from '../ui/Dialog.svelte';
	import InputField from '../ui/InputField.svelte';
	import Label from '../ui/Label.svelte';
	import RosterSelect from '../admin/RosterSelect.svelte';
	import Checkbox from '../ui/Checkbox.svelte';
	import DateInput from '../ui/DateInput.svelte';

	const rosterCtx = RosterContext.get();
	const saveCtx = SaveContext.get();

	const match = $derived(rosterCtx.editingMatch);

	let open = $derived(match !== null);
</script>

<Dialog
	{open}
	wide
	title="Redigera match"
	buttons={[
		{
			label: 'Klar',
			icon: 'ph:check',
			onclick: () => rosterCtx.stopMatchEdit()
		}
	]}
	onOpenChange={(state) => {
		if (!state) {
			rosterCtx.stopMatchEdit();
		}
	}}
>
	{#if match}
		<div class="space-y-1">
			<Label label="Spelad">
				<Checkbox bind:checked={match.played} onCheckedChange={saveCtx.setDirty} />
			</Label>
		</div>

		<div class="flex gap-2">
			<RosterSelect
				class="w-full"
				bind:selectedId={match.rosterAId}
				disabled={!rosterCtx.canEditRosters}
				onValueChange={saveCtx.setDirty}
			/>
			<InputField
				class="w-1/3 min-w-0"
				bind:value={match.teamAScore}
				onchange={saveCtx.setDirty}
				type="number"
				placeholder="Poäng"
			/>
		</div>
		<div class="flex gap-2">
			<RosterSelect
				class="w-full"
				bind:selectedId={match.rosterBId}
				disabled={!rosterCtx.canEditRosters}
				onValueChange={saveCtx.setDirty}
			/>
			<InputField
				class="w-1/3 min-w-0"
				bind:value={match.teamBScore}
				onchange={saveCtx.setDirty}
				type="number"
				placeholder="Poäng"
			/>
		</div>
		<div class="mb-6 flex gap-2">
			<InputField
				bind:value={match.draws}
				onchange={saveCtx.setDirty}
				type="number"
				placeholder="Antal draws"
				class="ml-auto w-1/3 min-w-0 shrink grow-0"
			/>
		</div>

		<Label label="Planerad">
			<DateInput bind:value={match.scheduledAt} oninput={saveCtx.setDirty} />
		</Label>
		<Label label="Spelad">
			<DateInput bind:value={match.playedAt} oninput={saveCtx.setDirty} disabled={!match.played} />
		</Label>
		<Label label="VOD">
			<InputField
				bind:value={match.vodUrl}
				onchange={saveCtx.setDirty}
				placeholder="https://youtube.com/..."
			/>
		</Label>
	{/if}
</Dialog>

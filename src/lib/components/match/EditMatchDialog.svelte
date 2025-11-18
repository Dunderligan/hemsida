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
	title="Redigera match"
	{open}
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
				bind:selectedId={match.rosterAId}
				disabled={!rosterCtx.canEditRosters}
				onValueChange={saveCtx.setDirty}
			/>
			<InputField
				class="w-1/4 min-w-0"
				bind:value={match.teamAScore}
				onchange={saveCtx.setDirty}
				type="number"
				placeholder="Poäng"
			/>
		</div>
		<div class="flex gap-2">
			<RosterSelect
				bind:selectedId={match.rosterBId}
				disabled={!rosterCtx.canEditRosters}
				onValueChange={saveCtx.setDirty}
			/>
			<InputField
				class="w-1/4 min-w-0"
				bind:value={match.teamBScore}
				onchange={saveCtx.setDirty}
				type="number"
				placeholder="Poäng"
			/>
		</div>

		<div class="mt-4 space-y-1">
			<Label label="Planerad">
				<DateInput bind:value={match.scheduledAt} oninput={saveCtx.setDirty} />
			</Label>
			<Label label="Spelad">
				<DateInput
					bind:value={match.playedAt}
					oninput={saveCtx.setDirty}
					disabled={!match.played}
				/>
			</Label>
			<Label label="VOD">
				<InputField
					bind:value={match.vodUrl}
					onchange={saveCtx.setDirty}
					placeholder="https://youtube.com/..."
				/>
			</Label>
		</div>
	{/if}
</Dialog>

<script lang="ts">
	import { RosterContext } from '$lib/state/rosters.svelte';
	import type { ClassValue } from '$lib/types';
	import Select from '../ui/Select.svelte';

	type Props = {
		selectedId?: string | null;
		disabled?: boolean;
		placeholder?: string;
		class?: ClassValue;
		onValueChange?: () => void;
	};

	let {
		selectedId = $bindable(),
		disabled,
		placeholder = 'Välj lag...',
		class: classProp,
		onValueChange
	}: Props = $props();

	const rosters = RosterContext.get();
</script>

<Select
	type="single"
	bind:value={selectedId as string | undefined}
	items={rosters.map
		.values()
		.map((roster) => ({
			label: roster.name,
			value: roster.id
		}))
		.toArray()}
	{disabled}
	{onValueChange}
	{placeholder}
	class={classProp}
/>

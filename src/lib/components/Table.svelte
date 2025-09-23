<script lang="ts" generics="T">
	import type { ClassValue } from 'svelte/elements';
	import Icon from './Icon.svelte';
	import type { Snippet } from 'svelte';

	type Column = {
		label: string;
		center?: boolean;
	};

	type Props = {
		columns: Column[];
		rows: T[];
		row: Snippet<[{ value: T }]>;
		class?: ClassValue;
	};

	let { columns, rows, row, class: classProp }: Props = $props();
</script>

<div class={[classProp, 'grid w-full gap-y-1 overflow-hidden rounded-lg']}>
	{#each columns as { label, center = false }}
		<div
			class={[
				center ? 'text-center ' : 'text-left',
				'mb-0.5 bg-gray-100 py-2 font-medium text-gray-700'
			]}
		>
			{label}
		</div>
	{/each}

	{#each rows as value}
		{@render row({ value })}
	{/each}
</div>

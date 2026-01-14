<script lang="ts" generics="T">
	import type { ClassValue } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	type Column = {
		label: string;
		center?: boolean;
		title?: string;
	};

	type Props = {
		columns: Column[];
		rows: T[];
		row: Snippet<[{ value: T; index: number }]>;
		key?: (value: T) => any;
		class?: ClassValue;
	};

	let { columns, rows, row, key, class: classProp }: Props = $props();
</script>

<div
	class={[
		classProp,
		'__table grid w-full gap-y-1 overflow-hidden overflow-x-auto rounded-lg text-gray-700 dark:text-gray-300'
	]}
>
	{#each columns as { label, center = false, title }, i}
		<div
			class={[
				center ? 'text-center ' : 'text-left',
				i === 0 && !center && 'pl-6',
				'__table-header mb-0.5 bg-gray-50 py-2 font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400'
			]}
			{...title ? { title, tabindex: 0, role: 'tooltip' } : {}}
		>
			{label}
		</div>
	{/each}

	{#each rows as value, index (key?.(value) ?? value)}
		{@render row({ value, index })}
	{/each}
</div>

<style>
	:global(.dark .__table > :not(.__table-header)) {
		background-color: var(--color-gray-900);
	}

	:global(.__table > :not(.__table-header)) {
		background-color: var(--color-gray-100);
	}
</style>

<script lang="ts" generics="T">
	import { Button } from 'bits-ui';
	import type { ClassValue } from 'svelte/elements';
	import Icon from './Icon.svelte';

	type Item = {
		label: string;
		value: T;
		icon?: string;
	} & ({ href: string; onclick?: never } | { href?: never; onclick: () => void });

	type Props = {
		items: Item[];
		selected?: T;
		class?: ClassValue;
	};

	let { items, selected = $bindable(items[0].value), class: classProp }: Props = $props();
</script>

<div class={[classProp, 'flex items-stretch overflow-hidden rounded-lg']}>
	{#each items as { label, value, icon, href, onclick } (value)}
		{@const isActive = selected === value}

		<Button.Root
			{href}
			{onclick}
			class={[
				'flex w-full items-center justify-center p-2',
				isActive
					? 'bg-accent-600 font-semibold text-white'
					: 'bg-accent-200 font-medium text-accent-800'
			]}
		>
			{#if icon}
				<Icon {icon} />
			{/if}

			{label}
		</Button.Root>
	{/each}
</div>

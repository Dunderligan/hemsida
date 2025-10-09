<script lang="ts">
	import { Button, type ButtonRootProps, type WithoutChildren } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	type Props = { icon?: string; kind?: 'primary' | 'secondary' | 'tertiary' | 'negative' } & (
		| { children: Snippet; label?: never; icon?: never }
		| {
				children?: never;
				label: string;
				icon?: string;
		  }
		| {
				children?: never;
				label?: never;
				icon: string;
		  }
	) &
		WithoutChildren<ButtonRootProps>;

	let { icon, children, label, class: classProp, kind = 'primary', ...props }: Props = $props();

	const typeClass = $derived(
		{
			primary: 'bg-accent-600 hover:bg-accent-700 font-semibold text-white',
			secondary: 'bg-gray-500 hover:bg-gray-600 font-semibold text-gray-200',
			tertiary: 'text-gray-700 hover:bg-gray-100',
			negative: 'bg-red-700 hover:bg-red-600 font-semibold text-red-100 hover:text-white'
		}[kind]
	);
</script>

<Button.Root
	class={[
		classProp,
		typeClass,
		icon && !label ? 'p-2' : 'px-4 py-2',
		'flex items-center justify-center gap-2 rounded-lg transition-colors'
	]}
	{...props}
>
	{#if children}
		{@render children()}
	{:else}
		{#if icon}
			<Icon {icon} class="text-lg" />
		{/if}

		{label}
	{/if}
</Button.Root>

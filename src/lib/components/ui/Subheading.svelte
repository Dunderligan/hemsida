<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
	};

	let { children }: Props = $props();
</script>

<h2 class="mb-4 font-display text-2xl font-bold text-gray-700">{@render children?.()}</h2>

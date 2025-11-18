<script lang="ts">
	import ConfirmDialog from '$lib/components/admin/ConfirmDialog.svelte';
	import PageSection from '$lib/components/structure/PageSection.svelte';
	import { ConfirmContext } from '$lib/state/confirm.svelte';

	let { children } = $props();

	ConfirmContext.set(new ConfirmContext());
</script>

<svelte:head>
	<title>Admin | Dunderligan</title>
</svelte:head>

<PageSection class="space-y-8">
	{@render children()}
</PageSection>

<ConfirmDialog />

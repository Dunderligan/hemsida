<script lang="ts">
	import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
	import PageSection from '$lib/components/PageSection.svelte';
	import SaveToast from '$lib/components/SaveToast.svelte';
	import { ConfirmContext } from '$lib/state/confirm.svelte';

	let { children } = $props();

	ConfirmContext.set(new ConfirmContext());
</script>

<PageSection class="space-y-8">
	{@render children()}
</PageSection>

<ConfirmDialog />

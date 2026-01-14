<script lang="ts">
	import { page } from '$app/state';
	import AdminLink from '$lib/components/admin/AdminLink.svelte';
	import Meta from '$lib/components/structure/Meta.svelte';
	import PageHeader from '$lib/components/structure/PageHeader.svelte';
	import PageSection from '$lib/components/structure/PageSection.svelte';
	import Subheading from '$lib/components/ui/Subheading.svelte';

	let { data } = $props();
</script>

<Meta title="Arkiv" description="Se tidigare säsonger av Dunderligan samt matcharkivet." />

<PageHeader title="Arkiv" subtitle="Bläddra genom säsonger av Dunderligan" />

<PageSection>
	<Subheading class="mb-4">Säsonger</Subheading>

	<div class="space-y-1 overflow-hidden rounded-lg">
		{#each data.seasons as { id, name, slug, startedAt } (id)}
			<AdminLink href="/stallningar/{slug}">
				<span>{name}</span>
				<span class="ml-2 text-base font-medium">{startedAt.getFullYear()}</span>
			</AdminLink>
		{/each}
	</div>

	<div class="mt-10 space-y-1 overflow-hidden rounded-lg">
		<AdminLink href="/arkiv/matcher?prev={page.url.pathname}">Matcher</AdminLink>
	</div>
</PageSection>

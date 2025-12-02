<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Match from '$lib/components/match/Match.svelte';
	import PageHeader from '$lib/components/structure/PageHeader.svelte';
	import PageSection from '$lib/components/structure/PageSection.svelte';

	let { data } = $props();

	function queryParamHref(param: string, value: any) {
		const url = new URL(page.url);
		url.searchParams.set(param, value);
		return url.href;
	}
</script>

<PageHeader>Matcher</PageHeader>

<PageSection>
	<div class="mb-4 flex max-w-xl items-center justify-between">
		<a href={queryParamHref('offset', Math.max(0, data.query.offset - data.query.limit))}
			>Föregående sida</a
		>
		<a href={queryParamHref('offset', data.query.offset + data.query.limit)}>Nästa sida</a>
	</div>

	<div class="max-w-xl space-y-1">
		{#each data.matches as { match, rosterA, rosterB, season } (match.id)}
			<Match seasonSlug={season?.slug ?? 'test-sasong'} match={{ ...match, rosterA, rosterB }} />
		{/each}
	</div>
</PageSection>

<script lang="ts">
	import PageSection from '$lib/components/PageSection.svelte';
</script>

<header class="h-[30rem] w-full">
	<div
		class="mx-auto flex h-full max-w-4xl items-center text-left font-display text-6xl font-black text-white"
	>
		<h1>
			Sveriges <span class="underline">största</span><br /> återkommande
			<br />Overwatchturnering
		</h1>
	</div>
</header>

<PageSection>hej</PageSection>

<style>
	:global(#background) {
		background-image: url('/hero.png') !important;
	}
</style>

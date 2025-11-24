<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Match from '$lib/components/match/Match.svelte';
	import PageSection from '$lib/components/structure/PageSection.svelte';
	import type { ResolvedMatchWithContext } from '$lib/types';
	import { cdnSrc } from '$lib/util';
	import Subheading from '$lib/components/ui/Subheading.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Dunderligan</title>
	<meta
		name="description"
		content="Välkommen till Dunderligan, Sveriges största återkommande Overwatchturnering!"
	/>

	<meta
		property="og:description"
		content="Välkommen till Dunderligan, Sveriges största återkommande Overwatchturnering!"
	/>
</svelte:head>

<header class="relative h-[50rem] w-full px-4 sm:h-[45rem]">
	<video
		src={cdnSrc('/dunderligan/trailer.mp4')}
		class="absolute top-0 left-0 -z-10 h-full w-full bg-accent-800 object-cover brightness-[0.45] transition-all duration-700"
		autoplay
		muted
		loop
		preload="auto"
	></video>

	<div
		class="hero-content mx-auto flex h-full max-w-4xl flex-col justify-center gap-6 pt-8 text-left font-display"
	>
		<h1 class="hero-title text-4xl font-extrabold text-white text-shadow-xs sm:text-6xl">
			Sveriges <span
				class="hero-highlight underline decoration-accent-400 decoration-4 underline-offset-4"
				>största</span
			><br /> återkommande
			<br />Overwatchturnering
		</h1>
		<p class="hero-subtitle text-white text-shadow-xs sm:text-lg">
			Varje år tävlar 36 lag från hela landet i Dunderligan.<br />Alla ranker och erfarenhetsnivåer
			välkomnas!
		</p>

		<Button
			icon="ph:arrow-right"
			class="hero-button max-w-max shadow-lg transition-transform hover:scale-105 active:scale-95"
			label="Se ställningar"
			href="/stallningar/test"
		/>
	</div>
</header>

<PageSection topMargin={false} class="space-y-10">
	{@render matchList('Kommande matcher', data.matches.upcoming)}
	{@render matchList('Senaste matcherna', data.matches.latest)}
</PageSection>

{#snippet matchList(title: string, matches: Promise<ResolvedMatchWithContext[]>)}
	<Subheading>{title}</Subheading>

	<div class="max-w-2xl space-y-2">
		{#await matches}
			{#each Array.from({ length: 3 }) as _, i}
				<div
					class="h-[140px] animate-pulse rounded-lg bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] sm:h-[80px]"
					style="animation-delay: {i * 0.1}s"
				></div>
			{/each}
		{:then matches}
			{#each matches as match (match.id)}
				{@const seasonSlug = match.division?.season.slug ?? match.group!.division.season.slug}

				<Match {seasonSlug} {match} />
			{/each}
		{/await}
	</div>
{/snippet}

<style>
	h1 {
		line-height: 110%;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes fadeInScale {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.hero-content :global(.hero-title) {
		animation: fadeInUp 0.8s ease-out 0.2s both;
	}

	.hero-content :global(.hero-subtitle) {
		animation: fadeInUp 0.8s ease-out 0.4s both;
	}

	.hero-content :global(.hero-button) {
		animation: fadeInUp 0.8s ease-out 0.6s both;
	}

	.hero-content :global(.hero-highlight) {
		animation: fadeInUp 0.8s ease-out 0.3s both;
		text-decoration-thickness: 4px;
	}

	.hero-content {
		animation: fadeInScale 0.8s ease-out;
	}
</style>

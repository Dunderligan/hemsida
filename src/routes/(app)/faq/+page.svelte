<script lang="ts">
	import Meta from '$lib/components/structure/Meta.svelte';
	import PageHeader from '$lib/components/structure/PageHeader.svelte';
	import PageSection from '$lib/components/structure/PageSection.svelte';

	import Subheading from '$lib/components/ui/Subheading.svelte';
	import Accordion from '$lib/components/ui/Accordions.svelte';

	const items = [
		{title: "Får man fuska?", content: "Nej, fusk är förbjudet."},
		{title: "Vilka får spela?", content: "Turneringen är endast för svenskar, och de från Åland."},
		{title: "Får man fuska?", content: "Nej, fusk är förbjudet."},
		{title: "Vilka får spela?", content: "Turneringen är endast för svenskar, och de från Åland."},		
		{title: "Får man fuska?", content: "Nej, fusk är förbjudet."},
		{title: "Vilka får spela?", content: "Turneringen är endast för svenskar, och de från Åland."},		
		{title: "Får man fuska?", content: "Nej, fusk är förbjudet."},
		{title: "Vilka får spela?", content: "Turneringen är endast för svenskar, och de från Åland."},		
		{title: "Får man fuska?", content: "Nej, fusk är förbjudet."},
		{title: "Vilka får spela?", content: "Turneringen är endast för svenskar, och de från Åland."},		
		{title: "Får man fuska?", content: "Nej, fusk är förbjudet."},
		{title: "Vilka får spela?", content: "Turneringen är endast för svenskar, och de från Åland."},
	];
</script>

<Meta title="FAQ" />

<PageHeader title="FAQ">
	<div
		class="mt-2 mb-1 text-center text-xl font-semibold text-gray-800 sm:text-left dark:text-gray-300"
	>
		Svar på några av de vanligast förekommande frågorna.
	</div>
</PageHeader>

<PageSection class="gap-2 text-lg font-medium">
	<Subheading class="mb-4">Vanliga Frågor</Subheading>
	<Accordion type="multiple" {items}></Accordion>
	<Subheading class="mt-8">Undrar du fortfarande något?</Subheading>
	Gå med i vår discordserver!
</PageSection>

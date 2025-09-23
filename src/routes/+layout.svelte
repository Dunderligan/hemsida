<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="relative flex min-h-screen flex-col overflow-hidden">
	<div
		class="absolute top-32 left-[-60rem] -z-10 size-[150rem] rounded-full bg-accent-400/10"
		id="splotch"
	></div>

	<Navbar />

	{@render children?.()}

	<Footer />
</div>

<style>
	:global(body) {
		min-height: 100lvh;
		background-image:
			linear-gradient(to bottom, transparent, rgba(255, 255, 255, 100) 100%), url('/striped-bg.png');
		background-size: contain;
		background-repeat: no-repeat;
	}

	#splotch {
		filter: blur(1000px);
	}
</style>

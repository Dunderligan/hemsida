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

<Navbar />

<div class="mx-auto w-full max-w-3xl pt-6">
	{@render children?.()}
</div>

<Footer />

<style>
	:global(body) {
		min-height: 100lvh;
		background-image:
			linear-gradient(to bottom, transparent, rgba(255, 255, 255, 100) 50%), url('/striped-bg.png');
		background-size: contain;
		background-repeat: no-repeat;
	}
</style>

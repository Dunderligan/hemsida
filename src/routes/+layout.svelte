<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import { ProgressBar } from '@prgm/sveltekit-progress-bar';
	import Footer from '$lib/components/structure/Footer.svelte';
	import Navbar from '$lib/components/structure/Navbar.svelte';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.toString()} />
</svelte:head>

<ProgressBar class="text-accent-500" zIndex={100} />

<Navbar dark={page.url.pathname === '/'} />

{@render children()}

<Footer />

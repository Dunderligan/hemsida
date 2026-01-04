<script lang="ts">
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.png';

	type Props = {
		title?: string;
		description?: string;
		ogImage?: string;
	};

	let {
		title,
		description = 'Välkommen till Dunderligan, Sveriges främsta Overwatchturnerning!',
		ogImage = favicon
	}: Props = $props();

	const fullTitle = $derived(title ? `${title} | Dunderligan` : 'Dunderligan');
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />

	<meta property="og:title" content={title ?? 'Dunderligan'} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={ogImage} />

	<meta property="og:type" content="website" />
	<meta property="og:url" content={page.url.toString()} />
	<meta property="og:domain" content={page.url.hostname} />
	<meta property="og:site_name" content="Dunderligan" />
</svelte:head>

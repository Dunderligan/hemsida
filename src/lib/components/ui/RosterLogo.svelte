<script lang="ts">
	import type { ClassValue } from '$lib/types';
	import { cdnImageSrc, cdnRosterLogoPath } from '$lib/util';

	type Props = {
		id: string;
		class?: ClassValue;
		imgSize?: number;
		src?: string | null;
	};

	let { id, class: classProp, imgSize = 64, src: srcOverride }: Props = $props();

	let element: HTMLImageElement;

	const src = $derived(srcOverride ?? cdnImageSrc(cdnRosterLogoPath(id), { width: imgSize }));

	function onerror() {
		element.src = '/placeholder-team.avif';
	}
</script>

<img
	{src}
	class={[classProp, 'shrink-0 rounded-[20%] object-contain']}
	{onerror}
	alt=""
	bind:this={element}
/>

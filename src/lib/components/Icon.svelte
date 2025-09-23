<script lang="ts">
	import 'iconify-icon';

	type Props = {
		icon: string;
		title?: string;
		class?: string;
	};

	let { icon, title, class: classProp }: Props = $props();
</script>

<iconify-icon {icon} class={classProp} inline {title}></iconify-icon>

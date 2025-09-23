<script lang="ts">
	import 'iconify-icon';

	type Props = {
		icon: string;
		class?: string;
	};

	let { icon, class: classProp }: Props = $props();
</script>

<iconify-icon {icon} class={classProp} inline></iconify-icon>

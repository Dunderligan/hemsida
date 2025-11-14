<script lang="ts">
	type Props = {
		class?: string;
		disabled?: boolean;
		value?: Date | null;
		oninput?: () => void;
	};

	let { class: classProp, disabled, value: date = $bindable(), oninput }: Props = $props();

	function toDatetimeLocal(date: Date) {
		// input type="datetime-local" requires a date string in the format "yyyy-MM-ddThh:mm"
		const pad = (n: number) => String(n).padStart(2, '0');

		return (
			date.getFullYear() +
			'-' +
			pad(date.getMonth() + 1) +
			'-' +
			pad(date.getDate()) +
			'T' +
			pad(date.getHours()) +
			':' +
			pad(date.getMinutes())
		);
	}
</script>

<input
	bind:value={
		() => (date ? toDatetimeLocal(date) : null),
		(newValue) => (date = newValue ? new Date(newValue) : null)
	}
	type="datetime-local"
	class={[
		classProp,
		'min-w-0 grow rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-800 placeholder-gray-400 transition-shadow duration-75 focus:ring-2 focus:ring-accent-600 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500'
	]}
	{oninput}
	{disabled}
/>

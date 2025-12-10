<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import Icon from '../ui/Icon.svelte';
	import Button from '../ui/Button.svelte';
	import { page } from '$app/state';
	import { invalidateAll } from '$app/navigation';
	import { logout } from '$lib/remote/auth.remote';

	type Props = {
		dark?: boolean;
	};

	let { dark }: Props = $props();

	const links = [
		{
			href: '/stallningar',
			label: 'Ställningar'
		},
		{
			href: '/arkiv',
			label: 'Arkiv'
		},
		{
			href: '/om',
			label: 'Om oss'
		}
	];

	const shownName = $derived.by(() => {
		const battletag = page.data.user?.battletag;
		if (!battletag) return null;
		return battletag.split('#')[0];
	});

	async function onLogout() {
		await logout();
		await invalidateAll();
	}
</script>

<nav
	class={[
		dark ? 'to-gray-900/30 text-gray-200' : 'to-gray-300/80 text-gray-800',
		'fixed z-30 h-18 w-screen bg-linear-to-t px-8 pt-4  backdrop-blur-[1px]'
	]}
>
	<div class="mx-auto flex h-full max-w-5xl items-center justify-between gap-2">
		<div class="flex items-center gap-12 font-display">
			<a href="/" class="mr-8">
				<img src="/logo.png" alt="Dunderligan" class="size-12" />
			</a>

			{#each links as { href, label } (href)}
				<a class="hidden font-medium hover:underline sm:block" {href}>{label}</a>
			{/each}
		</div>

		<div class="flex items-center gap-6">
			{#if page.data.user}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class={[dark ? 'text-gray-200' : 'text-gray-800', 'font-display font-medium']}
					>
						{shownName}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="floating" avoidCollisions={false}>
						{#if page.data.user.isAdmin}
							<DropdownMenu.Item class="floating-item">
								<a href="/admin" class="grow"> Admin </a>
							</DropdownMenu.Item>
						{/if}

						<DropdownMenu.Item class="floating-item gap-2" onclick={onLogout}>
							Logga ut
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{:else}
				<Button href="/api/login/battlenet" kind="tertiary" label="Logga in" />
			{/if}

			<DropdownMenu.Root>
				<DropdownMenu.Trigger class="sm:hidden">
					<Icon icon="ph:list" class="text-2xl" />
				</DropdownMenu.Trigger>
				<DropdownMenu.Content
					class="z-50 flex w-lvw flex-col items-stretch gap-1 bg-white py-6 shadow-lg"
					avoidCollisions={false}
				>
					{#each links as { href, label } (href)}
						<DropdownMenu.Item>
							<a
								class="block px-8 py-2 text-xl font-semibold text-gray-800 hover:bg-gray-100 hover:text-accent-600 hover:underline"
								{href}>{label}</a
							>
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>
</nav>

<script lang="ts">
	import { authClient, isAdmin } from '$lib/auth-client';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Match from '$lib/components/Match.svelte';
	import Table from '$lib/components/Table.svelte';
	import Tabs from '$lib/components/Tabs.svelte';
	import {
		averageRank,
		capitalize,
		cdnImageSrc,
		sortRole as compareRole,
		flattenGroup,
		roleIcon
	} from '$lib/util';

	const session = authClient.useSession();

	let { data } = $props();

	let { team, roster } = $derived(data);
	let { group, division, season } = $derived(flattenGroup(roster.group));

	let sortedMembers = $derived(roster.members.toSorted((a, b) => compareRole(a.role, b.role)));
	let average = $derived(averageRank(roster.members));

	const rosterTabItems = $derived(
		team.rosters.map((roster) => {
			const { season, division } = flattenGroup(roster.group);

			return {
				label: `${season.name} ${division.name}`,
				value: roster.id,
				href: `/lag/${season.slug}/${roster.slug}`
			};
		})
	);
</script>

<header class="mx-auto flex w-full max-w-4xl items-center gap-6">
	<img src={cdnImageSrc(`/logos/${roster.id}.png`, { width: 512 })} alt="" class="size-40" />

	<div>
		<h1 class="mb-1 font-display text-6xl font-extrabold text-black">{roster.name}</h1>
		<div class="flex items-center gap-3">
			{#each team.socials as { platform, url } (platform)}
				<a href={url}><Icon class="gap-2 text-4xl text-accent-600" icon="mdi:{platform}" /></a>
			{/each}
		</div>
	</div>
</header>

<main class="relative z-10 mt-12 grow bg-white px-4 py-12 shadow-2xl">
	<div class="mx-auto flex max-w-4xl gap-10">
		<section class="grow">
			{#if rosterTabItems.length > 1}
				<div class="mb-6 flex items-center gap-6">
					<h3 class="text-xl font-semibold text-gray-700">Rosters</h3>

					<Tabs class="grow" items={rosterTabItems} />
				</div>
			{:else}
				<div class="mb-4 text-lg font-medium text-gray-700">
					Spelade i <a
						href="/sasong/{season.slug}?div={division.slug}&grupp={group.slug}"
						class="font-bold text-accent-600 hover:text-accent-700 hover:underline"
						>{season.name}, {division.name}</a
					>.
				</div>
			{/if}

			<Table
				columns={[
					{
						label: 'Roll',
						center: true
					},
					{
						label: 'Battletag'
					},
					{ label: 'Rank' }
				]}
				rows={sortedMembers}
				class="grid-cols-[70px_1fr_170px]"
			>
				{#snippet row({ value: member })}
					<div class="bg-gray-200 py-3.5 text-center text-xl text-gray-800">
						<Icon icon={roleIcon(member.role)} title={capitalize(member.role)} />
					</div>
					<div class="flex items-center bg-gray-200 text-lg font-semibold">
						{member.player.battletag}

						{#if member.isCaptain}
							<Icon icon="mdi:crown" class="mb-0.5 ml-2 text-gray-800" title="Lagkapten" />
						{/if}
					</div>
					<div class="flex items-center bg-gray-200 text-lg font-medium">
						<img src="/rank/{member.rank}.webp" alt="" class="mr-2 inline size-6" />
						{capitalize(member.rank)}
						{member.tier}
					</div>
				{/snippet}
			</Table>

			<h2 class="mt-8 mb-4 font-display text-2xl font-bold text-gray-700">Senaste matcher</h2>

			<div class="space-y-2">
				{#each roster.matches as match (match.id)}
					<Match {match} />
				{/each}
			</div>
		</section>

		<section class="w-1/4 shrink-0">
			{#if isAdmin($session.data?.user)}
				<Button href="/admin/roster/{roster.id}" kind="secondary" class="mb-4">
					<Icon icon="mdi:pencil" />
					Redigera lag
				</Button>
			{/if}

			<div>
				<div class="font-medium text-gray-700">Genomsnittlig rank</div>
				<div class="text-xl font-semibold text-gray-800">
					<img src="/rank/{average.rank}.webp" alt="" class="mr-1 inline size-6" />
					{capitalize(average.rank)}
					{average.tier}
				</div>
			</div>
		</section>
	</div>
</main>

<script lang="ts">
	import { averageRank } from '$lib/util';

	let { data } = $props();

	let { team, roster } = $derived(data);
	let { group } = $derived(roster);
	let { division } = $derived(group);
	let { season } = $derived(division);

	let average = $derived(averageRank(roster.members));

	console.log(data);
</script>

<h1 class="text-2xl font-bold">{roster.name}</h1>

<div>
	Spelade i <a href="/sasong/{season.slug}?div={division.slug}&grupp={group.slug}"
		>{division.name} {season.name}</a
	>
</div>

<div>
	{#each team.socials as social}
		<div>
			<a href={social.url}>{social.platform}</a>
		</div>
	{/each}
</div>

<div>
	{#each roster.members as member}
		<div>
			({member.role}) {member.player?.battletag}
			{member.rank}
			{member.tier}
			{#if member.isCaptain}
				- Kapten
			{/if}
		</div>
	{/each}
</div>

<div>
	Genomsnittlig rank: {average.rank}
	{average.tier}
</div>

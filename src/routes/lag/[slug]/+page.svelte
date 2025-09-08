<script lang="ts">
	import { averageRank } from '$lib/util';

	let { data } = $props();

	let team = $derived(data.team);
	let roster = $derived(team.rosters[0]);
	let average = $derived(averageRank(roster.members));
</script>

<h1 class="text-2xl font-bold">{roster.name}</h1>

<div>
	Spelade i {roster.group.division.name} säsong {roster.group.division.season.name}
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

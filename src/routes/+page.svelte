<script lang="ts">
	import Wave from '$lib/components/Wave.svelte';

	let { data } = $props();
</script>

<!-- <Wave /> -->

<div>
	{#each data.teams as team (team.id)}
		<div>
			{team.slug}
			<div class="ml-4">
				{#each team.rosters as roster (roster.id)}
					<div>
						{roster.name} ({roster.members.length} players)
						<div class="ml-4">
							{#each roster.members as member}
								<div>({member.role}) {member.player?.battletag} {member.rank} {member.tier}</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

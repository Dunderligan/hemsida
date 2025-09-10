import { SocialPlatform, type FullRank, type NestedGroup, type Rank, type Role } from './types';

const rankNums: Record<Rank, number> = {
	bronze: 0,
	silver: 1,
	gold: 2,
	platinum: 3,
	diamond: 4,
	master: 5,
	grandmaster: 6,
	champion: 7
};

export function averageRank(ranks: FullRank[]): FullRank {
	// convert the ranks to decimal numbers using the record above
	const rankNumbers = ranks
		.map((fullRank) => rankNums[fullRank.rank] + (fullRank.tier - 1) / 5)
		.reduce((a, b) => a + b, 0);

	const average = rankNumbers / ranks.length;
	const rank = Object.entries(rankNums)
		.reverse()
		.find(([_, num]) => num <= average) ?? ['bronze', 0];
	const tier = Math.round((average - (rank[1] ?? 0)) * 5) + 1;

	return { rank: rank[0] as Rank, tier };
}

const roleNums: Record<Role, number> = {
	tank: 0,
	damage: 1,
	support: 2
};

export function sortRole(a: Role, b: Role) {
	return roleNums[a] - roleNums[b];
}

export function formatSocialPlatform(platform: SocialPlatform) {
	switch (platform) {
		case SocialPlatform.TWITTER:
			return 'Twitter';
		case SocialPlatform.YOUTUBE:
			return 'Youtube';
	}
}

export function flattenGroup(group: NestedGroup) {
	return {
		group: {
			name: group.name,
			slug: group.slug
		},
		division: {
			name: group.division.name,
			slug: group.division.slug
		},
		season: {
			name: group.division.season.name,
			slug: group.division.season.slug
		}
	};
}

import type { Rank } from './server/db/schema';

const rankNums = {
	bronze: 0,
	silver: 1,
	gold: 2,
	platinum: 3,
	diamond: 4,
	master: 5,
	grandmaster: 6,
	champion: 7
};

export type FullRank = {
	rank: Rank;
	tier: number;
};

export function averageRank(ranks: FullRank[]): FullRank {
	const nums = ranks.map((m) => rankNums[m.rank] + m.tier / 5 - 1).reduce((a, b) => a + b, 0);

	const avg = nums / ranks.length;
	const rank = Object.entries(rankNums)
		.reverse()
		.find(([_, n]) => n <= avg) ?? ['bronze', 0];
	const tier = Math.round((avg - (rank[1] ?? 0)) * 5) + 1;

	return { rank: rank[0] as Rank, tier };
}

import slugify from 'slugify';
import {
	SocialPlatform,
	type FullRank,
	type NestedGroup,
	type Rank,
	type Role,
	type FullMatch
} from './types';
// import { PUBLIC_CDN_ENDPOINT } from '$env/static/public';

const PUBLIC_CDN_ENDPOINT = 'https://cdn.dunderligan.se';

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
	let total = 0;

	for (const rank of ranks) {
		total += rankNums[rank.rank] * 5 + (5 - rank.tier);
	}

	const avg = Math.round(total / ranks.length);

	const rankNum = Math.floor(avg / 5);
	const rank = Object.keys(rankNums).find((key) => rankNums[key as Rank] === rankNum) as Rank;
	const tier = 5 - (avg % 5);

	return {
		rank,
		tier
	};
}

const roleNums: Record<Role, number> = {
	tank: 0,
	damage: 1,
	support: 2,
	flex: 3,
	coach: 4
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

export function flattenGroup<S, D, G>(nestedGroup: NestedGroup<S, D, G>) {
	const { division: nestedDivision, ...group } = nestedGroup;
	const { season, ...division } = nestedDivision;

	return { season, division, group };
}

export function toSlug(str: string) {
	return slugify(str, {
		lower: true,
		locale: 'sv-SE'
	});
}

export type TableScore = {
	mapWins: number;
	mapLosses: number;
	mapDraws: number;
	matchesPlayed: number;
};

type ExtraTableInfo = {
	wonAgainst: Set<string>;
	lostAgainst: Set<string>;
};

export type MatchWithoutIds = Omit<FullMatch, 'id' | 'groupId' | 'divisionId' | 'played' | 'order'>;

export function calculateStandings<R extends { id: string }>(
	rosters: R[],
	matches: MatchWithoutIds[]
): {
	rosterId: string;
	score: TableScore;
}[] {
	const rosterScores = new Map<string, TableScore & ExtraTableInfo>();

	for (const roster of rosters) {
		rosterScores.set(roster.id, {
			mapWins: 0,
			mapLosses: 0,
			mapDraws: 0,
			matchesPlayed: 0,
			wonAgainst: new Set(),
			lostAgainst: new Set()
		});
	}

	for (const match of matches) {
		if (!match.rosterAId || !match.rosterBId) continue;

		const teamA = rosterScores.get(match.rosterAId);
		const teamB = rosterScores.get(match.rosterBId);

		if (!teamA || !teamB) {
			console.warn('Roster not found in group', match);
			continue;
		}

		let teamAScore = match.teamAScore ?? 0;
		let teamBScore = match.teamBScore ?? 0;
		let draws = match.draws ?? 0;

		if (teamAScore > teamBScore) {
			teamA.wonAgainst.add(match.rosterBId);
			teamB.lostAgainst.add(match.rosterAId);
		} else if (teamBScore > teamAScore) {
			teamB.wonAgainst.add(match.rosterAId);
			teamA.lostAgainst.add(match.rosterBId);
		}

		teamA.mapWins += teamAScore;
		teamA.mapLosses += teamBScore;
		teamA.mapDraws += draws;

		teamB.mapWins += teamBScore;
		teamB.mapLosses += teamAScore;
		teamB.mapDraws += draws;

		teamA.matchesPlayed += 1;
		teamB.matchesPlayed += 1;
	}

	const sortedScores = [...rosterScores]
		.sort((a, b) => compareSeed(a[1], b[1]))
		.map(([rosterId, { wonAgainst, lostAgainst, ...score }]) => ({
			rosterId,
			score
		}));

	return sortedScores;
}

function compareSeed(a: TableScore & ExtraTableInfo, b: TableScore & ExtraTableInfo): number {
	return (
		b.mapWins - a.mapWins || a.mapLosses - b.mapLosses || b.wonAgainst.size - a.wonAgainst.size
	);
}

export function sortBySeed<R extends { id: string }>(rosters: R[], matches: MatchWithoutIds[]) {
	const seeds = new Map(
		calculateStandings(rosters, matches).map((row, seed) => [row.rosterId, seed])
	);

	rosters.sort((a, b) => seeds.get(a.id)! - seeds.get(b.id)!);
}

export function buildBracket<T extends { id: string; nextMatchId?: string | null }>(matches: T[]) {
	const finalMatch = matches.find((match) => !match.nextMatchId);

	if (!finalMatch) {
		console.warn('No final match found!');
		return [];
	}

	const rounds: T[][] = [];
	let currentRound = [finalMatch];

	while (currentRound.length > 0) {
		rounds.unshift(currentRound);

		const nextRoundIds = new Set(currentRound.map((match) => match.id));
		const prevRound = matches.filter(
			(match) => match.nextMatchId && nextRoundIds.has(match.nextMatchId)
		);

		currentRound = prevRound;
	}

	return rounds;
}

export function cdnSrc(path: string) {
	return `${PUBLIC_CDN_ENDPOINT}${path}`;
}

export function cdnImageSrc(path: string, { width, height }: { width: number; height?: number }) {
	let filters = `format=auto,fit=scale-down,width=${width}`;
	if (height) {
		filters += `,height=${height}`;
	}

	return `${PUBLIC_CDN_ENDPOINT}/cdn-cgi/image/${filters}${path}`;
}

export function capitalize(str: string) {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function roleIcon(role: Role): string {
	switch (role) {
		case 'tank':
			return 'ph:shield';
		case 'damage':
			return 'ph:sword';
		case 'support':
			return 'ph:bandaids';
		case 'flex':
			return 'ph:star';
		case 'coach':
			return 'ph:suitcase';
	}

	return 'ph:question-mark';
}

export function aggregateGroups<R, M>(groups: { rosters: R[]; matches: M[] }[]) {
	return {
		rosters: groups.flatMap((group) => group.rosters),
		matches: groups.flatMap((group) => group.matches)
	};
}

export function mapEmptyToUndefined(str: string) {
	if (str.length === 0) return undefined;
	return str;
}

export function enumToPgEnum<T extends Record<string, any>>(
	myEnum: T
): [T[keyof T], ...T[keyof T][]] {
	return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

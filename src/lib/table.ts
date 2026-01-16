import { hasMatchScore } from './match';
import { type LogicalMatch } from './types';

/**
 * The score of a team in the standings table.
 */
export type TableScore = {
	mapWins: number;
	mapLosses: number;
	mapDraws: number;
	matchesPlayed: number;
};

/**
 * Additional per-team data used during the calculation of standings (particularly tiebreakers).
 */
type ExtraTableInfo = {
	wonAgainst: Set<string>;
	lostAgainst: Set<string>;
	resigned?: boolean;
};

/**
 * Calculates scores and standings for a list of rosters, according to the scores of the given matches
 * and the tournament's (current) tiebreakers.
 *
 * The result is sorted from highest to lowest seed (as usually displayed in a table).
 * Resigned rosters are placed at the bottom of the table (that is last in the result).
 */
export function calculateStandings<R extends { id: string; resigned?: boolean }>(
	rosters: R[],
	matches: LogicalMatch[]
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
			lostAgainst: new Set(),
			resigned: roster.resigned
		});
	}

	for (const match of matches) {
		if (!hasMatchScore(match) || !match.rosterAId || !match.rosterBId) continue;

		const teamA = rosterScores.get(match.rosterAId);
		const teamB = rosterScores.get(match.rosterBId);

		if (!teamA || !teamB) {
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

	// sort them highest to lowest seed
	const sortedScores = [...rosterScores].sort((a, b) => compareSeed(a[1], b[1]));

	// if there's still ties, break them by:
	// - whoever won a match against the higher seeded opponent
	// - whoever lost a match against the lower seeded opponent
	for (let i = 0; i < sortedScores.length - 1; i++) {
		// iterate by pairs, from top to bottom
		const [_rosterAId, rosterAScore] = sortedScores[i];
		const [_rosterBId, rosterBScore] = sortedScores[i + 1];

		// check if we did resolve the tie using the standard tiebreakers
		if (compareSeed(rosterAScore, rosterBScore) !== 0) {
			continue;
		}

		const [highestBeatenA, lowestLostToA] = highestAndLowestLostTo(rosterAScore, sortedScores);
		const [highestBeatenB, lowestLostToB] = highestAndLowestLostTo(rosterBScore, sortedScores);

		// keep in mind that a lower seed is better (i.e. index 0 is highest seed)
		const aShouldBeHigher =
			(highestBeatenA !== null && highestBeatenB !== null && highestBeatenB - highestBeatenA) || // a beat a higher seed
			(lowestLostToA !== null && lowestLostToB !== null && lowestLostToA - lowestLostToB) || // a lost to a lower seed
			0; // still tied :/

		if (aShouldBeHigher > 0) {
			// already correct, do nothing
		} else if (aShouldBeHigher < 0) {
			// swap
			[sortedScores[i], sortedScores[i + 1]] = [sortedScores[i + 1], sortedScores[i]];
		}
	}

	// filter out our extra info out of the result
	const result = sortedScores.map(([rosterId, { wonAgainst, lostAgainst, ...score }]) => ({
		rosterId,
		score
	}));

	return result;
}

/** Decides whether a should be seeded higher than b. */
function compareSeed(a: TableScore & ExtraTableInfo, b: TableScore & ExtraTableInfo): number {
	// put resigned teams at the bottom
	if (a.resigned && !b.resigned) return 1;
	if (!a.resigned && b.resigned) return -1;

	// tiebreakers in order:
	// - most map wins
	// - least map losses
	// - most matches won

	return (
		b.mapWins - a.mapWins || a.mapLosses - b.mapLosses || b.wonAgainst.size - a.wonAgainst.size
	);
}

/** Returns the indicies of the highest beaten and lowest lost to opponents of a roster. */
function highestAndLowestLostTo(
	score: TableScore & ExtraTableInfo,
	sortedScores: [string, TableScore & ExtraTableInfo][]
): [number | null, number | null] {
	let highestBeaten: number | null = null;
	let lowestLostTo: number | null = null;

	for (let i = 0; i < sortedScores.length; i++) {
		const [rosterId, _] = sortedScores[i];

		if (score.wonAgainst.has(rosterId) && highestBeaten === null) {
			highestBeaten = i;
		}
		if (score.lostAgainst.has(rosterId)) {
			lowestLostTo = i;
		}
	}

	return [highestBeaten, lowestLostTo];
}

/** Sorts rosters in-place according to their seed, as calculated by the calculateStandings function. */
export function sortBySeed<R extends { id: string }>(rosters: R[], matches: LogicalMatch[]) {
	const seeds = new Map(
		calculateStandings(rosters, matches).map((row, seed) => [row.rosterId, seed])
	);

	rosters.sort((a, b) => seeds.get(a.id)! - seeds.get(b.id)!);
}

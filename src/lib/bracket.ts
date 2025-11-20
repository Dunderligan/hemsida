import { v4 as uuidv4 } from 'uuid';
import { sortBySeed, type MatchWithoutIds } from './util';
import type { schema } from './server/db';
import type { FullMatch } from './types';

export function createBracket<R extends { id: string }, M extends MatchWithoutIds>(
	rosters: R[],
	groupMatches: M[]
): FullMatch[][] {
	if (rosters.length < 2) {
		return [];
	}

	const numberOfRounds = Math.ceil(Math.log2(rosters.length));
	const emptySlots = Math.pow(numberOfRounds, 2) - rosters.length;

	const rounds = [];
	let order = 0;

	// create the final match
	rounds.push([createMatch(order++)]);

	// create matches in reverse order
	for (let i = 1; i < numberOfRounds; i++) {
		const round = [];

		for (const nextMatch of rounds[i - 1]) {
			const matchA = createMatch(order++, nextMatch.id);
			const matchB = createMatch(order++, nextMatch.id);

			round.push(matchA);
			round.push(matchB);
		}

		rounds.push(round);
	}

	const firstRound = rounds[rounds.length - 1];

	sortBySeed(rosters, groupMatches);

	const halfpoint = Math.ceil(rosters.length / 2);
	const topRosters = rosters.slice(0, halfpoint);
	const bottomRosters = rosters.slice(halfpoint);

	// populate first round with teams
	for (let i = 0; i < firstRound.length; i++) {
		const match = firstRound[i];

		const roster = topRosters.shift()!;
		match.rosterAId = roster.id;

		if (i >= emptySlots - 1) {
			match.rosterBId = bottomRosters.pop()!.id;
		} else {
			// other slot is empty; automatically promote team
			match.teamAScore = 3;
			match.played = true;

			const nextRound = rounds[rounds.length - 2];
			const nextMatch = nextRound[Math.floor(i / 2)];

			if (nextMatch.rosterAId) {
				nextMatch.rosterBId = roster.id;
			} else {
				nextMatch.rosterAId = roster.id;
			}
		}
	}

	rounds.reverse();

	return rounds;
}

function createMatch(order: number, nextMatchId?: string): FullMatch {
	return {
		id: uuidv4(),
		nextMatchId,
		order,
		played: false
	};
}

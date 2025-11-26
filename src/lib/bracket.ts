import { v4 as uuidv4 } from 'uuid';
import { sortBySeed, type MatchWithoutIds } from './util';
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

	sortBySeed(rosters, groupMatches);

	const matchOrder = getMatchOrder(numberOfRounds);

	const firstRound = rounds[rounds.length - 1];

	for (const matchIndex of matchOrder) {
		const match = firstRound[matchIndex];

		const rosterA = rosters.shift()!;
		match.rosterAId = rosterA.id;

		// find the last in rosters that is compatible
		for (let i = rosters.length - 1; i >= 0; i--) {
			const otherRoster = rosters[i];
			console.log(otherRoster);
			if (groupMatches.some((match) => isMatchBetween(match, rosterA.id, otherRoster.id))) {
				console.log('these have played:', rosterA, otherRoster);
				continue;
			}

			const [rosterB] = rosters.splice(i, 1);
			match.rosterBId = rosterB.id;
			break;
		}
	}

	rounds.reverse();

	return rounds;
}

function isMatchBetween(match: MatchWithoutIds, aId: string, bId: string): boolean {
	return (
		(match.rosterAId == aId && match.rosterBId == bId) ||
		(match.rosterAId == bId && match.rosterBId == aId)
	);
}

function getMatchOrder(rounds: number): number[] {
	let layer = [0];
	for (let i = 0; i < rounds - 1; i++) {
		layer = nextLayer(layer);
	}
	const indexOrder = layer
		.map((x, i) => [x, i])
		.sort((a, b) => a[0] - b[0])
		.map((a) => a[1]);
	return indexOrder;

	function nextLayer(lastLayer: number[]): number[] {
		const nextLayer: number[] = [];
		const newLength = lastLayer.length * 2 - 1;
		for (const item of lastLayer) {
			nextLayer.push(item);
			nextLayer.push(newLength - item);
		}
		return nextLayer;
	}
}

function createMatch(order: number, nextMatchId?: string): FullMatch {
	return {
		id: uuidv4(),
		nextMatchId,
		order,
		played: false
	};
}

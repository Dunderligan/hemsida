import type { LogicalMatch } from './types';

/** Check if a match is played between two rosters */
export function isMatchBetween(match: LogicalMatch, aId: string, bId: string): boolean {
	return isInMatch(match, aId) && isInMatch(match, bId);
}

export function isInMatch(match: LogicalMatch, rosterId: string): boolean {
	return match.rosterAId === rosterId || match.rosterBId === rosterId;
}

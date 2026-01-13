import z from 'zod';
import { MatchState } from './types';

export const matchSchema = z.object({
	id: z.uuid(),
	rosterAId: z.string().nullish(),
	rosterBId: z.string().nullish(),
	teamAScore: z.int(),
	teamBScore: z.int(),
	draws: z.int(),
	teamANote: z.string().nullish(),
	teamBNote: z.string().nullish(),
	state: z.enum(MatchState),
	vodUrl: z.url().nullish(),
	scheduledAt: z.date().nullish(),
	playedAt: z.date().nullish()
});

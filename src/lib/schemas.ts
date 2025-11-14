import * as z from 'zod';

export const matchSchema = z.object({
	id: z.uuid(),
	rosterAId: z.string().nullable().optional(),
	rosterBId: z.string().nullable().optional(),
	teamAScore: z.int().nullable().optional(),
	teamBScore: z.int().nullable().optional(),
	draws: z.int().nullable().optional(),
	played: z.boolean(),
	vodUrl: z.url().nullable().optional(),
	scheduledAt: z.date().nullable().optional(),
	playedAt: z.date().nullable().optional()
});

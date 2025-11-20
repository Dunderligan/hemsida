import { command } from '$app/server';
import { db, schema } from '$lib/server/db';
import { toSlug } from '$lib/util';
import { eq } from 'drizzle-orm';
import * as z from 'zod';
import { matchSchema } from '$lib/schemas';
import { adminGuard } from './auth.remote';
import { createBracket } from '$lib/bracket';

export const createDivision = command(
	z.object({
		name: z.string(),
		seasonId: z.uuidv4()
	}),
	async ({ name, seasonId }) => {
		await adminGuard();

		const slug = toSlug(name.split(' ').at(-1) ?? name);

		const [division] = await db
			.insert(schema.division)
			.values({
				name,
				seasonId,
				slug
			})
			.returning();

		return { division };
	}
);

export const updateDivision = command(
	z.object({
		id: z.uuid(),
		name: z.string().nonempty(),
		bracketMatches: z.array(matchSchema)
	}),
	async ({ id, name, bracketMatches }) => {
		await adminGuard();

		await db.transaction(async (tx) => {
			const slug = toSlug(name.split(' ').at(-1) ?? name);

			await tx.update(schema.division).set({ slug, name }).where(eq(schema.division.id, id));

			await Promise.all(
				bracketMatches.map((match) => {
					return tx.update(schema.match).set(match).where(eq(schema.match.id, match.id));
				})
			);
		});
	}
);

export const deleteDivision = command(
	z.object({
		id: z.uuidv4()
	}),
	async ({ id }) => {
		await adminGuard();

		await db.delete(schema.division).where(eq(schema.division.id, id));
	}
);

export const generateBracket = command(
	z.object({
		divisionId: z.uuid()
	}),
	async ({ divisionId }) => {
		await adminGuard();

		const { rosters, groupMatches } = await aggregateGroups(divisionId);

		const rounds = createBracket(rosters, groupMatches);

		const matches = rounds.flatMap((round) =>
			round.map((match) => ({
				divisionId,
				...match
			}))
		);
		await db.insert(schema.match).values(matches);

		return { rounds };
	}
);

async function aggregateGroups(divisionId: string) {
	const data = await db.query.group.findMany({
		where: eq(schema.group.divisionId, divisionId),
		columns: {},
		with: {
			rosters: {
				columns: {
					id: true
				}
			},
			matches: {
				columns: {
					id: true,
					rosterAId: true,
					rosterBId: true,
					teamAScore: true,
					teamBScore: true,
					draws: true
				}
			}
		}
	});

	return {
		rosters: data.flatMap((group) => group.rosters),
		groupMatches: data.flatMap((group) => group.matches)
	};
}

export const deleteBracket = command(
	z.object({
		divisionId: z.uuid()
	}),
	async ({ divisionId }) => {
		await adminGuard();

		await db.delete(schema.match).where(eq(schema.match.divisionId, divisionId));
	}
);

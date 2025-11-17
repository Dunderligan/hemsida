import { db, schema } from '$lib/server/db';
import { asc, desc, eq, SQL } from 'drizzle-orm';

const getMatches = async (played: boolean, orderBy: SQL) => {
	return await db.query.match.findMany({
		limit: 3,
		orderBy,
		where: eq(schema.match.played, played),
		columns: {
			id: true,
			teamAScore: true,
			teamBScore: true,
			draws: true,
			played: true,
			playedAt: true,
			scheduledAt: true
		},
		with: {
			rosterA: {
				columns: {
					id: true,
					name: true,
					slug: true,
					seasonSlug: true
				}
			},
			rosterB: {
				columns: {
					id: true,
					name: true,
					slug: true,
					seasonSlug: true
				}
			}
		}
	});
};

export const load = async () => {
	return {
		matches: {
			upcoming: getMatches(false, desc(schema.match.scheduledAt)),
			latest: getMatches(true, asc(schema.match.playedAt))
		}
	};
};

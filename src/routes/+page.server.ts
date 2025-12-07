import { db } from '$lib/server/db';
import { matchRosterQuery, nestedDivisionQuery, nestedGroupQuery } from '$lib/server/db/helpers';
import { type OrderBy } from 'drizzle-orm';

const getMatches = async ({ played, orderBy }: { played: boolean; orderBy: OrderBy }) => {
	return await db.query.match.findMany({
		limit: 3,
		orderBy,
		where: {
			played,
			rosterAId: {
				isNotNull: true
			},
			rosterBId: {
				isNotNull: true
			}
		},
		columns: {
			id: true,
			teamAScore: true,
			teamBScore: true,
			draws: true,
			played: true,
			playedAt: true,
			scheduledAt: true,
			vodUrl: true
		},
		with: {
			group: nestedGroupQuery,
			division: nestedDivisionQuery,
			rosterA: matchRosterQuery,
			rosterB: matchRosterQuery
		}
	});
};

export const load = async () => {
	return {
		matches: {
			upcoming: getMatches({ played: false, orderBy: { scheduledAt: 'asc' } }),
			latest: getMatches({ played: true, orderBy: { scheduledAt: 'desc' } })
		}
	};
};

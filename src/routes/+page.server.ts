import { db, schema } from '$lib/server/db';
import { matchRosterQuery, nestedDivisionQuery, nestedGroupQuery } from '$lib/server/db/helpers';
import { and, asc, desc, eq, isNull, not, SQL } from 'drizzle-orm';

const getMatches = async ({ played, orderBy }: { played: boolean; orderBy: SQL }) => {
	return await db.query.match.findMany({
		limit: 3,
		orderBy,
		where: and(
			eq(schema.match.played, played),
			not(isNull(schema.match.rosterAId)),
			not(isNull(schema.match.rosterBId))
		),
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
			upcoming: getMatches({ played: false, orderBy: asc(schema.match.scheduledAt) }),
			latest: getMatches({ played: true, orderBy: desc(schema.match.playedAt) })
		}
	};
};

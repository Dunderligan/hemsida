import { db } from '$lib/server/db';
import { leagueQuery } from '$lib/server/db/helpers';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	const rosters = await db.query.season.findMany({
		columns: {
			...leagueQuery.columns,
			legacyRanks: true
		},
		orderBy: {
			createdAt: 'desc'
		},
		with: {
			divisions: {
				...leagueQuery,
				with: {
					groups: {
						...leagueQuery,
						with: {
							rosters: leagueQuery
						}
					}
				}
			}
		}
	});

	const response = {
		results: rosters
	};

	return json(response);
};

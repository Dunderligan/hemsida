import { db } from '$lib/server/db.js';

export const load = async ({ url }) => {
	const available = await db.query.season.findMany({
		columns: {
			id: true,
			name: true
		},
		with: {
			divisions: {
				columns: {
					id: true,
					name: true
				},
				with: {
					groups: {
						columns: {
							id: true,
							name: true
						},
						with: {
							rosters: {
								columns: {
									id: true,
									name: true
								}
							}
						}
					}
				}
			}
		}
	});

	const playedParam = url.searchParams.get('spelad');

	const query = {
		rosterId: url.searchParams.get('rosters') ?? undefined,
		seasonId: url.searchParams.get('sasong') ?? undefined,
		divisionId: url.searchParams.get('division') ?? undefined,
		groupId: url.searchParams.get('grupp') ?? undefined,
		played: playedParam === null ? undefined : playedParam === 'true',
		page: Number(url.searchParams.get('sida') ?? 0)
	};

	return { query, available, pageSize: 10 };
};

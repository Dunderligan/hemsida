import { db } from '$lib/server/db';

export const load = async () => {
	const teams = await db.query.team.findMany({
		with: {
			rosters: {
				with: {
					members: {
						with: {
							player: true
						}
					}
				}
			}
		}
	});

	return { teams };
};

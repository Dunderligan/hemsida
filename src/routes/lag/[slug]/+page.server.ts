import { db, schema } from '$lib/server/db/index.js';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const team = await db.query.team.findFirst({
		where: eq(schema.team.slug, params.slug),
		columns: {},
		with: {
			socials: {
				columns: {
					platform: true,
					url: true
				}
			},
			rosters: {
				columns: {
					name: true
				},
				with: {
					members: {
						columns: {
							isCaptain: true,
							tier: true,
							rank: true,
							role: true
						},
						with: {
							player: {
								columns: {
									battletag: true
								}
							}
						}
					},
					group: {
						columns: {
							slug: true
						},
						with: {
							division: {
								columns: {
									name: true,
									slug: true
								},
								with: {
									season: {
										columns: {
											name: true,
											slug: true
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});

	if (!team) {
		error(404);
	}

	if (team.rosters.length === 0) {
		error(500, 'Team has no roster');
	}

	return { team };
};

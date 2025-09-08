import { db, schema } from '$lib/server/db/index.js';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const load = async ({ params }) => {
	const data = await db.query.roster.findFirst({
		where: eq(schema.roster.slug, params.slug),
		columns: {
			id: true,
			name: true,
			slug: true
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
			team: {
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
							id: true,
							slug: true
						},
						with: {
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
			}
		}
	});

	if (!data) {
		error(404);
	}

	const info = data.team.rosters.find((r) => r.id === data.id)!;
	const roster = { ...data, team: undefined, ...info };

	return { roster, team: data.team };
};

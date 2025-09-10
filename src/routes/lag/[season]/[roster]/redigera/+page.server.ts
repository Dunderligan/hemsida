import { isAdmin } from '$lib/auth-client';
import { db, schema } from '$lib/server/db';
import { groupContext } from '$lib/server/db/helpers';
import type { Roster } from '$lib/types';
import { error } from '@sveltejs/kit';
import { eq, and } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	if (!isAdmin(locals.user)) {
		error(403);
	}

	const data = await db.query.roster.findFirst({
		where: and(eq(schema.roster.seasonSlug, params.season), eq(schema.roster.slug, params.roster)),
		columns: {
			id: true,
			name: true,
			slug: true,
			seasonSlug: true
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
							id: true,
							battletag: true
						}
					}
				}
			},
			team: {
				columns: {
					id: true
				},
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
							name: true,
							slug: true
						},
						with: {
							...groupContext
						}
					}
				}
			}
		}
	});

	if (!data) {
		error(404);
	}

	const currentRosterInfo = data.team.rosters.find((r) => r.id === data.id)!;
	const roster: Roster = { ...data, team: undefined, ...currentRosterInfo };

	return { roster, team: data.team };
};

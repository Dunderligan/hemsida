import { db } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	const users = await db.query.user.findMany({
		orderBy: {
			battletag: 'asc'
		}
	});

	return { users };
};

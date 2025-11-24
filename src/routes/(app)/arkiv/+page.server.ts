import { db, schema } from '$lib/server/db';
import { asc } from 'drizzle-orm';

export const load = async () => {
	const seasons = await db.query.season.findMany({
		orderBy: asc(schema.season.startedAt),
		columns: {
			createdAt: false
		}
	});

	return { seasons };
};

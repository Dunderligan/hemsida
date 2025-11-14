import { db, schema } from '$lib/server/db';
import { error, redirect, type RequestHandler } from '@sveltejs/kit';
import { eq, desc } from 'drizzle-orm';

export const GET: RequestHandler = async ({ params }) => {
	const slug = params.roster;

	if (!slug) {
		error(404);
	}

	// redirect to the latest roster with the same slug
	const [latest] = await db
		.select({ seasonSlug: schema.season.slug })
		.from(schema.roster)
		.innerJoin(schema.group, eq(schema.roster.groupId, schema.group.id))
		.innerJoin(schema.division, eq(schema.group.divisionId, schema.division.id))
		.innerJoin(schema.season, eq(schema.division.seasonId, schema.season.id))
		.where(eq(schema.roster.slug, slug))
		.orderBy(desc(schema.season.startedAt))
		.limit(1);

	if (!latest) {
		error(404);
	}

	redirect(303, `/lag/${slug}/${latest.seasonSlug}`);
};

import { command } from '$app/server';
import { db, schema } from '$lib/server/db';
import { Rank, Role, SocialPlatform, type Member, type TeamSocial } from '$lib/types';
import { eq, sql, type ExtractTablesWithRelations } from 'drizzle-orm';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import slugify from 'slugify';
import * as z from 'zod';

export const editRoster = command(
	z.object({
		id: z.string(),
		teamId: z.string(),
		name: z.string(),
		members: z.array(
			z.object({
				role: z.enum(Role),
				rank: z.enum(Rank),
				tier: z.int().max(5).min(1),
				isCaptain: z.boolean(),
				player: z.object({
					id: z.string().nullable(),
					battletag: z.string()
				})
			})
		),
		socials: z.array(
			z.object({
				platform: z.enum(SocialPlatform),
				url: z.string()
			})
		)
	}),
	async ({ id, teamId, name, members, socials }) => {
		const newSlug = slugify(name).toLowerCase();

		await db.transaction(async (tx) => {
			await Promise.all([
				updateName(tx, id, name, newSlug),
				updateMembers(id, members),
				updateSocials(teamId, socials)
			]);
		});

		return {
			location: `../${newSlug}`
		};
	}
);

async function updateName(
	tx: PgTransaction<
		PostgresJsQueryResultHKT,
		typeof schema,
		ExtractTablesWithRelations<typeof schema>
	>,
	rosterId: string,
	name: string,
	slug: string
) {
	await tx
		.update(schema.roster)
		.set({
			name,
			slug
		})
		.where(eq(schema.roster.id, rosterId));
}

async function updateMembers(rosterId: string, members: Member[]) {
	// delete all the members and insert them again
	// there is probably a more effective way to do this

	await db.delete(schema.member).where(eq(schema.member.rosterId, rosterId));

	const memberInserts = await Promise.all(
		members.map(async (member) => {
			let playerId = member.player.id ?? (await findOrCreatePlayer(member.player.battletag));

			return {
				rosterId: rosterId,
				playerId,
				role: member.role,
				rank: member.rank,
				tier: member.tier,
				isCaptain: member.isCaptain
			};
		})
	);

	if (memberInserts.length > 0) {
		await db.insert(schema.member).values(memberInserts);
	}
}

async function findOrCreatePlayer(battletag: string) {
	const [existingPlayer] = await db
		.select()
		.from(schema.player)
		.where(eq(schema.player.battletag, battletag));

	if (existingPlayer) {
		return existingPlayer.id;
	} else {
		const [newPlayer] = await db.insert(schema.player).values({ battletag }).returning();

		return newPlayer.id;
	}
}

async function updateSocials(teamId: string, socials: TeamSocial[]) {
	await db
		.insert(schema.social)
		.values(socials.map((social) => ({ ...social, teamId })))
		.onConflictDoUpdate({
			target: [schema.social.platform, schema.social.teamId],
			set: { url: sql`excluded.${schema.social.url}` }
		});
}

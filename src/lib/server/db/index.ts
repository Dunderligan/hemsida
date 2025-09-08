import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { reset, seed } from 'drizzle-seed';

if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(env.DATABASE_URL);

const db = drizzle(client, { schema, casing: 'snake_case' });

async function seedDb() {
	const seedSchema = {
		team: schema.team,
		player: schema.player,
		roster: schema.roster,
		member: schema.member,
		season: schema.season,
		division: schema.division,
		group: schema.group,
		match: schema.match,
		social: schema.social
	};

	await reset(db, seedSchema);
	await seed(db, seedSchema).refine((f) => ({
		team: {
			count: 32
		},
		roster: {
			count: 32 * 2
		},
		player: {
			count: 32 * 2 * 7
		},
		member: {
			count: 32 * 2 * 7 + 3,
			columns: {
				tier: f.int({ minValue: 1, maxValue: 5 })
			}
		},
		season: {
			count: 1
		},
		division: {
			count: 3
		},
		group: {
			count: 3 * 3
		},
		match: {
			count: 128
		},
		social: {
			count: 32
		}
	}));
}

await seedDb();

export { db, schema };

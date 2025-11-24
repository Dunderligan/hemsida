import { type ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction, timestamp } from 'drizzle-orm/pg-core';
import type { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import { schema } from '.';

export const timestamps = {
	createdAt: timestamp().defaultNow().notNull()
};

export const leagueQuery = {
	columns: {
		id: true,
		name: true,
		slug: true
	}
} as const;

export const nestedDivisionQuery = {
	...leagueQuery,
	with: {
		season: {
			...leagueQuery
		}
	}
} as const;

export const nestedGroupQuery = {
	...leagueQuery,
	with: {
		division: nestedDivisionQuery
	}
} as const;

export const matchRosterQuery = leagueQuery;

export type Transaction = PgTransaction<
	PostgresJsQueryResultHKT,
	typeof schema,
	ExtractTablesWithRelations<typeof schema>
>;

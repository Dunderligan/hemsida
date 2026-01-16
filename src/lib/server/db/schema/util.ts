import { and, isNotNull, isNull, or, type SQL } from 'drizzle-orm';
import { timestamp } from 'drizzle-orm/pg-core';

/** Timestamps that all tables should have. */
export const timestamps = {
	createdAt: timestamp().defaultNow().notNull()
};

/**
 * Convert a TypeScript enum to a Postgres enum representation.
 * This is taken from somewhere (maybe deep in the Drizzle docs?).
 */
export function enumToPgEnum<T extends Record<string, any>>(
	myEnum: T
): [T[keyof T], ...T[keyof T][]] {
	return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

export function xor(a: SQL<unknown>, b: SQL<unknown>) {
	// first-order conjunctive normal form btw 😎
	return and(or(isNotNull(a), isNotNull(b)), or(isNull(a), isNull(b)))!;
}

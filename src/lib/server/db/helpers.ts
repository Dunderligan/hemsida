import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
	createdAt: timestamp().defaultNow().notNull()
};

export const groupContext = {
	group: {
		columns: {
			name: true,
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
} as const;

export function enumToPgEnum<T extends Record<string, any>>(
	myEnum: T
): [T[keyof T], ...T[keyof T][]] {
	return Object.values(myEnum).map((value: any) => `${value}`) as any;
}

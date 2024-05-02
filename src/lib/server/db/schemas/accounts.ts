import { sqliteTable, primaryKey, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from '.';

export const accounts = sqliteTable(
	'account',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		provider: text('provider').notNull(),
		providerAccountId: text('provider_account_id').notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.userId, table.provider, table.providerAccountId] }),
		};
	},
);

export const accountsRelations = relations(accounts, ({ one }) => {
	return {
		user: one(users, {
			fields: [accounts.userId],
			references: [users.id],
		}),
	};
});

export type Account = (typeof accounts)['$inferSelect'];
export type AccountInsert = (typeof accounts)['$inferInsert'];

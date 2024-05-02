import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, primaryKey, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { accounts, sessions } from '.';

export const users = sqliteTable(
	'user',
	{
		id: text('id').notNull(),
		email: text('email').notNull(),
		username: text('username').notNull(),
		createdAt: integer('created_at', { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
		updatedAt: integer('updated_at', { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.id] }),
			emailIndex: uniqueIndex('email_idx').on(table.email),
			usernameIndex: uniqueIndex('username_idx').on(table.username),
		};
	},
);
export const usersRelations = relations(users, ({ many }) => {
	return {
		sessions: many(sessions),
		accounts: many(accounts),
	};
});

export type User = (typeof users)['$inferSelect'];
export type UserInsert = (typeof users)['$inferInsert'];

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

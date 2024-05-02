import { relations, sql } from 'drizzle-orm';
import { sqliteTable, integer, primaryKey, text } from 'drizzle-orm/sqlite-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { users } from '.';

export const sessions = sqliteTable(
	'session',
	{
		id: text('id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id),
		expiresAt: integer('expires_at', { mode: "timestamp" }).notNull(),
		createdAt: integer('created_at', { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.id] }),
		};
	},
);

export const sessionsRelations = relations(sessions, ({ one }) => {
	return {
		user: one(users, {
			fields: [sessions.userId],
			references: [users.id],
		}),
	};
});

export type Session = (typeof sessions)['$inferSelect'];
export type SessionInsert = (typeof sessions)['$inferInsert'];

export const selectSessionSchema = createSelectSchema(sessions);
export const insertSessionSchema = createInsertSchema(sessions);

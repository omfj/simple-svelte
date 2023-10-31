import { relations } from 'drizzle-orm';
import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { users } from '.';

export const sessions = pgTable(
	'session',
	{
		id: uuid('id').notNull().defaultRandom(),
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id),
		expires: timestamp('expires').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
	},
	(table) => ({
		pk: primaryKey(table.id),
	}),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export type Session = (typeof sessions)['$inferSelect'];
export type SessionInsert = (typeof sessions)['$inferInsert'];

export const selectSessionSchema = createSelectSchema(sessions);
export const insertSessionSchema = createInsertSchema(sessions);

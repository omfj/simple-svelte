import { relations } from 'drizzle-orm';
import {
	pgTable,
	uuid,
	varchar,
	text,
	timestamp,
	primaryKey,
	uniqueIndex,
} from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { posts, sessions } from '.';

export const users = pgTable(
	'user',
	{
		id: uuid('id').notNull().defaultRandom(),
		email: varchar('email', { length: 255 }).notNull(),
		username: varchar('username', { length: 255 }).notNull(),
		password: text('password').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull(),
	},
	(table) => ({
		pk: primaryKey(table.id),
		emailIndex: uniqueIndex('email_idx').on(table.email),
		usernameIndex: uniqueIndex('username_idx').on(table.username),
	}),
);
export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	sessions: many(sessions),
}));

export type User = (typeof users)['$inferSelect'];
export type UserInsert = (typeof users)['$inferInsert'];

export const selectUserSchema = createSelectSchema(users);
export const insertUserSchema = createInsertSchema(users);

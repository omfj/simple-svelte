import { relations, type InferModel } from 'drizzle-orm';
import { pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core';

/**
 * Users
 */
export const users = pgTable(
	'users',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		email: varchar('email', { length: 255 }).notNull(),
		username: varchar('username', { length: 255 }).notNull(),
		password: text('password').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(users) => ({
		emailIndex: uniqueIndex('email_idx').on(users.email),
		usernameIndex: uniqueIndex('username_idx').on(users.username)
	})
);
export type User = InferModel<typeof users>;

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	sessions: many(sessions)
}));

/**
 * Sessions
 */
export const sessions = pgTable('sessions', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id')
		.notNull()
		.references(() => users.id),
	expires: timestamp('expires').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});
export type Session = InferModel<typeof sessions>;

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	})
}));

/**
 * Posts
 */
export const posts = pgTable('posts', {
	id: uuid('id').defaultRandom().primaryKey(),
	userId: uuid('user_id').references(() => users.id),
	title: varchar('title', { length: 255 }).notNull(),
	body: text('body').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
export type Post = InferModel<typeof posts>;

export const postsRelations = relations(posts, ({ one }) => ({
	user: one(users, {
		fields: [posts.userId],
		references: [users.id]
	})
}));

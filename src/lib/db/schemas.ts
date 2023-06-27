import { pgTable, serial, text, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable(
	'users',
	{
		id: serial('id').primaryKey(),
		email: varchar('email', { length: 255 }).notNull(),
		username: varchar('username', { length: 255 }).notNull(),
		password: text('password').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(users) => {
		return {
			emailIndex: uniqueIndex('email_idx').on(users.email),
			usernameIndex: uniqueIndex('username_idx').on(users.username)
		};
	}
);

export const sessions = pgTable('sessions', {
	id: serial('id').primaryKey(),
	userId: serial('user_id').references(() => users.id),
	expires: timestamp('expires').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const posts = pgTable('posts', {
	id: serial('id').primaryKey(),
	userId: serial('user_id').references(() => users.id),
	title: varchar('title', { length: 255 }).notNull(),
	body: text('body').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

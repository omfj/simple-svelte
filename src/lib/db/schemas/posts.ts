import { relations } from 'drizzle-orm';
import { pgTable, uuid, varchar, text, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from '.';

export const posts = pgTable(
	'post',
	{
		id: uuid('id').notNull().defaultRandom(),
		title: varchar('title', { length: 255 }).notNull(),
		body: text('body').notNull(),
		userId: uuid('user_id').references(() => users.id),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at').notNull().defaultNow(),
	},
	(table) => ({
		pk: primaryKey(table.id),
	}),
);

export const postsRelations = relations(posts, ({ one }) => ({
	user: one(users, {
		fields: [posts.userId],
		references: [users.id],
	}),
}));

export type Post = (typeof posts)['$inferSelect'];
export type PostInsert = (typeof posts)['$inferInsert'];

export const selectPostSchema = createSelectSchema(posts);
export const insertPostSchema = createInsertSchema(posts);

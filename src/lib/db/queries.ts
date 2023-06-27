import { eq, or } from 'drizzle-orm';
import { db } from './drizzle';
import { sessions, users } from './schemas';
import { hash } from '../utils/hash';

export const ERRORS = {
	USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
	USER_NOT_FOUND: 'USER_NOT_FOUND',
	EMAIL_OR_PASSWORD_INCORRECT: 'EMAIL_OR_PASSWORD_INCORRECT',
	SESSION_NOT_FOUND: 'SESSION_NOT_FOUND'
} as const;

export const createUser = async (email: string, username: string, password: string) => {
	const usersWithEmailOrUsername = await db
		.select()
		.from(users)
		.where(or(eq(users.email, email), eq(users.username, username)));

	if (usersWithEmailOrUsername.length > 0) {
		throw new Error(ERRORS.USER_ALREADY_EXISTS);
	}

	const hashedPassword = hash(password);

	const user = await db
		.insert(users)
		.values({
			email,
			username,
			password: hashedPassword
		})
		.returning({
			insertedId: users.id
		});

	return user[0];
};

export const validateUser = async (email: string, password: string) => {
	const user = (await db.select().from(users).where(eq(users.email, email)))[0];

	if (!user) {
		throw new Error(ERRORS.EMAIL_OR_PASSWORD_INCORRECT);
	}

	const hashedPassword = hash(password);

	if (user.password !== hashedPassword) {
		throw new Error(ERRORS.EMAIL_OR_PASSWORD_INCORRECT);
	}

	return user;
};

export const createSession = async (userId: number, expires: Date) => {
	const session = await db
		.insert(sessions)
		.values({
			userId,
			expires
		})
		.returning({
			instertedId: sessions.id
		});

	return session[0];
};

export const getUserByEmail = async (email: string) => {
	const usersWithEmail = await db.select().from(users).where(eq(users.email, email));

	return usersWithEmail[0];
};

export const getUserByUsername = async (username: string) => {
	const usersWithUsername = await db.select().from(users).where(eq(users.username, username));

	return usersWithUsername[0];
};

export const getUserBySessionId = async (sessionId: number) => {
	const session = await db.select().from(sessions).where(eq(sessions.id, sessionId));
	const user = await db.select().from(users).where(eq(users.id, session[0].userId));

	return user[0] ?? undefined;
};

export const deleteSession = async (sessionId: number) => {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
};

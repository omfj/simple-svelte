import { eq } from 'drizzle-orm';
import { db } from './drizzle';
import { sessions, users, type Session, type User } from './schema';
import { hash } from '../utils/hash';

export const createUser = async (
	email: User['email'],
	username: User['username'],
	password: User['password']
): Promise<{ id: string } | undefined> => {
	const existingUser = await db.query.users.findFirst({
		where: (users, { or }) => or(eq(users.email, email), eq(users.username, username))
	});

	if (existingUser) {
		// User already exists
		return undefined;
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
			id: users.id
		});

	return user[0];
};

export const validateUser = async (username: User['email'], password: User['password']) => {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.username, username)
	});

	if (!user) {
		// User not found
		return null;
	}

	const hashedPassword = hash(password);

	if (user.password !== hashedPassword) {
		// Passwords don't match
		return null;
	}

	return user;
};

export const createSession = async (userId: User['id'], expires: Session['expires']) => {
	const session = await db
		.insert(sessions)
		.values({
			userId,
			expires
		})
		.returning({
			id: sessions.id
		});

	return session[0];
};

export const getUserByEmail = async (email: User['email']): Promise<User | undefined> => {
	const usersWithEmail = await db.select().from(users).where(eq(users.email, email));

	return usersWithEmail[0];
};

export const getUserByUsername = async (username: User['username']): Promise<User | undefined> => {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.username, username)
	});

	return user;
};

export const getUserBySessionId = async (sessionId: Session['id']): Promise<User | undefined> => {
	const session = await db.query.sessions.findFirst({
		where: (sessions, { eq }) => eq(sessions.id, sessionId)
	});

	if (!session) {
		return undefined;
	}

	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, session.userId)
	});

	return user;
};

export const deleteSession = async (sessionId: Session['id']): Promise<void> => {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
};

export const validateSession = async (sessionId: Session['id']): Promise<boolean> => {
	const session = await db.query.sessions.findFirst({
		where: (sessions, { eq }) => eq(sessions.id, sessionId)
	});

	if (!session) {
		// Session not found
		return false;
	}

	const now = new Date();

	if (session.expires < now) {
		await deleteSession(sessionId);
		return false;
	}

	return true;
};

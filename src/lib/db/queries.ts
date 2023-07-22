import { eq } from 'drizzle-orm';
import { db } from './drizzle';
import { sessions, users, type Session, type User } from './schema';
import { hash } from '../utils/hash';

/**
 * Creates a user.
 *
 * @param email the email of the user
 * @param username the username of the user
 * @param password the password of the user
 *
 */
export const createUser = async (
	email: User['email'],
	username: User['username'],
	password: User['password']
): Promise<User['id'] | undefined> => {
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

	return user[0].id;
};

/**
 * Checks if a user exists and if the password is correct.
 *
 * @param username the username of the user
 * @param password the password of the user
 * @returns the user if the username and password are valid, null otherwise
 */
export const validateUser = async (
	username: User['username'],
	password: User['password']
): Promise<User | null> => {
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

/**
 * Creates a session for a user.
 *
 * @param userId the user id to create a session for
 * @param expires the date the session expires
 * @returns the session id
 */
export const createSession = async (
	userId: User['id'],
	expires: Session['expires']
): Promise<Session['id']> => {
	const session = await db
		.insert(sessions)
		.values({
			userId,
			expires
		})
		.returning({
			id: sessions.id
		});

	return session[0].id;
};

/**
 * Gets the user associated with an email.
 *
 * @param email the email to get the user from
 * @returns the user associated with the email, or null if the email is invalid
 */
export const getUserByEmail = async (email: User['email']): Promise<User | null> => {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.email, email)
	});

	if (!user) {
		return null;
	}

	return user;
};

/**
 * Gets the user associated with a username.
 *
 * @param username the username to get the user from
 * @returns the user associated with the username, or null if the username is invalid
 */
export const getUserByUsername = async (username: User['username']): Promise<User | null> => {
	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.username, username)
	});

	if (!user) {
		return null;
	}

	return user;
};

/**
 * Gets the user associated with a session id.
 *
 * @param sessionId session id to get the user from
 * @returns the user associated with the session id, or null if the session id is invalid
 */
export const getUserBySessionId = async (sessionId: Session['id']): Promise<User | null> => {
	const session = await db.query.sessions.findFirst({
		where: (sessions, { eq }) => eq(sessions.id, sessionId)
	});

	if (!session) {
		return null;
	}

	const user = await db.query.users.findFirst({
		where: (users, { eq }) => eq(users.id, session.userId)
	});

	if (!user) {
		return null;
	}

	return user;
};

/**
 *  Deletes a session from the database.
 *
 * @param sessionId the session id to delete
 */
export const deleteSession = async (sessionId: Session['id']): Promise<void> => {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
};

/**
 * Validates a session.
 * Checks if the sessions exists and if it has expired.
 *
 * @param sessionId the session id to validate
 * @returns true if the session is valid, false if the session is invalid or expired
 */
export const validateSession = async (sessionId: Session['id']): Promise<boolean> => {
	const session = await db.query.sessions.findFirst({
		where: (sessions, { eq }) => eq(sessions.id, sessionId)
	});

	if (!session) {
		return false;
	}

	const now = new Date();

	if (session.expires < now) {
		await deleteSession(sessionId);
		return false;
	}

	return true;
};

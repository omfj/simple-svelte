import { eq } from 'drizzle-orm';
import { db } from './drizzle';
import { sessions, users, type User } from './schemas';
import { bcrypt } from '$lib/auth';

type BaseError = {
	message: string;
};

type BaseResponse<T, E = BaseError> = Promise<
	| {
			data: T;
			error: null;
	  }
	| {
			data: null;
			error: E;
	  }
>;

type CreateUserFunction = (
	email: string,
	username: string,
	password: string,
) => BaseResponse<{ userId: string }>;

export const createUser: CreateUserFunction = async (email, username, password) => {
	try {
		const existingUser = await db.query.users.findFirst({
			where: (users, { or }) => or(eq(users.email, email), eq(users.username, username)),
		});

		if (existingUser) {
			return {
				data: null,
				error: {
					message: 'User with username or email already exists.',
				},
			};
		}

		const user = await db
			.insert(users)
			.values({
				email,
				username,
				password: await bcrypt.hash(password),
			})
			.returning();

		return {
			data: {
				userId: user[0].id,
			},
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: {
				message: 'Could not reach database.',
			},
		};
	}
};

type ValidateUserFunction = (username: string, password: string) => BaseResponse<{ user: User }>;

export const validateUser: ValidateUserFunction = async (username, password) => {
	try {
		const user = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.username, username),
		});

		if (!user) {
			return {
				data: null,
				error: {
					message: 'User not found.',
				},
			};
		}

		if (!bcrypt.verify(password, user.password)) {
			return {
				data: null,
				error: {
					message: 'Invalid password.',
				},
			};
		}

		return {
			data: {
				user,
			},
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: {
				message: 'Could not reach database.',
			},
		};
	}
};

type CreateSessionFunction = (userId: string, expires: Date) => BaseResponse<{ sessionId: string }>;

export const createSession: CreateSessionFunction = async (userId, expires) => {
	try {
		const session = await db
			.insert(sessions)
			.values({
				userId,
				expires,
			})
			.returning({
				id: sessions.id,
			});

		return {
			data: {
				sessionId: session[0].id,
			},
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: {
				message: 'Could not reach database.',
			},
		};
	}
};

type GetUserByEmailFunction = (email: string) => BaseResponse<{ user: User }>;

export const getUserByEmail: GetUserByEmailFunction = async (email) => {
	try {
		const user = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.email, email),
		});

		if (!user) {
			return {
				data: null,
				error: {
					message: 'User not found.',
				},
			};
		}

		return {
			data: {
				user,
			},
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: {
				message: 'Could not reach database.',
			},
		};
	}
};

type GetUserByUsernameFunction = (username: string) => BaseResponse<{ user: User }>;

export const getUserByUsername: GetUserByUsernameFunction = async (username) => {
	try {
		const user = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.username, username),
		});

		if (!user) {
			return {
				data: null,
				error: {
					message: 'User not found.',
				},
			};
		}

		return {
			data: {
				user,
			},
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: {
				message: 'Could not reach database.',
			},
		};
	}
};

type GetUserBySessionIdFunction = (sessionId: string) => BaseResponse<{ user: User }>;

export const getUserBySessionId: GetUserBySessionIdFunction = async (sessionId) => {
	try {
		const session = await db.query.sessions.findFirst({
			where: (sessions, { eq }) => eq(sessions.id, sessionId),
		});

		if (!session) {
			return {
				data: null,
				error: {
					message: 'Session not found.',
				},
			};
		}

		const user = await db.query.users.findFirst({
			where: (users, { eq }) => eq(users.id, session.userId),
		});

		if (!user) {
			return {
				data: null,
				error: {
					message: 'User not found.',
				},
			};
		}

		return {
			data: {
				user,
			},
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: {
				message: 'Could not reach database.',
			},
		};
	}
};

type DeleteSessionFunction = (sessionId: string) => Promise<void>;

export const deleteSession: DeleteSessionFunction = async (sessionId: string) => {
	await db.delete(sessions).where(eq(sessions.id, sessionId));
};

type ValidateSessionFunction = (sessionId: string) => Promise<boolean>;

export const validateSession: ValidateSessionFunction = async (sessionId) => {
	try {
		const session = await db.query.sessions.findFirst({
			where: (sessions, { eq }) => eq(sessions.id, sessionId),
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
	} catch (error) {
		return false;
	}
};

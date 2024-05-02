import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import { adapter } from './adapter';
import type { User } from '../db/schemas';

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev,
		},
	},
	getUserAttributes: (attributes) => {
		return attributes;
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: User;
	}
}

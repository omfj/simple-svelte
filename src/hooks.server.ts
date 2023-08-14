import { getUserBySessionId, validateSession } from '$lib/db/auth';
import type { Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	// Get the session ID from the cookies
	const sessionId = event.cookies.get('session');

	// If there is a session ID, get the user from the backend
	if (sessionId) {
		const validSession = await validateSession(sessionId);

		// If the session is invalid, delete the session cookie
		if (!validSession) {
			event.locals.user = undefined;
		} else {
			const { data, error } = await getUserBySessionId(sessionId);
			if (error) event.locals.user = undefined;
			else {
				event.locals.user = {
					id: data.user.id,
					username: data.user.username,
					email: data.user.email,
					createdAt: data.user.createdAt
				};
			}
		}
	}

	// If there is no session ID, delete the session cookie
	if (!event.locals.user) event.cookies.delete('session');

	// Everything above is run before the route/api/page is resolved
	const response = await resolve(event);
	// Everything below is run after the route/api/page is resolved

	return response;
}) satisfies Handle;

import { fail, redirect } from '@sveltejs/kit';

import type { Actions } from './$types';
import { lucia } from '$lib/server/auth/lucia';

export const actions: Actions = {
	default: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		await lucia.invalidateSession(event.locals.session.id);
		const sessionCookie = lucia.createBlankSessionCookie();
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: '/',
			...sessionCookie.attributes,
		});

		return new Response(null, {
			status: 301,
			headers: {
				Location: '/',
			}
		});
	},
};

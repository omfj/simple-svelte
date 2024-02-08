import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { deleteSession } from '$lib/db/auth';
import { SESSION_COOKIE_NAME } from '$lib/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		return redirect(304, '/');
	}

	return redirect(303, '/login');
};

export const actions: Actions = {
	default: async ({ cookies }) => {
		const sessionId = cookies.get(SESSION_COOKIE_NAME);

		if (sessionId) await deleteSession(sessionId);

		cookies.delete(SESSION_COOKIE_NAME, {
			path: '/',
		});

		throw redirect(303, '/');
	},
};

import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { deleteSession } from '$lib/db/queries';

export const load = (async ({ locals }) => {
	if (locals.user) {
		throw redirect(304, '/');
	}

	throw redirect(303, '/login');
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ cookies }) => {
		const sessionId = cookies.get('session');

		if (sessionId) await deleteSession(sessionId);

		cookies.delete('session');

		throw redirect(303, '/');
	}
} satisfies Actions;

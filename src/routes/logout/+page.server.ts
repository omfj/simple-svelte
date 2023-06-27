import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (locals.user) {
		throw redirect(304, '/');
	}

	throw redirect(303, '/login');
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ cookies }) => {
		cookies.delete('session');

		throw redirect(303, '/');
	}
} satisfies Actions;

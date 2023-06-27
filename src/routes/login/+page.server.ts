import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { createSession, validateUser } from '$lib/db/queries';
import { DEFAULT_SESSION_LENGTH } from '$lib/constants';

export const load = (async ({ locals }) => {
	if (locals.user) {
		throw redirect(304, '/');
	}
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();

		const username = data.get('username');
		const password = data.get('password');

		if (!username || !password) {
			return {
				status: 400,
				success: false,
				message: 'Missing required fields'
			};
		}

		if (typeof username !== 'string' || typeof password !== 'string') {
			return {
				status: 400,
				success: false,
				message: 'Invalid field types'
			};
		}

		const userId = (await validateUser(username, password)).id;
		const session = await createSession(userId, new Date(Date.now() + DEFAULT_SESSION_LENGTH));

		cookies.set('session', session.instertedId.toString());

		throw redirect(303, '/');
	}
} satisfies Actions;

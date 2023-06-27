import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createSession, createUser } from '$lib/db/queries';
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
		const email = data.get('email');
		const password = data.get('password');
		const passwordConfirm = data.get('passwordConfirm');

		// TODO: Make shorter | Check if fields are empty
		if (!username || !email || !password || !passwordConfirm) {
			return {
				status: 400,
				success: false,
				message: 'Missing required fields'
			};
		}

		// TODO: Make shorter | Check if fields are strings
		if (
			typeof username !== 'string' ||
			typeof email !== 'string' ||
			typeof password !== 'string' ||
			typeof passwordConfirm !== 'string'
		) {
			return {
				status: 400,
				success: false,
				message: 'Invalid field types'
			};
		}

		// Check if password and passwordConfirm match
		if (password !== passwordConfirm) {
			return {
				status: 400,
				success: false,
				message: 'Passwords do not match'
			};
		}

		let userId;

		try {
			userId = (await createUser(email, username, password)).insertedId;
		} catch (error) {
			return {
				status: 400,
				success: false,
				message: 'User already exists'
			};
		}

		const session = await createSession(userId, new Date(Date.now() + DEFAULT_SESSION_LENGTH));

		cookies.set('session', session.instertedId.toString());

		throw redirect(303, '/');
	}
} satisfies Actions;

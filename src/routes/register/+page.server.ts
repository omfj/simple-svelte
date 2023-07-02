import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createSession, createUser } from '$lib/db/queries';
import { DEFAULT_SESSION_LENGTH } from '$lib/constants';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { registerSchema } from '$lib/validators/register';

export const load = (async ({ locals }) => {
	if (locals.user) {
		throw redirect(304, '/');
	}

	const form = await superValidate(registerSchema);

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, registerSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { username, email, password } = form.data;

		const user = await createUser(email, username, password);

		if (!user) {
			setError(form, 'username', 'Username or email already taken');
			setError(form, 'email', 'Username or email already taken');
			return fail(400, {
				form
			});
		}

		const session = await createSession(user.id, new Date(Date.now() + DEFAULT_SESSION_LENGTH));

		cookies.set('session', session.id);

		return {
			form
		};
	}
} satisfies Actions;

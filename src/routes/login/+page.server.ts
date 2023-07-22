import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { createSession, validateUser } from '$lib/db/queries';
import { DEFAULT_SESSION_LENGTH } from '$lib/constants';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/validators/login';

export const load = (async ({ locals }) => {
	if (locals.user) {
		throw redirect(304, '/');
	}

	const form = await superValidate(loginSchema);

	return {
		form
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, loginSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { username, password } = form.data;

		const user = await validateUser(username, password);

		if (!user) {
			setError(form, 'username', 'Username or password incorrect');
			setError(form, 'password', 'Username or password incorrect');
			return fail(400, {
				form
			});
		}

		const sessionId = await createSession(user.id, new Date(Date.now() + DEFAULT_SESSION_LENGTH));

		cookies.set('session', sessionId);

		return {
			form
		};
	}
} satisfies Actions;

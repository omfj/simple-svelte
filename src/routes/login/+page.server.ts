import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Actions } from './$types';
import { createSession, validateUser } from '$lib/db/auth';
import { DEFAULT_SESSION_LENGTH } from '$lib/constants';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/validators/login';

export const load = (async ({ locals }) => {
	if (locals.user) {
		throw redirect(304, '/');
	}

	const form = await superValidate(loginSchema);

	return {
		form,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, loginSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { username, password } = form.data;

		const { data: validateUserData, error: validateUserError } = await validateUser(
			username,
			password,
		);

		if (validateUserError) {
			setError(form, 'username', validateUserError.message);
			setError(form, 'password', validateUserError.message);
			return fail(400, {
				form,
			});
		}

		const { data: createSessionData, error: createSessionError } = await createSession(
			validateUserData.user.id,
			new Date(Date.now() + DEFAULT_SESSION_LENGTH),
		);

		if (createSessionError) {
			setError(form, 'username', createSessionError.message);
			setError(form, 'password', createSessionError.message);
			return fail(400, {
				form,
			});
		}

		cookies.set('session', createSessionData.sessionId, {
			httpOnly: import.meta.env.PROD,
			secure: import.meta.env.PROD,
			sameSite: 'strict',
			maxAge: DEFAULT_SESSION_LENGTH / 1000,
		});

		return {
			form,
		};
	},
} satisfies Actions;

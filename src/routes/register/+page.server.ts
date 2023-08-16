import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createSession, createUser } from '$lib/db/auth';
import { DEFAULT_SESSION_LENGTH } from '$lib/constants';
import { setError, superValidate } from 'sveltekit-superforms/server';
import { registerSchema } from '$lib/validators/register';

export const load = (async ({ locals }) => {
	if (locals.user) {
		throw redirect(304, '/');
	}

	const form = await superValidate(registerSchema);

	return {
		form,
	};
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const form = await superValidate(request, registerSchema);

		if (!form.valid) {
			return fail(400, { form });
		}

		const { username, email, password } = form.data;

		const { data: createUserData, error: createUserError } = await createUser(
			email,
			username,
			password,
		);

		if (createUserError) {
			setError(form, 'username', createUserError.message);
			setError(form, 'email', createUserError.message);

			return fail(400, {
				form,
			});
		}

		const { data: createSessionData, error: createSessionError } = await createSession(
			createUserData.userId,
			new Date(Date.now() + DEFAULT_SESSION_LENGTH),
		);

		if (createSessionError) {
			setError(form, 'username', createSessionError.message);
			setError(form, 'email', createSessionError.message);

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

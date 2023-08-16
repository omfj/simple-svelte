import { getUserByUsername } from '$lib/db/auth';
import { error, type Load } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const { username } = params;

	if (!username) {
		throw error(404, 'User not found');
	}

	const { data, error: userError } = await getUserByUsername(username);

	if (userError) {
		throw error(404, 'User not found');
	}

	return {
		user: {
			id: data.user.id,
			username: data.user.username,
			email: data.user.email,
			createdAt: data.user.createdAt,
		},
	};
}) satisfies Load;

import { getUserByUsername } from '$lib/db/queries';
import { error, type Load } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const { username } = params;

	if (!username) {
		throw error(404, 'User not found');
	}

	const user = getUserByUsername(username);

	if (!user) {
		throw error(404, 'User not found');
	}

	return {
		user
	};
}) satisfies Load;

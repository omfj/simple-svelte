import { getUserByUsername } from '$lib/db/queries';
import { error, type Load } from '@sveltejs/kit';

export const load = (async ({ params }) => {
	const { username } = params;

	if (!username) {
		throw error(404, 'User not found');
	}

	const user = await getUserByUsername(username);

	if (!user) {
		throw error(404, 'User not found');
	}

	return {
		user: {
			id: user.id,
			username: user.username,
			email: user.email
		}
	};
}) satisfies Load;

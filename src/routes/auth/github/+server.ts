import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';
import { github } from '$lib/server/auth/providers/github';
import type { RequestEvent } from '@sveltejs/kit';
import { dev } from '$app/environment';

export async function GET(event: RequestEvent) {
	const state = generateState();
	const url = await github.createAuthorizationURL(state, {
		scopes: ['read:user'],
	});

	event.cookies.set('github_oauth_state', state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax',
	});

	return redirect(302, url.toString());
}

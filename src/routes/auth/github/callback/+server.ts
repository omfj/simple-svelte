import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { lucia } from '$lib/server/auth/lucia';
import { type RequestEvent } from '@sveltejs/kit';
import { getGitHubUser, github, githubProviderId } from '$lib/server/auth/providers/github';
import { db } from '$lib/server/db/drizzle';
import { accounts, users } from '$lib/server/db/schemas';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400,
		});
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUser = await getGitHubUser(tokens);

		const existingAccount = await db.query.accounts.findFirst({
			where: (account, { eq, and }) =>
				and(
					eq(account.provider, githubProviderId),
					eq(account.providerAccountId, githubUser.id.toString()),
				),
		});

		if (existingAccount) {
			const session = await lucia.createSession(existingAccount.userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes,
			});
		} else {
			const userId = generateId(15);

			await db.transaction(async (tx) => {
				await tx.insert(users).values({
					id: userId,
					email: githubUser.email,
					username: githubUser.login,
				});

				await tx.insert(accounts).values({
					userId,
					provider: githubProviderId,
					providerAccountId: githubUser.id.toString(),
				});
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '/',
				...sessionCookie.attributes,
			});
		}

		return new Response(null, {
			status: 302,
			headers: {
				Location: '/',
			},
		});
	} catch (e) {
		console.log(e);

		if (e instanceof OAuth2RequestError) {
			return new Response(null, {
				status: 400,
			});
		}
		return new Response(null, {
			status: 500,
		});
	}
}

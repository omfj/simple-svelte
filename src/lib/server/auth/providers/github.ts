import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { GitHub } from 'arctic';

export const githubProviderId = 'github' as const;

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET);

export type GitHubUser = {
	id: number;
	login: string;
	email: string;
};

export const getGitHubUser = async (tokens: { accessToken: string }) => {
	const githubUserResponse = await fetch('https://api.github.com/user', {
		headers: {
			Authorization: `Bearer ${tokens.accessToken}`,
			"User-Agent": "simple-svelte/1.0.0",
		},
	});

	const githubUser: GitHubUser = await githubUserResponse.json();

	return githubUser;
};

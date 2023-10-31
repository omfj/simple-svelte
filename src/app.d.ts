import type { SessionUser } from '$lib/validators/user';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: SessionUser | undefined;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};

import type { UserSchema } from '$lib/validators/user';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: UserSchema | undefined;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};

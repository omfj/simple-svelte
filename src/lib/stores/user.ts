import type { UserSchema } from '$lib/validators/user';
import { writable } from 'svelte/store';

export const user = writable<UserSchema | undefined>(undefined);

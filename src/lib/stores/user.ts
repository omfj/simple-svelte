import type { SessionUser } from '$lib/validators/user';
import { writable } from 'svelte/store';

export const user = writable<SessionUser | undefined>(undefined);

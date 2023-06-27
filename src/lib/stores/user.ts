import type { User } from '$lib/validators/user';
import { writable } from 'svelte/store';

export const user = writable<User | undefined>(null);

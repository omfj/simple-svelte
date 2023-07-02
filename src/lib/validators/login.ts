import { z } from 'zod';

export const loginSchema = z.object({
	username: z.string().min(3, 'Username must be at least 3 characters.'),
	password: z.string().min(1, 'You must enter a password.')
});

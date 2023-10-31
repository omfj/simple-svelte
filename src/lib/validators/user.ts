import { selectUserSchema } from '$lib/db/schemas';
import type { z } from 'zod';

export const sessionUserSchema = selectUserSchema.pick({
	id: true,
	email: true,
	username: true,
});

export type SessionUser = z.infer<typeof sessionUserSchema>;

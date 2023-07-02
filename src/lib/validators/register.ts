import { z } from 'zod';

export const registerSchema = z
	.object({
		username: z.string().min(3, 'Username must be at least 3 characters.'),
		email: z.string().min(1, 'You must enter an email.').email('Not a valid email address.'),
		password: z
			.string()
			.regex(
				new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'),
				'The password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number.'
			),
		passwordConfirm: z.string().min(1, 'Confirm your password.')
	})
	.superRefine(({ passwordConfirm, password }, ctx) => {
		if (passwordConfirm !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Password and password confirmation must match.',
				path: ['passwordConfirm', 'password']
			});
		}
	});

import { z } from 'zod';

const usernameOrEmailSchema = z.string().refine(
	(value) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const usernameRegex = /^[a-zA-Z0-9._]{3,}$/;

		return emailRegex.test(value) || usernameRegex.test(value);
	},
	{
		message: 'Digite um email válido ou um username com pelo menos 3 caracteres',
	}
);

const InstagramAccountSchema = z.object({
	username: usernameOrEmailSchema,
	password: z.string().min(4, { message: 'A senha deve ter no mínimo 4 caracteres.' }),
});

export { InstagramAccountSchema };

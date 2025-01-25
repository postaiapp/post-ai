import { z } from 'zod';

const usernameOrEmailSchema = z.union([
    z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres.' }),
    z.string().email({ message: 'Insira um e-mail válido.' }),
]);

const InstagramAccountSchema = z.object({
    username: usernameOrEmailSchema,
    password: z.string().min(4, { message: 'A senha deve ter no mínimo 4 caracteres.' }),
});

export { InstagramAccountSchema };

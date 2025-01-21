import { z } from 'zod';

const RegisterSchema = z.object({
    name: z.string().min(3, { message: 'O nome deve ter no mínimo 3 caracteres ' }),
    email: z.string().email({ message: 'O email deve ser válido.' }),
    password: z.string().min(6, { message: 'A senha deve conter no mínimo 6 caracteres.' }),
});

const LoginSchema = z.object({
    email: z.string().email({ message: 'O email deve ser válido.' }),
    password: z.string().min(6, { message: 'A senha deve conter no mínimo 6 caracteres.' }),
});

export { RegisterSchema, LoginSchema  };

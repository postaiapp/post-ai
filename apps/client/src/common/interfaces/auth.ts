import { LoginSchema, RegisterSchema } from '@common/schemas/auth';
import { UseFormRegister, FieldErrors, UseFormHandleSubmit, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

type AuthLoginType = z.infer<typeof LoginSchema>;

type AuthRegisterType = z.infer<typeof RegisterSchema>;

interface AuthCardProps {
    toggleAuthMode: () => void;
}

interface AuthContainerProps {
    toggleAuthMode: () => void;
    isRegister: boolean;
}

interface LoginCardProps {
    loading: boolean;
    register: UseFormRegister<AuthLoginType>;
    handleSubmit: UseFormHandleSubmit<AuthLoginType>;
    errors: FieldErrors<AuthLoginType>;
    onSubmit: SubmitHandler<AuthLoginType>;
    toggleAuthMode: () => void;
}
interface RegisterCardProps {
    loading: boolean;
    register: UseFormRegister<AuthRegisterType>;
    handleSubmit: UseFormHandleSubmit<AuthRegisterType>;
    errors: FieldErrors<AuthRegisterType>;
    onSubmit: SubmitHandler<AuthRegisterType>;
    toggleAuthMode: () => void;
}

export type { AuthContainerProps, AuthLoginType, AuthRegisterType, AuthCardProps, LoginCardProps, RegisterCardProps };

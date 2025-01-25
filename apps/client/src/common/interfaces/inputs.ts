import { UseFormRegister, Path } from 'react-hook-form';

interface PasswordInputProps<T extends object> {
    textValue: Path<T>;
    register: UseFormRegister<T>;
    placeholder?: string;
    className?: string;
    containerClassName?: string;
}

export type { PasswordInputProps };

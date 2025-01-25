'use client';
import { useState } from 'react';

import { PasswordInputProps } from '@common/interfaces/inputs';
import { Input } from '@components/ui/input';
import { cn } from '@lib/utils';
import { EyeOff, Eye } from 'lucide-react';

export function PasswordInput<T extends object>({
    register,
    textValue,
    className,
    containerClassName,
}: PasswordInputProps<T>) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    return (
        <div className={cn('relative', containerClassName)}>
            <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                id="password"
                className={className}
                {...register(textValue)}
            />
            <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-2 flex items-center text-gray-600"
            >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
        </div>
    );
}

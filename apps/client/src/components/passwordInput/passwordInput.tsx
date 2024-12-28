"use client";
import { Input } from "@components/ui/input"
import { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { PasswordInputProps } from "@common/interfaces/inputs";

export function PasswordInput<T extends object>({ register, textValue }: PasswordInputProps<T>) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <div className="relative">
            <Input
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                id="password"
                className="pr-10"
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
    )
}

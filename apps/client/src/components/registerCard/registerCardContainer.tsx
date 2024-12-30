import RegisterCard from "./registerCard";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthRegisterType, AuthContainerProps } from "@common/interfaces/auth";
import { RegisterSchema } from "@common/schemas/auth";
import { register as registerUser } from "../../processes/auth";
import { useCallback } from "react";

const RegisterCardContainer = ({ toggleAuthMode }: AuthContainerProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<AuthRegisterType>({
        resolver: zodResolver(RegisterSchema)
    });

    const onSubmit = useCallback<SubmitHandler<AuthRegisterType>>(async (user: AuthRegisterType) => {
        const { data, error } = await registerUser(user);

        if (error) {
            console.error("Login failed:", error);
        }

        console.log("Logged in:", data);
    }, []);

    return (
        <RegisterCard
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            onSubmit={onSubmit}
            toggleAuthMode={toggleAuthMode}
        />
    );
}

export default RegisterCardContainer
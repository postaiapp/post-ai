import LoginCard from "./loginCard";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLoginType, AuthContainerProps } from "@common/interfaces/auth";
import { LoginSchema } from "@common/schemas/auth";

const LoginCardContainer = ({ toggleAuthMode }: AuthContainerProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<AuthLoginType>({
        resolver: zodResolver(LoginSchema)
    });

    const onSubmit: SubmitHandler<AuthLoginType> = (data: AuthLoginType) => console.log(data)

    return (
        <LoginCard
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            onSubmit={onSubmit}
            toggleAuthMode={toggleAuthMode}
        />
    );
}

export default LoginCardContainer;

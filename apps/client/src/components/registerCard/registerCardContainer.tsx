import RegisterCard from "./registerCard";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthRegisterType, AuthContainerProps } from "@common/interfaces/auth";
import { RegisterSchema } from "@common/schemas/auth";

const RegisterCardContainer = ({ toggleAuthMode }: AuthContainerProps) => {
    const { register, handleSubmit, formState: { errors } } = useForm<AuthRegisterType>({
        resolver: zodResolver(RegisterSchema)
    });

    const onSubmit: SubmitHandler<AuthRegisterType> = (data: AuthRegisterType) => console.log(data)

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
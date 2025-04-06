'use client';

import RegisterCard from "./registerCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthRegisterType, AuthCardProps } from "@common/interfaces/auth";
import { RegisterSchema } from "@common/schemas/auth";
import { useRegisterMutation } from "@hooks/useRegisterMutation";

const RegisterCardContainer = ({ toggleAuthMode }: AuthCardProps) => {
	const { register, handleSubmit, formState: { errors } } = useForm<AuthRegisterType>({
		resolver: zodResolver(RegisterSchema)
	});

	const { mutate: registerUser, isPending } = useRegisterMutation(() => {
		toggleAuthMode();
	});

	const onSubmit = (data: AuthRegisterType) => {
		registerUser(data);
	};

	return (
		<RegisterCard
			loading={isPending}
			register={register}
			handleSubmit={handleSubmit}
			errors={errors}
			onSubmit={onSubmit}
			toggleAuthMode={toggleAuthMode}
		/>
	);
}

export default RegisterCardContainer
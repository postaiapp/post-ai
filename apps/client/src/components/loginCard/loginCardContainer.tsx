import LoginCard from "./loginCard";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLoginType, AuthCardProps } from "@common/interfaces/auth";
import { LoginSchema } from "@common/schemas/auth";
import { login } from "@processes/auth";
import { useCallback, useState } from "react";
import { userStore } from "@stores/index";
import { errorToast, successToast } from "@utils/toast";
import { redirect } from "next/navigation";

const LoginCardContainer = ({ toggleAuthMode }: AuthCardProps) => {
	const setUser = userStore((state) => state.setUser);
	const [loading, setLoading] = useState(false);

	const { register, handleSubmit, formState: { errors } } = useForm<AuthLoginType>({
		resolver: zodResolver(LoginSchema)
	});

	const mappedErrors: { [key: string]: string } = {
		'Invalid credentials': 'Credenciais inválidas'
	};

	const onSubmit = useCallback<SubmitHandler<AuthLoginType>>(async (user: AuthLoginType) => {
		setLoading(true);
		const { data, error } = await login(user);

		if (error) {
			setLoading(false);
			errorToast(mappedErrors[error.message] || 'Algo de errado aconteceu, tente novamente.');
			return;
		}

		setUser(data.user);

		setTimeout(() => {
			successToast('Login efetuado com sucesso!');
		}, 1000);

		setLoading(false);
		redirect("/");
	}, []);

	return (
		<LoginCard
			loading={loading}
			register={register}
			handleSubmit={handleSubmit}
			errors={errors}
			onSubmit={onSubmit}
			toggleAuthMode={toggleAuthMode}
		/>
	);
}

export default LoginCardContainer;

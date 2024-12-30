import LoginCard from "./loginCard";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthLoginType, AuthContainerProps } from "@common/interfaces/auth";
import { LoginSchema } from "@common/schemas/auth";
import { login } from "../../processes/auth";
import { useCallback } from "react";

const LoginCardContainer = ({ toggleAuthMode }: AuthContainerProps) => {
	const { register, handleSubmit, formState: { errors } } = useForm<AuthLoginType>({
		resolver: zodResolver(LoginSchema)
	});

	const onSubmit = useCallback<SubmitHandler<AuthLoginType>>(async (user: AuthLoginType) => {
		const { data, error } = await login(user);

		if (error) {
			console.error("Login failed:", error);
			return;
		}

		console.log("Logged in:", data);
	}, []);

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

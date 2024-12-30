import RegisterCard from "./registerCard";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthRegisterType, AuthContainerProps } from "@common/interfaces/auth";
import { RegisterSchema } from "@common/schemas/auth";
import { register as registerUser } from "@processes/auth";
import { useCallback, useState } from "react";
import { errorToast, successToast } from "@utils/toast";

const RegisterCardContainer = ({ toggleAuthMode }: AuthContainerProps) => {
	const [loading, setLoading] = useState(false);

	const { register, handleSubmit, formState: { errors } } = useForm<AuthRegisterType>({
		resolver: zodResolver(RegisterSchema)
	});

	const onSubmit = useCallback<SubmitHandler<AuthRegisterType>>(async (user: AuthRegisterType) => {
		setLoading(true);
		const { data, error } = await registerUser(user);

		if (error) {
			setLoading(false);
			errorToast('Algo de errado aconteceu, tente novamente.');
			return;
		}

		successToast('Cadastro efetuado com sucesso! Por favor, faça login.');

		setLoading(false);

		toggleAuthMode();
	}, []);

	return (
		<RegisterCard
			loading={loading}
			register={register}
			handleSubmit={handleSubmit}
			errors={errors}
			onSubmit={onSubmit}
			toggleAuthMode={toggleAuthMode}
		/>
	);
}

export default RegisterCardContainer
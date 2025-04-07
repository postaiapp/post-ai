'use client';

import { AuthCardProps, AuthLoginType } from '@common/interfaces/auth';
import { LoginSchema } from '@common/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@hooks/useLoginMutation';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import LoginCard from './loginCard';

const LoginCardContainer = ({ toggleAuthMode }: AuthCardProps) => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthLoginType>({
		resolver: zodResolver(LoginSchema),
	});

	const { mutate: loginUser, isPending } = useLoginMutation(router);

	const onSubmit = (data: AuthLoginType) => {
		loginUser(data);
	};

	return (
		<LoginCard
			loading={isPending}
			register={register}
			handleSubmit={handleSubmit}
			errors={errors}
			onSubmit={onSubmit}
			toggleAuthMode={toggleAuthMode}
		/>
	);
};

export default LoginCardContainer;

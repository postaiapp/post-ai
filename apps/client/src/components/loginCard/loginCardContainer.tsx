'use client';

import { AuthLoginType, AuthCardProps } from '@common/interfaces/auth';
import { LoginSchema } from '@common/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@hooks/useLoginMutation';
import { useForm } from 'react-hook-form';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

import LoginCard from './loginCard';

const LoginCardContainer = ({ toggleAuthMode }: AuthCardProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthLoginType>({
		resolver: zodResolver(LoginSchema),
	});

	const { mutate: loginUser, isPending, isSuccess } = useLoginMutation();

	const onSubmit = (data: AuthLoginType) => {
		loginUser(data);
	};

	useEffect(() => {
		if (isSuccess) {
			redirect('/chat');
		}
	}, [isSuccess]);

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

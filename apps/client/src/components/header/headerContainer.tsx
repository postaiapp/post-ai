'use client';

import { useCallback } from 'react';

import { mappedErrors } from '@common/constants/error';
import { InstagramAccountType } from '@common/interfaces/instagramAccount';
import { InstagramAccountSchema } from '@common/schemas/instagramAccount';
import { zodResolver } from '@hookform/resolvers/zod';
import { instagramLogin } from '@processes/instagramAccount';
import { useMutation } from '@tanstack/react-query';
import { errorToast, successToast } from '@utils/toast';
import { SubmitHandler, useForm } from 'react-hook-form';

import Header from './header';

const HeaderContainer = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<InstagramAccountType>({
        resolver: zodResolver(InstagramAccountSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const { mutate: instagramLoginMutate, isPending } = useMutation(instagramLogin, {
        onSuccess: (data) => {
            console.log('Success:', data);
            successToast('Conta adicionada com sucesso');
        },
        onError: (error: Error) => {
            const errorMessage = error?.message || 'Algo de errado aconteceu, tente novamente.';
            errorToast(mappedErrors[errorMessage] || errorMessage);
        },
    });

    const onSubmit = useCallback<SubmitHandler<InstagramAccountType>>(
        (body) => {
            return instagramLoginMutate(body);
        },
        [instagramLoginMutate]
    );

    return (
        <Header
            onSubmit={onSubmit}
            handleSubmit={handleSubmit}
            register={register}
            errors={errors}
            isLoading={isPending}
        />
    );
};

export default HeaderContainer;

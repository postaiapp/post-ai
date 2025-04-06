'use client';

import { UpdateUserData, User } from '@common/interfaces/user';
import { updateUserSchema } from '@common/schemas/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserMutations } from '@hooks/user';
import { getFormattedName } from '@utils/formatName';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import UserDetailsUi from './userDetailsUi';

export default function UserDetailsContainer({ user }: { user: User }) {
    const router = useRouter();
    const { updateUserMutate } = useUserMutations();

    const [activeState, setActiveState] = useState<string>("profile");
    const [firstName, lastName] = useMemo(() => {
    return getFormattedName(user?.name ?? '');
    }, [user?.name]);

    const handleEditState = useCallback((state: string) => {
        setActiveState(state);
    }, []);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<UpdateUserData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            email: user?.email,
            name: user?.name,
            city: user?.city || "",
            country: user?.country || "",
            cpf: user?.cpf || "",
            phone: user?.phone || "",
        },
    });

    const handleCancel = useCallback(() => {
        handleEditState("profile");
        reset();
    }, [handleEditState]);

    const handleUpdateUser = useCallback(async (data: UpdateUserData) => {
        await updateUserMutate.updateUserMutationAsync(data);
        handleCancel();
        location.reload();
    }, [updateUserMutate, router]);


    return (
        <UserDetailsUi
            user={user}
            firstName={firstName}
            lastName={lastName}
            isLoading={updateUserMutate.isUpdateUserPending}
            control={control}
            handleCancel={handleCancel}
            onSubmit={handleSubmit(handleUpdateUser)}
            activeState={activeState}
            handleEditState={handleEditState}
            setActiveState={setActiveState}
            errors={errors}
        />
    );
}

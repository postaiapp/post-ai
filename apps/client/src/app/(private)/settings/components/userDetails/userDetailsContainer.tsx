'use client';

import { UpdateUserData, User } from '@common/interfaces/user';
import { useUserMutations } from '@hooks/user';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import UserDetailsUi from './userDetailsUi';

export default function UserDetailsContainer({ user }: { user: User | null }) {
    const router = useRouter();
    const [activeState, setActiveState] = useState<string>("profile");

    const handleEditState = useCallback((state: string) => {
        setActiveState(state);
    }, []);

    const { control, handleSubmit, reset } = useForm<UpdateUserData>({
        defaultValues: {
            city: user?.city || '',
            country: user?.country || '',
            cpf: user?.cpf || '',
            email: user?.email || '',
            name: user?.name || '',
            phone: user?.phone || '',
        },
    });

    const { updateUserMutate } = useUserMutations();

    const capitalize = (str: string | null) =>
        str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : null;

      const [firstName, lastName] = useMemo(() => {
        const nameParts = user?.name?.split(' ') || [];
        return [capitalize(nameParts[0]), capitalize(nameParts[1] || null)];
      }, [user?.name]);

    const handleUpdateUser = useCallback(async (data: UpdateUserData) => {
        await updateUserMutate.updateUserMutationAsync(data);
        router.back();
    }, [updateUserMutate, router]);

    const handleCancel = useCallback(() => {
        handleEditState("profile");
        reset();
    }, [handleEditState]);

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
        />
    );
}

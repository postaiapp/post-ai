'use client';


import { UpdateUserData, User } from '@common/interfaces/user';
import { useUserMutations } from '@hooks/user';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
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
                city: '',
                country: '',
                cpf: '',
                email: user?.email || '',
                name: user?.name || '',
                phone: '',
            },
    });

    const { updateUserMutate } = useUserMutations();

    const handleUpdateUser = useCallback(async (data: UpdateUserData) => {
		await updateUserMutate.updateUserMutationAsync(data);

		router.back();
	}, [updateUserMutate, router]);

    const handleCancel = useCallback(() => {
        handleEditState("profile");
        reset()
      }, [handleEditState]);

	return (
		<UserDetailsUi
            user={user}
            control={control}
            handleCancel={handleCancel}
            onSubmit={handleSubmit(handleUpdateUser)}
            activeState={activeState}
            handleEditState={handleEditState}
            setActiveState={setActiveState}
		/>
	);
}

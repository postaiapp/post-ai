'use client';

import { useUserMutations } from '@hooks/user';
import { logout } from '@processes/auth';
import userStore from '@stores/userStore';
import { localStorageClear } from '@utils/storage';
import { errorToast } from '@utils/toast';
import { redirect } from 'next/navigation';
import { useCallback, useState } from 'react';
import UserSettingsUi from './userSettingsUi';

export default function UserSettingsContainer() {
	const { user, setUser } = userStore();
	const [activeItem, setActiveItem] = useState('profile');
	const { deleteUserMutate } = useUserMutations();

	const handleLogout = useCallback(async () => {
		try {
			await logout();
		} catch (error) {
			errorToast('Ao tentar sair, algo deu errado. Tente novamente.');
		} finally {
			localStorageClear();
			redirect('/');
		}
	}, [setUser]);

	const handleDeleteAccount = useCallback(async () => {
		await deleteUserMutate.deleteUserMutationAsync();
		await handleLogout();
	}, [deleteUserMutate, handleLogout]);

	return (
		<UserSettingsUi
			user={user!}
			activeItem={activeItem}
			setActiveItem={setActiveItem}
			handleDeleteAccount={handleDeleteAccount}
		/>
	);
}

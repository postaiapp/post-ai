'use client';


import userStore from '@stores/userStore';
import { useCallback } from 'react';
import UserSettingsUi from './userSettingsUi';

export default function UserSettingsContainer() {
	const { user } = userStore();

	const handleDeleteAccount = useCallback(async () => {
		console.log('Delete account');
	}, []);


	return (
		<UserSettingsUi
			user={user}
			handleDeleteAccount={handleDeleteAccount}
		/>
	);
}

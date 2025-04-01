'use client';


import userStore from '@stores/userStore';
import { useCallback, useState } from 'react';
import UserSettingsUi from './userSettingsUi';

export default function UserSettingsContainer() {
	const { user } = userStore();
	const [activeItem, setActiveItem] = useState<string>("profile");

	const handleDeleteAccount = useCallback(async () => {
		console.log('Delete account');
	}, []);


	return (
		<UserSettingsUi
			user={user}
			activeItem={activeItem}
			setActiveItem={setActiveItem}
			handleDeleteAccount={handleDeleteAccount}
		/>
	);
}

'use client';

import { useCallback } from 'react';

import { logout } from '@processes/auth';
import { localStorageClear } from '@utils/storage';
import { redirect } from 'next/navigation';

import userStore from '@stores/userStore';
import { useRouter } from 'next/navigation';
import SidebarFooter from './sidebarFooter';

const SidebarFooterContainer = () => {
	const { user } = userStore();
	const router = useRouter();

	const handleLogout = useCallback(async () => {
		const response = await logout();

		if (response) {
			localStorageClear();
			redirect('/auth');
		}
	}, []);

	const handleNavigateUserDetails = useCallback(() => {
		return router.push(`/settings`);
	}, [user]);

	return <SidebarFooter handleLogout={handleLogout} handleNavigateUserDetails={handleNavigateUserDetails} />;
};

export default SidebarFooterContainer;

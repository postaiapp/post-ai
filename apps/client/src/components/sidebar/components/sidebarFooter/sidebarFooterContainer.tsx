'use client';

import { logout } from '@processes/auth';
import userStore from '@stores/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { localStorageClear } from '@utils/storage';
import { redirect, useRouter } from 'next/navigation';
import { useCallback } from 'react';

import SidebarFooter from './sidebarFooter';

const SidebarFooterContainer = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { user, setUser } = userStore();

	const handleLogout = useCallback(async () => {
		const response = await logout();

		if (response) {
			await queryClient.clear();
			localStorageClear();
			setUser(null);
			redirect('/auth');
		}
	}, [queryClient]);

	const handleNavigateUserDetails = useCallback(() => {
		return router.push(`/settings`);
	}, [user]);

	return (
		<SidebarFooter
			handleLogout={handleLogout}
			handleNavigateUserDetails={handleNavigateUserDetails}
		/>
	);
};

export default SidebarFooterContainer;
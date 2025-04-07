'use client';

import { useCallback } from 'react';

import { logout } from '@processes/auth';
import userStore from '@stores/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { localStorageClear } from '@utils/storage';
import { redirect, useRouter } from 'next/navigation';

import SidebarFooter from './sidebarFooter';

const SidebarFooterContainer = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { setUser } = userStore();

	const handleLogout = useCallback(async () => {
		const response = await logout();

		if (response) {
			await queryClient.clear();
			localStorageClear();
			setUser(null);
			redirect('/auth');
		}
	}, [queryClient, setUser]);

	const handleNavigateUserDetails = useCallback(() => {
		return router.push(`/settings`);
	}, [router]);

	return <SidebarFooter handleLogout={handleLogout} handleNavigateUserDetails={handleNavigateUserDetails} />;
};

export default SidebarFooterContainer;

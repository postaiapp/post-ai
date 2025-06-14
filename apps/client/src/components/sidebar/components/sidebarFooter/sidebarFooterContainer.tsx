'use client';

import { useCallback, useMemo } from 'react';

import userStore from '@stores/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { getFormattedName } from '@utils/formatName';
import { localStorageClear } from '@utils/storage';
import { redirect, useRouter } from 'next/navigation';

import SidebarFooter from './sidebarFooter';

const SidebarFooterContainer = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { setUser, user } = userStore();

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [firstName, _] = useMemo(() => {
		return getFormattedName(user?.name ?? '');
	}, [user?.name]);

	const handleLogout = useCallback(async () => {
		queryClient.clear();
		localStorageClear();
		setUser(null);
		redirect('/auth');
	}, [queryClient, setUser]);

	const handleNavigateUserDetails = useCallback(() => {
		return router.push(`/settings`);
	}, [router]);

	return (
		<SidebarFooter
			handleLogout={handleLogout}
			handleNavigateUserDetails={handleNavigateUserDetails}
			userName={firstName}
		/>
	);
};

export default SidebarFooterContainer;

import { useCallback } from 'react';

import { logout } from '@processes/auth';
import { localStorageClear } from '@utils/storage';
import { redirect } from 'next/navigation';

import SidebarFooter from './sidebarFooter';

const SidebarFooterContainer = () => {
	const handleLogout = useCallback(async () => {
		const response = await logout();

		if (response) {
			localStorageClear();
			redirect('/auth');
		}
	}, []);

	return <SidebarFooter handleLogout={handleLogout} />;
};

export default SidebarFooterContainer;

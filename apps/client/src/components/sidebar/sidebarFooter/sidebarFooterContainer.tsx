import { useCallback } from 'react';

import { localStorageClear } from '@utils/storage';
import { redirect } from 'next/navigation';
import { useCookies } from 'next-client-cookies';

import SidebarFooter from './sidebarFooter';

const SidebarFooterContainer = () => {
	const cookies = useCookies();

	const handleLogout = useCallback(() => {
		localStorageClear();
		cookies.remove('session');
		redirect('/auth');
	}, [cookies]);

	return <SidebarFooter handleLogout={handleLogout} />;
};

export default SidebarFooterContainer;

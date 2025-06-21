'use client';

import userStore from '@stores/userStore';
import { useRouter } from 'next/navigation';

import { UserPlatform } from '@/common/interfaces/user-platforms';

import Header from './header';

import { successToast } from '@/utils/toast';

const HeaderContainer = () => {
	const { user, logout, setUser } = userStore();
	const router = useRouter();

	const handleLogout = () => {
		router.push('/auth');

		setTimeout(() => {
			logout();

			localStorage.clear();

			successToast('Deslogado com sucesso');
		}, 1000);
	};

	const handleSelectPlatform = (platform: UserPlatform) => {
		if (!user) return;

		setUser({
			...user,
			selected_platform: platform,
		});
	};

	const goToEditProfile = () => {
		router.push('/settings');
	};

	return (
		<Header
			accounts={user?.user_platforms || []}
			selectedAccount={user?.user_platforms?.[0]}
			handleLogout={handleLogout}
			handleSelectPlatform={handleSelectPlatform}
			goToEditProfile={goToEditProfile}
		/>
	);
};

export default HeaderContainer;

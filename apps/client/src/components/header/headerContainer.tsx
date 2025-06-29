'use client';

import { useState } from 'react';

import PlatformConnectionModal from '@components/modals/platformConnectionModal';
import userStore from '@stores/userStore';
import { useRouter } from 'next/navigation';

import { UserPlatform } from '@/common/interfaces/user-platforms';
import { useDisconnectPlatformMutation } from '@/hooks/usePlatformMutation';

import Header from './header';

import { successToast } from '@/utils/toast';

const HeaderContainer = () => {
	const { user, logout, setUser } = userStore();
	const router = useRouter();
	const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
	const disconnectPlatformMutation = useDisconnectPlatformMutation();

	const handleLogout = () => {
		router.push('/auth');

		setTimeout(() => {
			logout();

			localStorage.clear();

			successToast('Deslogado com sucesso');
		}, 1000);
	};

	const handleSelectUserPlatform = (platform: UserPlatform) => {
		if (!user) return;

		setUser({
			...user,
			selected_platform: platform,
		});
	};

	const handleDisconnectPlatform = (userPlatform: UserPlatform) => {
		userPlatform.loading = true;

		disconnectPlatformMutation.mutate(userPlatform.id);
	};

	const goToEditProfile = () => {
		router.push('/settings');
	};

	return (
		<>
			<Header
				accounts={user?.user_platforms || []}
				selectedAccount={user?.selected_platform || user?.user_platforms?.[0]}
				handleLogout={handleLogout}
				handleSelectPlatform={handleSelectUserPlatform}
				goToEditProfile={goToEditProfile}
				openPlatformModal={() => setIsPlatformModalOpen(true)}
				handleDisconnectPlatform={handleDisconnectPlatform}
			/>
			<PlatformConnectionModal isOpen={isPlatformModalOpen} onClose={() => setIsPlatformModalOpen(false)} />
		</>
	);
};

export default HeaderContainer;

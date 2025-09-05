import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { UserPlatform } from '@/common/interfaces/user-platforms';
import { useDisconnectPlatformMutation } from '@/hooks/usePlatformMutation';

import PlatformSelectUI from './PlatformSelectUI';

import PlatformConnectionModal from '@/components/modals/platformConnectionModal';
import { getUserPlatforms } from '@/processes/post';

const PlatformSelect = ({ onSelectPlatform }: { onSelectPlatform: (userPlatform: UserPlatform) => void }) => {
	const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
	const [selectedPlatform, setSelectedPlatform] = useState<UserPlatform | null>(null);

	const disconnectPlatformMutation = useDisconnectPlatformMutation();

	const handleDisconnectPlatform = (userPlatform: UserPlatform) => {
		userPlatform.loading = true;

		disconnectPlatformMutation.mutate(userPlatform.id);
	};

	const { data: userPlatforms } = useQuery({
		queryKey: ['user-platforms'],
		queryFn: getUserPlatforms,
		staleTime: 5 * 60 * 1000,
	});

	const handlePlatformSelected = (userPlatform: UserPlatform) => {
		onSelectPlatform(userPlatform);

		setSelectedPlatform(userPlatform);
	};

	return (
		<>
			<PlatformSelectUI
				userPlatforms={userPlatforms?.data?.data || []}
				handleDisconnectPlatform={handleDisconnectPlatform}
				openPlatformModal={() => setIsPlatformModalOpen(true)}
				onSelectPlatform={handlePlatformSelected}
				selectedPlatform={selectedPlatform}
			/>
			<PlatformConnectionModal isOpen={isPlatformModalOpen} onClose={() => setIsPlatformModalOpen(false)} />
		</>
	);
};

export default PlatformSelect;

import { useState, useEffect, useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { UserPlatform } from '@/common/interfaces/user-platforms';
import { useDisconnectPlatformMutation } from '@/hooks/usePlatformMutation';

import PlatformSelectUI from './PlatformSelectUI';

import PlatformConnectionModal from '@/components/modals/platformConnectionModal';
import { getUserPlatforms } from '@/processes/post';

const PlatformSelect = ({ onSelectPlatform }: { onSelectPlatform: (userPlatform: UserPlatform | null) => void }) => {
	const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
	const [selectedPlatform, setSelectedPlatform] = useState<UserPlatform | null>(null);

	const disconnectPlatformMutation = useDisconnectPlatformMutation();

	const handleDisconnectPlatform = (userPlatform: UserPlatform) => {
		userPlatform.loading = true;

		disconnectPlatformMutation.mutate(userPlatform.id);
	};

	const handlePlatformSelected = (userPlatform: UserPlatform | null) => {
		onSelectPlatform(userPlatform);

		setSelectedPlatform(userPlatform);
	};

	const { data: userPlatforms } = useQuery({
		queryKey: ['user-platforms'],
		queryFn: getUserPlatforms,
		staleTime: 5 * 60 * 1000,
	});

	useEffect(() => {
		if (userPlatforms?.data?.data?.length && !selectedPlatform) {
			handlePlatformSelected(userPlatforms.data.data[0]);
		}
	}, [userPlatforms?.data?.data, selectedPlatform]);

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

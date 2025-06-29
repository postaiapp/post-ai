'use client';

import { useCallback, useState } from 'react';

import { useRouter } from 'next/navigation';

import Home from './home';

export default function HomeContainer() {
	const router = useRouter();
	const [selectedPlatform, setSelectedPlatform] = useState<number>(1);

	const handleNavigateChat = useCallback(() => {
		console.log('Navigating to chat...');
		router.push('/chat');
	}, [router]);

	return (
		<Home
			handleNavigateChat={handleNavigateChat}
			selectedPlatform={selectedPlatform}
			setSelectedPlatform={setSelectedPlatform}
		/>
	);
}

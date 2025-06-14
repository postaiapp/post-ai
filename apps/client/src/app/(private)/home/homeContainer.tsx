'use client';

import { useCallback } from 'react';

import { useRouter } from 'next/navigation';

import Home from './home';

export default function HomeContainer() {
	const router = useRouter();

	const handleNavigateChat = useCallback(() => {
		console.log('Navigating to chat...');
		router.push('/chat');
	}, [router]);

	return <Home handleNavigateChat={handleNavigateChat} />;
}

'use client';

import { useState } from 'react';

import { userStore } from '@stores/index';

import Home from './home';

export default function HomeContainer() {
	const [selectedPlatform, setSelectedPlatform] = useState<number>(1);
	const { user } = userStore();
	const accounts = user?.user_platforms || [];

	const handleDisconnectPlatform = (account: any) => {
		// Implementar lógica de desconexão
		console.log('Desconectar plataforma:', account);
	};

	const openPlatformModal = () => {
		// Implementar abertura do modal
		console.log('Abrir modal de plataforma');
	};

	return (
		<Home 
			selectedPlatform={selectedPlatform} 
			setSelectedPlatform={setSelectedPlatform}
			accounts={accounts}
			handleDisconnectPlatform={handleDisconnectPlatform}
			openPlatformModal={openPlatformModal}
		/>
	);
}

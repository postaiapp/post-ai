'use client';

import { useState } from 'react';

import Home from './home';

export default function HomeContainer() {
	const [selectedPlatform, setSelectedPlatform] = useState<number>(1);

	return <Home selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform} />;
}

'use client';

import { useSearchParams } from 'next/navigation';

import UserSettingsUi from './userSettingsUi';

export default function UserSettingsContainer() {
	const searchParams = useSearchParams();
	const userId = decodeURIComponent(searchParams.get('userId') || '');

	return (
		<UserSettingsUi
		/>
	);
}

'use client';

import { useEffect, useState } from 'react';

import { Loading } from '@components/loading/loading';
import { localStorageGetKey } from '@utils/storage';
import { redirect } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

	useEffect(() => {
		const token = localStorageGetKey('token');
		const publicRoutes = ['/auth'];
		const privateRoutes = ['/history', '/post-details', '/chat', '/settings'];

		const currentPath = window.location.pathname;

		if (!token && privateRoutes.includes(currentPath)) {
			return redirect('/auth');
		}

		if (token && publicRoutes.includes(currentPath)) {
			redirect('/chat');
		}

		setIsAuthenticated(!!token);
	}, []);

	if (isAuthenticated === null) {
		return (
			<div className="flex items-center justify-center w-full h-screen">
				<Loading />
			</div>
		);
	}

	return <>{children}</>;
}

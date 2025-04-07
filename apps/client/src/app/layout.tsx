import { Suspense } from 'react';

import AuthGuard from '@common/guards/auth-guard';
import Store from '@lib/react-query';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
	variable: '--font-plus-jakarta',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Post-ai',
	description:
		'Crie posts incríveis para Instagram com IA, de forma automática e criativa. Simples, rápido e eficiente!',
	icons: {
		icon: '/logo.ico',
	},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR" className="scroll-smooth">
			<body className={`${plusJakarta.variable} font-sans antialiased bg-white text-neutral-900`}>
				<Suspense>
					<Store>
						<AuthGuard>{children}</AuthGuard>
					</Store>
				</Suspense>
			</body>
		</html>
	);
}

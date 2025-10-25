import React from 'react';

import { itemsHome } from '@common/constants/home';
import { Button } from '@components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => (
	<header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-6xl">
		<div className="glass-card-rounded-full shadow-glass border border-white/20 backdrop-blur-xl">
			<div className="flex justify-between p-4 items-center">
				<div className="flex items-center gap-3">
					<div className="relative">
						<Image src={'/logo.png'} width={40} height={40} alt="Logo" className="rounded-full" />
						<div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full blur opacity-30"></div>
					</div>
					<h2 className="text-xl font-bold gradient-text">Post AI</h2>
				</div>

				<nav className="hidden md:flex gap-8 items-center">
					{itemsHome.map(item => (
						<Link
							href={item.href}
							key={item.label}
							className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 hover:scale-105 transform"
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-4">
					<Link href="/auth" className="hidden sm:block">
						<Button
							variant="ghost"
							className="text-gray-700 hover:text-purple-600 font-medium rounded-full"
						>
							Entrar
						</Button>
					</Link>
					<Link href="/auth">
						<Button className="glass-button text-white font-semibold px-6 py-2 hover:scale-105 transform transition-all duration-200 rounded-full">
							Começar Grátis
						</Button>
					</Link>
				</div>
			</div>
		</div>
	</header>
);

export default Header;

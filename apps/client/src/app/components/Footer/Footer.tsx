import React from 'react';

import { cn } from '@lib/utils';
import { fullYear } from '@utils/date';
import { Mail, MapPin, Github, Twitter, Linkedin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { wrapper } from '../wrapper';

const Footer = () => {
	return (
		<footer className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
			{/* Gradient transition from top */}
			<div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-purple-200/50 via-purple-400/30 to-transparent"></div>
			<div className={cn('py-16 relative z-10', wrapper)}>
				<div className="grid md:grid-cols-4 gap-8 mb-12">
					{/* Logo and Description */}
					<div className="glass-card p-6 rounded-modern shadow-glass bg-gradient-to-br from-white/20 via-white/10 to-purple-900/20">
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<div className="relative">
									<Image
										src={'/logo.png'}
										width={40}
										height={40}
										alt="Logo"
										className="rounded-full"
									/>
									<div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full blur opacity-30"></div>
								</div>
								<h3 className="text-xl font-bold text-white">Post AI</h3>
							</div>
							<p className="text-purple-100 text-sm leading-relaxed">
								Automatize seus posts e economize horas toda semana.
							</p>
							<div className="flex gap-3">
								<div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:scale-110 transition-transform duration-200 cursor-pointer">
									<Github className="w-4 h-4 text-white" />
								</div>
								<div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-110 transition-transform duration-200 cursor-pointer">
									<Twitter className="w-4 h-4 text-white" />
								</div>
								<div className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-110 transition-transform duration-200 cursor-pointer">
									<Linkedin className="w-4 h-4 text-white" />
								</div>
							</div>
						</div>
					</div>

					{/* Post AI Links */}
					<div className="glass-card p-6 rounded-modern shadow-glass bg-gradient-to-br from-white/20 via-white/10 to-purple-900/20">
						<div className="space-y-4">
							<h4 className="font-semibold text-white">Post AI</h4>
							<div className="space-y-2">
								<Link
									href="/auth"
									className="block text-purple-100 hover:text-white transition-colors duration-200 text-sm"
								>
									Fazer login
								</Link>
								<Link
									href="/auth"
									className="block text-purple-100 hover:text-white transition-colors duration-200 text-sm"
								>
									Criar conta
								</Link>
								<Link
									href="#features"
									className="block text-purple-100 hover:text-white transition-colors duration-200 text-sm"
								>
									Funcionalidades
								</Link>
								<Link
									href="#pricing"
									className="block text-purple-100 hover:text-white transition-colors duration-200 text-sm"
								>
									Planos
								</Link>
							</div>
						</div>
					</div>

					{/* Links */}
					<div className="glass-card p-6 rounded-modern shadow-glass bg-gradient-to-br from-white/20 via-white/10 to-purple-900/20">
						<div className="space-y-4">
							<h4 className="font-semibold text-white">Links</h4>
							<div className="space-y-2">
								<Link
									href="#"
									className="block text-purple-100 hover:text-white transition-colors duration-200 text-sm"
								>
									Termos e condições
								</Link>
								<Link
									href="#"
									className="block text-purple-100 hover:text-white transition-colors duration-200 text-sm"
								>
									Política de privacidade
								</Link>
								<Link
									href="#"
									className="block text-purple-100 hover:text-white transition-colors duration-200 text-sm"
								>
									Blog
								</Link>
							</div>
						</div>
					</div>

					{/* Contact */}
					<div className="glass-card p-6 rounded-modern shadow-glass bg-gradient-to-br from-white/20 via-white/10 to-purple-900/20">
						<div className="space-y-4">
							<h4 className="font-semibold text-white">Contato</h4>
							<div className="space-y-3">
								<div className="flex items-center gap-2 text-purple-100 text-sm">
									<Mail className="w-4 h-4" />
									<span>ajuda@postai.com</span>
								</div>
								<div className="flex items-center gap-2 text-purple-100 text-sm">
									<MapPin className="w-4 h-4" />
									<span>Brasil</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Copyright Bar */}
				<div className="glass-card p-6 rounded-modern shadow-glass bg-gradient-to-br from-white/20 via-white/10 to-purple-900/20">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<p className="text-sm text-purple-100">
							© Copyright {fullYear}, All Rights Reserved by Post AI
						</p>
						<div className="flex items-center gap-6 text-sm">
							<Link href="#" className="text-purple-100 hover:text-white transition-colors duration-200">
								Termos
							</Link>
							<Link href="#" className="text-purple-100 hover:text-white transition-colors duration-200">
								Privacidade
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;

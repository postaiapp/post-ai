'use client';
import React from 'react';

import { Button } from '@components/ui/button';
import { motion } from 'motion/react';
import Image from 'next/image';
import './styles.css';

const Hero = () => {
	return (
		<section
			className="relative min-h-screen flex items-center justify-center overflow-hidden w-full pb-20"
			id="home"
		>
			{/* Background Elements */}
			<div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-purple-25 to-purple-10 w-full"></div>
			<div className="absolute inset-0 bg-gradient-to-t from-white via-purple-5 to-transparent w-full"></div>
			<div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
			<div className="absolute top-40 right-10 w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
			<div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>

			<div className="relative z-10 flex justify-center flex-col items-center w-full space-y-12 pt-32">
				<motion.div
					className="text-center space-y-6"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h1 className="text-6xl md:text-8xl font-extrabold leading-tight">
						<span className="gradient-text">Nunca foi tão</span>
						<br />
						<span className="gradient-text italic">tranquilo</span>
						<br />
						<span className="text-gray-800">automatizar posts</span>
					</h1>

					<p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
						<strong>Economize horas por semana</strong> criando posts profissionais sem saber design.
						<strong> Gere conteúdo</strong> que vende enquanto você foca no que importa: seu negócio.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center">
						<Button 
							className="glass-button rounded-button text-white font-semibold px-8 py-4 text-lg hover:scale-105 transform transition-all duration-200 shadow-glow"
							onClick={() => {
								// Armazenar o planKey do Pro (mais popular) no localStorage
								localStorage.setItem('selectedPlan', 'pro');
								// Redirecionar para a página de login
								window.location.href = '/auth';
							}}
						>
							Começar Grátis
						</Button>
						<Button
							variant="outline"
							className="glass rounded-button border-purple-200 text-purple-700 font-semibold px-8 py-4 text-lg hover:scale-105 transform transition-all duration-200"
						>
							Ver Demonstração
						</Button>
					</div>
				</motion.div>

				<motion.div
					className="relative"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 1, delay: 0.5 }}
				>
					<div className="glass-card p-8 rounded-modern shadow-glass">
						<Image
							src="/lp/platform-preview.svg"
							width={1200}
							height={500}
							alt="Plataforma Post AI"
							className="rounded-card"
						/>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default Hero;

'use client';
import { homeImagesInfo } from '@common/constants/home';
import { cn } from '@lib/utils';
import { QrCode, Palette, Zap, Shield, Users, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

import TypingAnimation from '../TypingAnimation/TypingAnimation';
import { wrapper } from '../wrapper';

const features = [
	{
		icon: Zap,
		title: 'Automação Inteligente',
		description:
			'Gere posts automaticamente com IA, economize horas de trabalho criativo e mantenha sua presença nas redes sociais.',
		gradient: 'from-blue-500 to-cyan-500',
	},
	{
		icon: Palette,
		title: 'Criação Visual',
		description:
			'Crie imagens incríveis com IA, personalize com sua marca e mantenha consistência visual em todos os posts.',
		gradient: 'from-purple-500 to-fuchsia-500',
	},
	{
		icon: BarChart3,
		title: 'Agendamento Inteligente',
		description:
			'Agende posts para os melhores horários, publique em múltiplas plataformas e otimize seu engajamento.',
		gradient: 'from-green-500 to-emerald-500',
	},
	{
		icon: Users,
		title: 'Múltiplas Plataformas',
		description:
			'Conecte Instagram, Facebook, Twitter e LinkedIn. Gerencie todas as suas redes sociais em um só lugar.',
		gradient: 'from-orange-500 to-red-500',
	},
	{
		icon: QrCode,
		title: 'Magic Prompt',
		description: 'Nossa IA entende seu estilo e melhora automaticamente seus textos para maximizar o engajamento.',
		gradient: 'from-indigo-500 to-purple-500',
	},
	{
		icon: Shield,
		title: 'Segurança Total',
		description: 'Seus dados e contas estão protegidos com criptografia de ponta e autenticação segura.',
		gradient: 'from-pink-500 to-rose-500',
	},
];

const Features = () => (
	<motion.section
		className="py-20 bg-gradient-to-b from-purple-10 to-white w-full"
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		transition={{ duration: 0.5 }}
		id="features"
	>
		<div className={wrapper}>
			<motion.div
				className="text-center space-y-4 mb-16"
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8 }}
			>
				<h2 className="text-5xl md:text-6xl font-bold">
					<span className="gradient-text">
						<TypingAnimation text="Tudo o que você precisa" speed={80} className="gradient-text" />
					</span>
					<br />
					<span className="text-gray-800">e muito mais.</span>
				</h2>
			</motion.div>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{features.map((feature, index) => {
					const Icon = feature.icon;
					return (
						<motion.div
							key={feature.title}
							className="glass-card p-8 rounded-modern shadow-glass hover:shadow-glow transition-all duration-300 hover:scale-105 group"
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
						>
							<div className="space-y-6">
								<div className={cn('p-4 rounded-full bg-gradient-to-r w-fit', feature.gradient)}>
									<Icon className="w-8 h-8 text-white" />
								</div>

								<div className="space-y-3">
									<h3 className="text-2xl font-bold text-gray-800 group-hover:gradient-text transition-all duration-300">
										{feature.title}
									</h3>
									<p className="text-gray-600 leading-relaxed">{feature.description}</p>
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Original Features Section */}
			<div className="mt-20 space-y-16">
				{homeImagesInfo.map((item, index) => (
					<motion.div
						className="flex flex-col lg:flex-row items-center gap-16 justify-center"
						key={item.title}
						initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: index * 0.2 }}
					>
						<div
							className={cn(
								'glass-card p-8 rounded-modern shadow-glass',
								index % 2 === 0 ? 'order-2' : 'order-1'
							)}
						>
							<Image
								src={item.image}
								width={600}
								height={512}
								alt={`Imagem da plataforma ${item.title}`}
								className="rounded-card"
							/>
						</div>
						<motion.div
							className={cn('flex flex-col gap-6 max-w-lg', index % 2 === 0 ? 'order-1' : 'order-2')}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.3 }}
						>
							<h3 className="font-bold text-4xl md:text-5xl gradient-text">{item.title}</h3>
							<p className="text-lg text-gray-600 leading-relaxed">{item.description}</p>
						</motion.div>
					</motion.div>
				))}
			</div>
		</div>
	</motion.section>
);

export default Features;

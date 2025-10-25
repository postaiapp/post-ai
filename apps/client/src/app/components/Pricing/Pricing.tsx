'use client';
import React from 'react';

import { Button } from '@components/ui/button';
import { cn } from '@lib/utils';
import { Check, Star, Zap, Rocket, Gem } from 'lucide-react';
import { motion } from 'motion/react';

import { wrapper } from '../wrapper';

const pricingPlans = [
	{
		name: 'Post AI Starter',
		price: 'R$ 27,90',
		period: '/mês',
		description: 'Automatize seus posts e economize horas toda semana.',
		detailedDescription:
			'Perfeito para quem quer simplificar a rotina nas redes sociais. O Starter traz automação de postagens, criação de imagens com IA e legendas inteligentes, além de agendamento rápido.',
		icon: Zap,
		features: [
			'50 posts por mês',
			'Criação automática de imagens e legendas',
			'Agendamento e publicação automática',
			'Personalização com logo e cores da empresa',
			'Acesso ao Magic Prompt básico',
			'7 dias grátis de teste',
		],
		limitations: ['Sem criação de Reels e carrosséis', 'Sem biblioteca de vídeos', 'Sem geração em massa de posts'],
		popular: false,
		gradient: 'from-blue-500 to-cyan-500',
		planKey: 'starter',
	},
	{
		name: 'Post AI Pro',
		price: 'R$ 69,00',
		period: '/mês',
		description: 'Seu assistente completo de conteúdo para redes sociais.',
		detailedDescription:
			'Ideal para criadores e pequenas agências que querem mais velocidade e criatividade. O Pro traz automação inteligente com criação de carrosséis e Reels, além de geração de posts em massa para a semana.',
		icon: Rocket,
		features: [
			'150 posts por mês',
			'Reels e animações automáticas',
			'Criação em massa (selecione 1 semana e gere todos os posts)',
			'Magic Prompt avançado (melhora automaticamente o texto do usuário)',
			'Agendamento completo e publicação imediata',
			'Estatísticas básicas de engajamento',
		],
		limitations: ['Sem biblioteca de vídeos', 'Sem relatórios automáticos via WhatsApp'],
		popular: true,
		gradient: 'from-purple-500 to-fuchsia-500',
		planKey: 'pro',
	},
	{
		name: 'Post AI Premium',
		price: 'R$ 99,00',
		period: '/mês',
		description: 'Automação total de marketing e mídia social para empresas.',
		detailedDescription:
			'Tenha uma experiência completa com automação de conteúdo, métricas avançadas e relatórios inteligentes. O Premium foi criado para empresas e agências que precisam de escala, desempenho e inteligência de conteúdo.',
		icon: Gem,
		features: [
			'300 posts por mês',
			'Reels, carrosséis e vídeos curtos automáticos',
			'Biblioteca de vídeos integrada',
			'Geração em massa (posts diários automáticos)',
			'Magic Prompt Pro (otimiza texto e estilo com IA)',
			'Relatórios semanais de desempenho via WhatsApp',
			'Suporte prioritário',
		],
		limitations: [],
		popular: false,
		gradient: 'from-amber-500 to-orange-500',
		planKey: 'premium',
	},
];

const Pricing = () => (
	<section id="pricing" className="py-20 bg-gradient-to-b from-white to-purple-50/30">
		<div className={cn('space-y-16', wrapper)}>
			<motion.div
				className="text-center space-y-4"
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8 }}
			>
				<h2 className="text-5xl md:text-6xl font-bold">
					<span className="gradient-text">Escolha o plano</span>
					<br />
					<span className="text-gray-800">ideal para você</span>
				</h2>
				<p className="text-xl text-gray-600 max-w-3xl mx-auto">
					Comece grátis e evolua conforme sua necessidade. Todos os planos incluem teste de 7 dias.
				</p>
				<div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
					<Star className="w-4 h-4 fill-current" />7 dias grátis
				</div>
				<p className="text-sm text-gray-500">Cancele quando quiser, sem compromisso.</p>
			</motion.div>

			<div className="grid md:grid-cols-3 gap-8">
				{pricingPlans.map((plan, index) => {
					const Icon = plan.icon;
					return (
						<motion.div
							key={plan.name}
							className={cn(
								'relative glass-card p-8 rounded-modern shadow-glass hover:shadow-glow transition-all duration-300 hover:scale-105',
								plan.popular && 'ring-2 ring-purple-300 shadow-glow'
							)}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: index * 0.2 }}
						>
							{plan.popular && (
								<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
									<div className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
										Mais Popular
									</div>
								</div>
							)}

							<div className="flex flex-col h-full">
								<div className="space-y-6 flex-grow">
									<div className="flex items-center gap-3">
										<div className={cn('p-3 rounded-full bg-gradient-to-r', plan.gradient)}>
											<Icon className="w-6 h-6 text-white" />
										</div>
										<div>
											<h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
											<p className="text-gray-600">{plan.description}</p>
										</div>
									</div>

									<div className="space-y-2">
										<div className="flex items-baseline gap-2">
											<span className="text-4xl font-bold gradient-text">{plan.price}</span>
											<span className="text-gray-500">{plan.period}</span>
										</div>
										<p className="text-sm text-gray-600">{plan.detailedDescription}</p>
									</div>

									<div className="space-y-4">
										<div>
											<h4 className="font-semibold text-gray-800 mb-3">Recursos incluídos:</h4>
											<ul className="space-y-2">
												{plan.features.map((feature, idx) => (
													<li key={idx} className="flex items-start gap-3">
														<Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
														<span className="text-gray-700 text-sm">{feature}</span>
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>

								<div className="mt-auto pt-6">
									<Button
										className={cn(
											'w-full rounded-button font-semibold py-3 transition-all duration-200',
											plan.popular
												? 'glass-button text-white hover:scale-105 transform'
												: 'glass-button text-white hover:scale-105 transform'
										)}
										onClick={() => {
											localStorage.setItem('selectedPlan', plan.planKey);

											window.location.href = '/auth';
										}}
									>
										{plan.popular ? 'Começar Agora' : 'Escolher Plano'}
									</Button>
								</div>
							</div>
						</motion.div>
					);
				})}
			</div>

			<motion.div
				className="text-center space-y-4"
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8, delay: 0.4 }}
			>
				<h3 className="text-3xl font-bold text-gray-800">Pronto para começar?</h3>
				<p className="text-xl text-gray-600">Transforme sua presença nas redes sociais hoje mesmo.</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
					<Button 
						className="glass-button rounded-button text-white font-semibold px-8 py-4 hover:scale-105 transform transition-all duration-200"
						onClick={() => {
							localStorage.setItem('selectedPlan', 'pro');

							window.location.href = '/auth';
						}}
					>
						Começar Teste Grátis
					</Button>
					<Button
						variant="outline"
						className="glass rounded-button border-purple-200 text-purple-700 font-semibold px-8 py-4 hover:scale-105 transform transition-all duration-200"
					>
						Ver Demonstração
					</Button>
				</div>
			</motion.div>
		</div>
	</section>
);

export default Pricing;

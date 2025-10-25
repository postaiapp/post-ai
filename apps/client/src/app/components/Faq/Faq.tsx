'use client';
import React from 'react';

import { faqItems } from '@common/constants/home';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { cn } from '@lib/utils';
import { HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

import { wrapper } from '../wrapper';

const Faq = () => (
	<section id="faq" className="py-20 bg-gradient-to-b from-white via-purple-50/50 to-purple-200/30">
		<div className={cn('flex flex-col gap-y-12 justify-center items-center', wrapper)}>
			<motion.div
				className="relative space-y-4 text-center"
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8 }}
			>
				<div className="relative inline-block">
					<Image
						className="absolute -top-4 -right-8 rotate-[40deg]"
						src="/lp/highlight-vector.svg"
						width={70}
						height={70}
						alt="Ícone de highlight"
					/>
					<div className="glass-card p-6 rounded-modern shadow-glass">
						<div className="flex items-center gap-3 mb-4">
							<div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500">
								<HelpCircle className="w-6 h-6 text-white" />
							</div>
							<h3 className="font-bold text-4xl md:text-5xl gradient-text">Perguntas Frequentes</h3>
						</div>
						<motion.p
							initial={{ opacity: 0, y: -20 }}
							whileInView={{ opacity: 1, y: 0, transition: { delay: 0.8 } }}
							className="text-gray-600 text-lg"
						>
							Não encontrou a resposta aqui?{' '}
							<span className="text-purple-600 font-semibold underline cursor-pointer hover:text-purple-700 transition-colors">
								Entre em contato
							</span>
							.
						</motion.p>
					</div>
				</div>
			</motion.div>

			<motion.div
				className="max-w-4xl w-full"
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.8, delay: 0.2 }}
			>
				<div className="glass-card p-8 rounded-modern shadow-glass">
					<Accordion type="single" collapsible className="space-y-2">
						{faqItems.map((item, index) => (
							<motion.div
								key={item.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
							>
								<AccordionItem value={item.title} className="border-b border-gray-100 last:border-b-0">
									<AccordionTrigger className="font-semibold text-gray-800 hover:text-purple-600 transition-colors duration-200 text-left py-4">
										{item.title}
									</AccordionTrigger>
									<AccordionContent className="text-gray-600 leading-relaxed pb-4">
										{item.description}
									</AccordionContent>
								</AccordionItem>
							</motion.div>
						))}
					</Accordion>
				</div>
			</motion.div>
		</div>
	</section>
);

export default Faq;

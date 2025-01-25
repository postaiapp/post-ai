'use client';
import React from 'react';

import { faqItems } from '@common/constants/home';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@components/ui/accordion';
import { cn } from '@lib/utils';
import { motion } from 'motion/react';
import Image from 'next/image';

import { wrapper } from '../wrapper';

const Faq = () => (
    <section id="faq" className={cn(wrapper, 'flex flex-col gap-y-8 justify-center items-center my-16')}>
        <div className="relative space-y-2 text-center">
            <Image
                className="absolute -top-0 -right-14   rotate-[40deg]"
                src="/lp/highlight-vector.svg"
                width={70}
                height={70}
                alt="Ícone de highlight"
            />
            <h3 className="font-bold text-[40px] text-blue-dark">Perguntas Frequentes</h3>
            <motion.p
                initial={{ opacity: 0, y: -50 }}
                whileInView={{ opacity: 1, y: 0, transition: { delay: 0.8 } }}
                className="text-sm"
            >
                Não encontrou a resposta aqui? <span className="underline">Entre em contato</span>.
            </motion.p>
        </div>

        <div className="max-w-[800px] w-full">
            <Accordion type="single" collapsible className="text-blue-dark">
                {faqItems.map((item) => (
                    <AccordionItem value={item.title} key={item.title}>
                        <AccordionTrigger className="font-semibold">{item.title}</AccordionTrigger>
                        <AccordionContent>{item.description}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    </section>
);

export default Faq;

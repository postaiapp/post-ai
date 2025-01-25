'use client';
import { homeImagesInfo } from '@common/constants/home';
import { cn } from '@lib/utils';
import { motion } from 'motion/react';
import Image from 'next/image';

import { wrapper } from '../wrapper';

const Features = () => (
    <motion.section
        className={cn('space-y-16', wrapper)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        id="features"
    >
        {homeImagesInfo.map((item, index) => (
            <motion.span
                className="flex items-center gap-16 justify-center"
                key={item.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
            >
                <Image
                    src={item.image}
                    width={600}
                    height={512}
                    alt={`Imagem da plataforma ${item.title}`}
                    className={cn(index % 2 === 0 ? 'order-2' : 'order-1')}
                />
                <motion.span
                    className={cn('flex flex-col gap-4', index % 2 === 0 ? 'order-1' : 'order-2')}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.3 }}
                >
                    <h3 className="font-bold text-[40px] text-blue-dark">{item.title} </h3>
                    <p>{item.description}</p>
                </motion.span>
            </motion.span>
        ))}
    </motion.section>
);

export default Features;

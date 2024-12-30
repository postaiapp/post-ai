"use client";
import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@components/ui/accordion";
import { cn } from "@lib/utils";
import { motion } from "motion/react";
import Image from "next/image";

import { wrapper } from "../wrapper";

const Faq = () => {
  const items = [
    {
      title: "Como funciona o gerador de posts com IA?",
      description:
        "Nosso gerador utiliza inteligência artificial para criar imagens personalizadas e legendas alinhadas com a identidade da sua marca. Basta inserir palavras-chave ou informações sobre o post, e nossa IA faz o resto!"
    },
    {
      title: "Posso conectar mais de uma conta de rede social?",
      description:
        "Sim! Atualmente, você pode integrar várias contas do Instagram. Em breve, adicionaremos suporte para outras redes sociais."
    },
    {
      title: "É possível agendar posts para diferentes horários?",
      description:
        "Sim! Você pode agendar múltiplos posts com datas e horários distintos, otimizando sua presença online."
    },
    {
      title: "A plataforma é responsiva?",
      description:
        "No momento, nossa plataforma foi projetada para uso em desktop. Estamos trabalhando para tornar a experiência igualmente fluida em dispositivos móveis."
    },
    {
      title: "Preciso de habilidades de design para usar a plataforma?",
      description:
        "Não! A ferramenta é simples e intuitiva, ideal para pessoas sem experiência prévia em design gráfico."
    },
    {
      title: "Existe um período de teste gratuito?",
      description:
        "Sim, oferecemos acesso gratuito à plataforma enquanto ela está em fase inicial. Experimente sem custo!"
    },
    {
      title: "Haverá cobrança para usar a plataforma no futuro?",
      description:
        "No momento, a plataforma está disponível gratuitamente. Avisaremos com antecedência caso implementemos planos pagos."
    },
    {
      title: "Como posso entrar em contato com o suporte?",
      description:
        "Você pode entrar em contato com nossa equipe pelo formulário disponível na landing page ou enviando um e-mail para suporte@seusite.com."
    }
  ];

  return (
    <section
      id="faq"
      className={cn(
        wrapper,
        "flex flex-col gap-y-8 justify-center items-center my-16"
      )}
    >
      <div className="relative space-y-2 text-center">
        <Image
          className="absolute -top-0 -right-14   rotate-[40deg]"
          src="/lp/highlight-vector.svg"
          width={70}
          height={70}
          alt="Ícone de highlight"
        />
        <h3 className="font-bold text-[40px] text-blue-dark">
          Perguntas Frequentes
        </h3>
        <motion.p
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0, transition: { delay: 0.8 } }}
          className="text-sm"
        >
          Não encontrou a resposta aqui?{" "}
          <span className="underline">Entre em contato</span>.
        </motion.p>
      </div>

      <div className="max-w-[800px] w-full">
        <Accordion type="single" collapsible className="text-blue-dark">
          {items.map((item) => (
            <AccordionItem value={item.title} key={item.title}>
              <AccordionTrigger className="font-semibold">
                {item.title}
              </AccordionTrigger>
              <AccordionContent>{item.description}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default Faq;

"use client";
import { cn } from "@lib/utils";
import { motion } from "motion/react";
import Image from "next/image";

import { wrapper } from "../wrapper";

const Features = () => {
  const items = [
    {
      title: "Posts criados automaticamente com criatividade ilimitada.",
      description:
        "Nossa IA gera imagens incríveis e legendas únicas em segundos, adaptadas ao seu público e ao tom da sua marca. Economize tempo enquanto garante conteúdos de alta qualidade.",
      image: "/lp/platform-preview.svg"
    },
    {
      title: "Conecte sua conta e publique diretamente.",
      description:
        "Conecte facilmente suas contas do Instagram (e em breve, outras redes sociais) para criar e publicar posts diretamente na sua página, sem complicações.",
      image: "/lp/platform-preview.svg"
    },
    {
      title: "Planeje e automatize suas postagens.",
      description:
        "Defina datas e horários para suas publicações e deixe nossa ferramenta cuidar do resto. Alcance seu público no momento certo sem precisar estar online.",
      image: "/lp/platform-preview.svg"
    }
  ];

  return (
    <motion.div
      className={cn("space-y-16", wrapper)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {items.map((item, index) => (
        <motion.div
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
            className={cn(index % 2 === 0 ? "order-2" : "order-1")}
          />
          <motion.div
            className={cn(
              "flex flex-col gap-4",
              index % 2 === 0 ? "order-1" : "order-2"
            )}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.3 }}
          >
            <h3 className="font-bold text-[40px] text-blue-dark">
              {item.title}{" "}
            </h3>
            <p>{item.description}</p>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Features;

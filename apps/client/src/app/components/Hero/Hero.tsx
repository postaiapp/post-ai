import React from "react";

import { Button } from "@components/ui/button";
import Image from "next/image";
import "./styles.css";

const Hero = () => {
  return (
    <section className="py-16">
      <div className="flex justify-center flex-col items-center w-full  space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-[80px] font-extrabold text-blue-dark leading-tight h-fit">
            Transforme sua <span className="highlight">marca</span>
            <br /> com{" "}
            <span className="highlight !delay-1000">posts criados por IA</span>
          </h1>

          <p className="text-[20px] font-medium">
            Conecte suas contas, gere conteúdos incríveis e agende suas
            postagens com facilidade.
          </p>
          <div className="space-x-4 pt-6">
            <Button>Testar gratuitamente</Button>
            <Button variant={"outline"}>Entre em contato</Button>
          </div>
        </div>

        <Image
          src="/lp/platform-preview.svg"
          width={1200}
          height={500}
          alt="Hero"
        />
      </div>
      <div className="w-full py-8 bg-purple-light ">
        <div className="w-fit mx-auto">
          <p className="typing-animation text-purple-dark font-bold letter-spacing-[0.1em]">
            Impulsionando Negócios. Hoje e Amanhã.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;

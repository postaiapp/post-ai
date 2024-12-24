import { defaultPrompts } from "@common/constants/home";
import TextArea from "@components/textArea";
import { Button } from "@components/ui/button";
import { Send } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between h-screen w-full">
      <div className="flex flex-col items-center mt-12 w-[70%]">
        <div className="p-3 mx-auto rounded-md border-[1.5px] border-gray-200 w-fit mb-4 shadow-sm">
          <Image src="/logo.png" alt="Logo" width={48} height={48} />
        </div>
        <p className="text-2xl text-center font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-transparent bg-clip-text mb-2">
          Gere posts com o POST-AI
        </p>
        <p className="text-sm font-thin text-center mx-auto text-gray-400 w-96">
          Escolha seu prompt abaixo ou escreva seu próprio texto para gerar um
          post incrível!
        </p>

        <div className="grid grid-cols-3 gap-4 w-full mt-8">
          {defaultPrompts.map((prompt, index) => (
            <Button key={index} className="rounded-2xl" variant="outline">
              <prompt.icon className="mr-2" />
              {prompt.content}
            </Button>
          ))}
        </div>
      </div>

      <div className="my-4 w-[70%]">
        <TextArea
          placeholder="Descreva seu post aqui..."
          iconRight={<Send size={20} color="purple" />}
          showCount
          maxLength={200}
        />
      </div>
    </div>
  );
}

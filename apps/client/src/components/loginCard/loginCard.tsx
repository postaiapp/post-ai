import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Separator } from "@components/ui/separator";
import { LogIn } from "lucide-react";
import { LoginCardProps } from "@common/interfaces/auth";
import { TextInputPassword } from "@components/textInputPassword/textInputPassword";
import { AuthLoginType } from "@common/interfaces/auth";


export default function LoginCard({ register, handleSubmit, errors, onSubmit, toggleAuthMode }: LoginCardProps) {
    return (
        <div className="flex flex-col bg-white rounded-2xl w-full p-8 gap-6 shadow-xl">
        <p className="text-4xl text-left font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-transparent bg-clip-text">
            Seja bem-vindo de volta!
        </p>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col w-full gap-1.5">
                <Label htmlFor="email" required>Email</Label>
                <Input type="text" id="email" placeholder="Digite seu email" {...register("email")} />
                {errors.email && <span className="text-red-500 text-xs">O email é obrigatório</span>}
            </div>


            <div className="flex flex-col w-full gap-1.5">
                <Label htmlFor="password" required>Senha</Label>
                <TextInputPassword<AuthLoginType>
                    register={register}
                    textValue="password"
                />
                {errors.password && <span className="text-red-500 text-xs">A senha é obrigatória</span>}
            </div>

            <Button type="submit" variant="default" className="w-full mt-2 text-base bg-purple-500 hover:bg-fuchsia-500">
                Entrar
                <LogIn size={20} />
            </Button>
        </form>


        <Separator className="mt-2"/>

        <div className="flex items-center">
            <p className="text-gray-600">Ainda não possui uma conta?</p>
            <Button variant="link" className="text-fuchsia-600 p-0 ml-2" onClick={toggleAuthMode}>
                Criar
            </Button>
        </div>
    </div>
    )
}
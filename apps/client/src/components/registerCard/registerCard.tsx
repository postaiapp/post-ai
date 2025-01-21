import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Separator } from "@components/ui/separator";
import { LogIn, LoaderCircle } from "lucide-react";
import { RegisterCardProps } from "@common/interfaces/auth";
import { PasswordInput } from "@components/passwordInput/passwordInput";


export default function RegisterCard({ loading, register, handleSubmit, errors, onSubmit, toggleAuthMode }: RegisterCardProps) {
    return (
        <div className="flex flex-col bg-white rounded-2xl w-full p-8 gap-6 shadow-xl">
            <p className="text-4xl text-left font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-transparent bg-clip-text">
                Crie uma conta
            </p>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col w-full gap-1.5">
                    <Label htmlFor="name" required>Nome</Label>
                    <Input type="text" id="name" placeholder="Digite seu nome completo" {...register("name")} />
                    {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                </div>

                <div className="flex flex-col w-full gap-1.5">
                    <Label htmlFor="email" required>Email</Label>
                    <Input type="email" id="email" placeholder="Digite seu email" {...register("email")}/>
                    {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                </div>


                <div className="flex flex-col w-full gap-1.5">
                    <Label htmlFor="password" required>Senha</Label>
                    <PasswordInput
                        register={register}
                        textValue="password"
                    />
                    {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
                </div>

                <Button type="submit" variant="default" disabled={loading} className="w-full mt-2 text-base bg-purple-500 hover:bg-fuchsia-500">
                    Criar conta
                    {loading && <LoaderCircle className="animate-spin"/>}
                    {!loading && <LogIn size={20} />}
                </Button>
            </form>

            <Separator className="mt-2"/>

            <div className="flex items-center">
                <p className="text-gray-600">Já possui uma conta?</p>
                <Button variant="link" className="text-fuchsia-600 p-0 ml-2" disabled={loading} onClick={toggleAuthMode}>
                    Entrar
                </Button>
            </div>
        </div>
    )
}

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Separator } from "@components/ui/separator";
import { LoaderCircle, LogIn } from "lucide-react";
import { LoginCardProps } from "@common/interfaces/auth";
import { PasswordInput } from "@components/passwordInput/passwordInput";
import { AuthLoginType } from "@common/interfaces/auth";


export default function LoginCard({ loading, register, handleSubmit, errors, onSubmit, toggleAuthMode }: LoginCardProps) {
	return (
		<div className="flex flex-col bg-white rounded-2xl w-full p-8 gap-6 shadow-xl">
		<p className="text-4xl text-left font-semibold bg-gradient-to-r from-purple-500 to-fuchsia-500 text-transparent bg-clip-text">
			Seja bem-vindo de volta!
		</p>

		<form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
			<div className="flex flex-col w-full gap-1.5">
				<Label htmlFor="email" required>Email</Label>
				<Input type="text" id="email" placeholder="Digite seu email" {...register("email")} />
				{errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
			</div>


			<div className="flex flex-col w-full gap-1.5">
				<Label htmlFor="password" required>Senha</Label>
				<PasswordInput<AuthLoginType>
					register={register}
					textValue="password"
				/>
				{errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
			</div>

			<Button type="submit" variant="default" disabled={loading} className="w-full mt-2 text-base bg-purple-500 hover:bg-fuchsia-500">
				Entrar
				{loading && <LoaderCircle className="animate-spin"/>}
				{!loading && <LogIn size={20} />}
			</Button>
		</form>


		<Separator className="mt-2"/>

		<div className="flex items-center">
			<p className="text-gray-600">Ainda não possui uma conta?</p>
			<Button variant="link" className="text-fuchsia-600 p-0 ml-2" disabled={loading} onClick={toggleAuthMode}>
				Criar
			</Button>
		</div>
	</div>
	)
}
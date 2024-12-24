"use client"
import React, { useState } from "react";
import AuthBackground from "@assets/auth.jpg";
import WhiteLogo from "@assets/white-logo.png";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Label } from "@components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Separator } from "@components/ui/separator";

export default function Authentication() {
	const [showPassword, setShowPassword] = useState(false);
	const [isSignup, setIsSignup] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(prevState => !prevState);
	};

	const toggleAuthMode = () => {
		setIsSignup(prevState => !prevState);
	};

	return (
		<div className="flex h-screen w-full bg-[#f5f2f7]">
			<div className="w-[60%] relative">
				<img src={AuthBackground.src} alt="" className="h-full w-full object-cover rounded-r-2xl" />

				<img
					src={WhiteLogo.src}
					alt=""
					className="absolute inset-0 m-auto w-64 h-auto"
				/>
			</div>

			<div className="w-[40%] p-8 flex flex-col justify-center">
				{isSignup && (
					<div className="flex flex-col bg-white rounded-2xl w-full p-8 gap-6 shadow-xl">
						<p className="text-5xl text-left font-semibold bg-gradient-to-r from-purple-500 to-purple-400 text-transparent bg-clip-text">
							Crie uma conta
						</p>

						<div className="flex flex-col gap-3">
							<div className="flex flex-col w-full gap-1.5">
								<Label htmlFor="name" required>Nome</Label>
								<Input type="text" id="name" placeholder="Digite seu nome completo" />
							</div>

							<div className="flex flex-col w-full gap-1.5">
								<Label htmlFor="email" required>Email</Label>
								<Input type="email" id="email" placeholder="Digite seu email" />
							</div>


							<div className="flex flex-col w-full gap-1.5">
								<Label htmlFor="password" required>Senha</Label>
								<div className="relative">
									<Input
										type={showPassword ? "text" : "password"}
										placeholder="Digite sua senha"
										id="password"
										className="pr-10"
									/>
									<button
										type="button"
										onClick={togglePasswordVisibility}
										className="absolute inset-y-0 right-2 flex items-center text-gray-600"
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
							</div>
						</div>

						<Button type="submit" variant="default" className="w-full mt-2 text-base bg-purple-500 hover:bg-fuchsia-500">
							Criar conta
							<LogIn size={20} />
						</Button>

						<Separator className="mt-2"/>

						<div className="flex items-center">
							<p className="text-gray-600">Já possui uma conta?</p>
							<Button variant="link" className="text-fuchsia-600 p-0 ml-2" onClick={toggleAuthMode}>
								Entrar
							</Button>
						</div>
					</div>
				)}

				{!isSignup && (
					<div className="flex flex-col bg-white rounded-2xl w-full p-8 gap-6 shadow-xl">
						<p className="text-4xl text-left font-semibold bg-gradient-to-r from-purple-500 to-purple-400 text-transparent bg-clip-text">
							Seja bem-vindo de volta!
						</p>

						<div className="flex flex-col gap-3">
							<div className="flex flex-col w-full gap-1.5">
								<Label htmlFor="email" required>Email</Label>
								<Input type="email" id="email" placeholder="Digite seu email" required />
							</div>


							<div className="flex flex-col w-full gap-1.5">
								<Label htmlFor="password" required>Senha</Label>
								<div className="relative">
									<Input
										type={showPassword ? "text" : "password"}
										placeholder="Digite sua senha"
										id="password"
										className="pr-10"
									/>
									<button
										type="button"
										onClick={togglePasswordVisibility}
										className="absolute inset-y-0 right-2 flex items-center text-gray-600"
									>
										{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
									</button>
								</div>
							</div>
						</div>

						<Button type="submit" variant="default" className="w-full mt-2 text-base bg-purple-500 hover:bg-fuchsia-500">
							Entrar
							<LogIn size={20} />
						</Button>

						<Separator className="mt-2"/>

						<div className="flex items-center">
							<p className="text-gray-600">Ainda não possui uma conta?</p>
							<Button variant="link" className="text-fuchsia-600 p-0 ml-2" onClick={toggleAuthMode}>
								Criar
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

"use client";
import AuthBackground from "@assets/auth.jpg";
import WhiteLogo from "@assets/white-logo.png";
import { Login } from "@components/loginCard";
import { Register } from "@components/registerCard";
import { AuthContainerProps } from "@common/interfaces/auth";
import Image from "next/image";

export default function AuthenticationUi({ isRegister, toggleAuthMode }: AuthContainerProps) {
	return (
		<div className="flex h-screen w-full bg-gray-100">
			<div className="w-[55%] relative">
				<Image
					src={AuthBackground.src}
					alt="Background de autenticação"
					fill
					sizes="55vw"
					priority
					quality={100}
					className="object-cover rounded-r-3xl"
					style={{ objectPosition: 'center' }}
				/>

				<div className="absolute inset-0 flex items-center justify-center">
					<Image
						src={WhiteLogo.src}
						alt="Logo"
						width={256}
						height={100}
						priority
						className="h-auto"
					/>
				</div>
			</div>

			<div className="w-[45%] p-8 flex flex-col justify-center">
				{isRegister ? <Register toggleAuthMode={toggleAuthMode} /> : <Login toggleAuthMode={toggleAuthMode} />}
			</div>
		</div>
	);
}

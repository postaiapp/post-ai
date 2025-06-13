'use client';

import { useEffect } from 'react';

import { connect } from '@processes/platforms';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircle, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export default function InstagramCallbackPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const code = searchParams.get('code');
	const platformId = 1;

	const { mutate, status, error } = useMutation({
		mutationFn: (code: string) => connect(code, platformId),
	});

	useEffect(() => {
		if (code) {
			mutate(code);
		}
	}, [code, mutate]);

	const buttonBaseStyle = 'w-full p-3 rounded-lg font-semibold transition-all duration-300';
	const primaryButton = `${buttonBaseStyle} text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 shadow-md hover:transform hover:scale-[1.01]`;

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
			<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center">
				<div className="mb-8 flex flex-col items-center">
					<Image src="/logo.png" alt="Logo PostAI" width={64} height={64} className="mb-3" />
					<h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
						PostAI
					</h2>
				</div>

				{status === 'pending' && (
					<div className="flex flex-col items-center">
						<LoaderCircle className="text-purple-500 animate-spin mb-4" size={48} />
						<p className="text-lg font-semibold text-gray-700 mb-2">Conectando sua conta...</p>
						<p className="text-gray-500">Aguarde um momento</p>
					</div>
				)}

				{status === 'success' && (
					<div className="flex flex-col items-center">
						<CheckCircle className="text-green-500 mb-4" size={48} />
						<p className="text-lg font-semibold text-green-600 mb-2">Conta conectada!</p>
						<p className="text-gray-500 mb-6">Sua conta do Instagram foi associada ao PostAI.</p>
						<button className={primaryButton} onClick={() => router.push('/')}>
							Voltar ao início
						</button>
					</div>
				)}

				{status === 'error' && (
					<div className="flex flex-col items-center">
						<XCircle className="text-red-500 mb-4" size={48} />
						<p className="text-lg font-bold text-red-500 mb-2">Erro ao conectar</p>
						<p className="text-gray-500 mb-6">
							{error?.message || 'Não foi possível conectar sua conta do Instagram'}
						</p>
						<button className={primaryButton} onClick={() => router.push('/')}>
							Voltar ao início
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

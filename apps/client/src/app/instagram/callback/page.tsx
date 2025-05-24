'use client';

import { useEffect, useState } from 'react';

import { instagramAuthCallback } from '@processes/instagramAuth';
import { LoaderCircle, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

export default function InstagramCallbackPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
	const [errorMsg, setErrorMsg] = useState<string>('');

	const code = searchParams.get('code');

	useEffect(() => {
		if (!code) {
			setStatus('error');
			setErrorMsg('Código de autorização não encontrado.');
			return;
		}
		setStatus('loading');
		instagramAuthCallback(code)
			.then(() => {
				setStatus('success');
			})
			.catch((err) => {
				setStatus('error');
				setErrorMsg(
					err?.error || err?.message || 'Não foi possível conectar sua conta do Instagram. Tente novamente.'
				);
			});
		// eslint-disable-next-line
	}, [code]);

	const handleRetry = () => {
		if (code) {
			setStatus('loading');
			instagramAuthCallback(code)
				.then(() => {
					setStatus('success');
				})
				.catch((err) => {
					setStatus('error');
					setErrorMsg(
						err?.error ||
							err?.message ||
							'Não foi possível conectar sua conta do Instagram. Tente novamente.'
					);
				});
		} else {
			setStatus('error');
			setErrorMsg('Código de autorização não encontrado.');
		}
	};

	// Estilo do botão gradiente igual ao restante da plataforma
	const gradientBtn =
		'w-full p-3 rounded-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 transition-all duration-300 shadow-md';
	const outlineBtn =
		'w-full p-3 rounded-lg font-semibold border-2 border-purple-200 text-purple-700 bg-white hover:bg-purple-50 transition-all duration-300';

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
			<div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
				{/* Logo da plataforma */}
				<div className="mb-4 flex flex-col items-center">
					<Image src="/logo.png" alt="Logo PostAI" width={56} height={56} className="mb-2" />
					<h2 className="text-2xl font-bold text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text mb-2">
						PostAI
					</h2>
				</div>
				{/* Status visual */}
				{status === 'loading' && (
					<>
						<LoaderCircle className="text-purple-500 animate-spin mb-4" size={48} />
						<p className="text-lg font-semibold text-gray-700 mb-2 text-center">
							Conectando sua conta do Instagram...
						</p>
						<p className="text-gray-500 text-center">Por favor, aguarde.</p>
					</>
				)}
				{status === 'success' && (
					<>
						<CheckCircle className="text-green-500 mb-4" size={48} />
						<p className="text-lg font-semibold text-green-600 mb-2 text-center">
							Conta conectada com sucesso!
						</p>
						<p className="text-gray-500 text-center mb-4">
							Sua conta do Instagram foi associada ao PostAI.
						</p>
						<button className={gradientBtn} onClick={() => router.push('/')}>
							Voltar ao início
						</button>
					</>
				)}
				{status === 'error' && (
					<>
						<XCircle className="text-red-500 mb-4" size={48} />
						<p className="text-lg font-bold text-red-500 mb-2 text-center">
							Código de autorização não encontrado
						</p>
						<p className="text-gray-500 text-center mb-4">{errorMsg}</p>
						<button className={gradientBtn + ' mb-2'} onClick={handleRetry}>
							Tentar novamente
						</button>
						<button className={outlineBtn} onClick={() => router.push('/')}>
							Voltar ao início
						</button>
					</>
				)}
				<p className="text-xs text-gray-400 mt-6 text-center">
					Código do erro: {status === 'error' ? errorMsg || 'no_code' : '-'}
				</p>
			</div>
		</div>
	);
}

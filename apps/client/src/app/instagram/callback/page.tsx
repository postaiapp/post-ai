'use client';

import { useEffect } from 'react';

import { useSearchParams } from 'next/navigation';

const InstagramCallbackPage = () => {
	const searchParams = useSearchParams();
	const code = searchParams.get('code');

	useEffect(() => {
		if (window.opener && code) {
			console.log('enviando o code:', code);
			window.opener.postMessage({ type: 'instagram-auth', code }, window.location.origin);
			window.close();
		}
	}, [code]);

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50">
			<div className="text-center">
				{code ? (
					<>
						<h1 className="text-2xl font-semibold text-gray-800">Conectando com o Instagram...</h1>
						<p className="mt-2 text-gray-600">Você pode fechar esta janela.</p>
					</>
				) : (
					<>
						<h1 className="text-2xl font-semibold text-red-600">Ocorreu um erro</h1>
						<p className="mt-2 text-gray-600">
							Não foi possível obter o código de autorização do Instagram. Por favor, tente novamente.
						</p>
					</>
				)}
			</div>
		</div>
	);
};

export default InstagramCallbackPage;

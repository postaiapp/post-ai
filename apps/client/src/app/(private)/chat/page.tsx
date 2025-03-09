'use client';
import { useEffect, useState } from 'react';

import { defaultPrompts } from '@common/constants/chat';
import { Interaction } from '@common/interfaces/chat';
import { TextArea } from '@components/index';
import { Button } from '@components/ui/button';
import { getChatInteractions, sendMessage } from '@processes/chat';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import { getErrorMessage } from './utils';

const RequestMessageComponent = ({ request }: { request: Interaction['request'] }) => {
	return (
		<div className="flex justify-end">
			<div className="bg-gray-100 p-4 rounded-lg max-w-[80%]">
				<p className="text-gray-800">{request}</p>
			</div>
		</div>
	);
};

const ResponseMessageComponent = ({ response }: { response: Interaction['response'] }) => {
	const router = useRouter();

	return (
		<div className="flex justify-start">
			<div className="bg-purple-100 p-4 rounded-lg max-w-[80%]">
				<Image
					onContextMenu={(e) => e.preventDefault()}
					draggable={false}
					src={response}
					alt="Generated post"
					className="max-w-full h-auto rounded-md"
					width={400}
					height={400}
					priority
				/>

				<Button
					className="w-full p-4 mt-4 bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-400 hover:to-purple-500 transition-all duration-500"
					onClick={() => router.push(`/post-details?image=${encodeURIComponent(response)}`)}
				>
					Postar imagem
				</Button>
			</div>
		</div>
	);
};

const ResponseMessageErrorComponent = ({
	onTryAgain,
	errorMessage,
}: {
	onTryAgain: () => void;
	errorMessage: string;
}) => {
	const finalErrorMessage = getErrorMessage(errorMessage);

	return (
		<div className="flex flex-col gap-4">
			<div className="w-[400px] h-[400px] bg-red-50 rounded-md relative overflow-hidden flex flex-col items-center justify-center">
				<AlertCircle size={48} className="text-red-500 mb-4" />
				<p className="text-lg font-medium text-red-600">Ops! Algo deu errado</p>
				<p className="text-sm text-red-500 text-center max-w-[300px] mb-4">{finalErrorMessage} </p>
				<Button variant="destructive" className="w-fit" onClick={onTryAgain}>
					Tentar novamente
				</Button>
			</div>
		</div>
	);
};

const ResponseMessageLoadingComponent = () => {
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setSeconds((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	const timeString = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;

	return (
		<div className="flex flex-col gap-2">
			<div className="w-[400px] h-[400px] animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 rounded-md relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
			</div>
			<p className="text-sm text-gray-500 animate-pulse">Gerando resposta... ({timeString})</p>
		</div>
	);
};

export default function Home() {
	const router = useRouter();
	const [prompt, setPrompt] = useState('');
	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const chatId = searchParams.get('chatId') ?? undefined;

	const {
		mutate,
		isPending: isPendingSendMessage,
		isError: isErrorSendMessage,
		error: errorSendMessage,
		reset: resetSendMessage,
	} = useMutation({
		mutationKey: ['sendMessage'],
		mutationFn: ({ message, chatId }: { message: string; chatId?: string }) => sendMessage({ message, chatId }),
		onSuccess: (data) => {
			if (!chatId) {
				router.push(`/chat?chatId=${data?.data.chat.id}`);
			}

			queryClient.invalidateQueries({ queryKey: ['chats', chatId] });
		},
		onError: (error: Error) => {
			console.log(error.message);
			// const errorMessage = error?.message || 'Algo de errado aconteceu, tente novamente.';
			// errorToast(mappedErrors[errorMessage] || errorMessage);
		},
	});

	const { data, isPending: isPendingInteractions } = useQuery({
		queryKey: ['chats', chatId],
		queryFn: () => getChatInteractions({ chatId: chatId || '' }),
		enabled: !!chatId,
	});

	const handleSendMessage = () => {
		mutate({ message: prompt, chatId });
		setPrompt('');
		queryClient.setQueryData(['chats', chatId], (old: { data?: Interaction[] }) => {
			return {
				...old,
				data: [...(old?.data || []), { request: prompt, response: null, isRegenerated: false }],
			};
		});
	};

	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (data?.data?.length) {
				const lastMessage = document.querySelector(
					`#${data?.data[data?.data.length - 1].request.replace(/\s+/g, '-')}-${data?.data.length - 1}`
				);
				if (lastMessage) {
					lastMessage.scrollIntoView({ behavior: 'smooth' });
				}
			}
		}
	}, [data?.data]);

	// TODO: Tratar cenário em que acontece erro ao enviar primeira mensagem
	// TODO: Tratar cenário em que acontece o blink na tela entre a section de "Gerar posts com Post AI" e a tela normal do chat. O blink acontece quando

	return (
		<div className="relative flex flex-col justify-between items-center w-full h-screen overflow-hidden">
			<div className="w-full h-full overflow-auto mt-6 mb-4">
				<div className="mx-auto max-w-4xl w-full">
					{!chatId && !isPendingSendMessage && (
						<div className="flex flex-col items-center">
							<div className="p-3 mx-auto rounded-md border-[1.5px] border-gray-200 w-fit mb-4 shadow-sm">
								<Image src="/logo.png" alt="Logo" width={48} height={48} />
							</div>
							<p className="text-3xl text-center font-semibold bg-gradient-to-r from-purple-500 to-purple-400 text-transparent bg-clip-text mb-2">
								Gere posts com o Post AI
							</p>
							<p className="text-[12px] font-light text-center mx-auto text-gray-700">
								Escolha seu prompt abaixo ou escreva seu próprio texto para gerar um post incrível!
							</p>
							<div className="flex flex-wrap justify-center items-center lg:px-28 gap-4 w-full mt-8 min-[1460px]:grid min-[1460px]:grid-cols-3">
								{defaultPrompts.map((prompt, index) => (
									<Button
										key={index}
										className="rounded-2xl w-52 flex items-center justify-center text-gray-500 border-gray-300 font-regular p-3"
										variant="outline"
									>
										<prompt.icon className="" />
										{prompt.content}
									</Button>
								))}
							</div>
						</div>
					)}
					{chatId && isPendingInteractions ? (
						<div className="flex items-center justify-center h-[69vh]">
							<div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
						</div>
					) : (
						<div className="space-y-8 w-full max-w-4xl mx-auto">
							{data?.data?.map((interaction, index) => (
								<div
									key={`${interaction.request}-${interaction.response}`}
									id={`${interaction.request.replace(/\s+/g, '-')}-${index}`}
									className={'flex flex-col gap-6 w-full px-4'}
								>
									<RequestMessageComponent request={interaction.request} />
									{interaction.response ? (
										<ResponseMessageComponent response={interaction.response} />
									) : isErrorSendMessage ? (
										<ResponseMessageErrorComponent
											onTryAgain={() => mutate({ message: interaction.request, chatId })}
											errorMessage={errorSendMessage.message}
										/>
									) : (
										<ResponseMessageLoadingComponent />
									)}
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			<div className="w-full max-w-4xl mb-2">
				<TextArea
					placeholder="Descreva seu post aqui..."
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					onEnter={() => {
						if (prompt.length === 0) {
							return;
						}

						if (isPendingSendMessage) {
							resetSendMessage();
						} else {
							handleSendMessage();
						}
					}}
					disabled={!!chatId && isPendingInteractions}
					loading={isPendingSendMessage}
					showCount
					maxLength={200}
				/>
			</div>
		</div>
	);
}

'use client';
import { useEffect } from 'react';

import { Interaction } from '@common/interfaces/chat';
import { getChatInteractions, sendMessage } from '@processes/chat';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

import { ChatUi } from './chatUi';
import useChatStore from './store/useChatStore';
import { getErrorMessage, NOT_TRY_AGAIN_ERROR_MESSAGES } from './utils';

const ChatContainer = () => {
	const router = useRouter();
	const { prompt, setPrompt } = useChatStore('chat-prompt');
	const { prompt: pendingPrompt, setPrompt: setPendingPrompt } = useChatStore('pending-prompt');

	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const chatId = searchParams.get('chatId') ?? undefined;

	const {
		mutate,
		isPending: isPendingSendMessage,
		isError: isErrorSendMessage,
		isSuccess: isSuccessSendMessage,
		error: errorSendMessage,
	} = useMutation({
		mutationKey: ['sendMessage'],
		mutationFn: ({ message, chatId }: { message: string; chatId?: string }) => {
			// throw new Error('Ocorreu um erro ao enviar a mensagem. Por favor, tente novamente.');
			return sendMessage({ message, chatId });
		},
		onSuccess: (data) => {
			if (!chatId) {
				router.push(`/chat?chatId=${data?.data.chat.id}`);
			}

			queryClient.invalidateQueries({ queryKey: ['chats', chatId] });
			setPendingPrompt('');
		},
		onError: (error: Error) => {
			const finalError = getErrorMessage(error.message);
			if (NOT_TRY_AGAIN_ERROR_MESSAGES.includes(finalError)) {
				setPendingPrompt('');
				// the user wont be able to try again
			}
		},
	});

	const { data, isPending: isPendingInteractions } = useQuery({
		queryKey: ['chats', chatId],
		queryFn: () => getChatInteractions({ chatId: chatId || '' }),
		enabled: !!chatId,
	});

	const handleSendMessage = (prompt: string, chatId?: string) => {
		mutate({ message: prompt, chatId });
		setPrompt('');
		setPendingPrompt(prompt);
		queryClient.setQueryData(['chats', chatId], (old: { data?: Interaction[] }) => {
			const oldDataWithoutRequestsWithNoResponse = old.data?.filter((item) => !!item.response) ?? [];

			return {
				...old,
				data: [
					...oldDataWithoutRequestsWithNoResponse,
					{ request: prompt, response: null, isRegenerated: false },
				],
			};
		});
	};

	// const handleRegenerate = (interaction, index) => {
	// queryClient.setQueryData(['chats', chatId], (old: { data?: Interaction[] }) => {
	// 	const oldDataWithoutRequestsWithNoResponse = old.data?.filter((item) => !!item.response) ?? [];

	// 	return {
	// 		...old,
	// 		data: oldDataWithoutRequestsWithNoResponse.map((index)=> ),
	// 	};
	// });
	// scrollToMessage(interaction, index)
	// };

	const scrollToMessage = (interaction: Interaction, index: number) => {
		const lastMessage = document.querySelector(`#${interaction.request.replace(/\s+/g, '-')}-${index}`);
		if (lastMessage) {
			lastMessage.scrollIntoView({ behavior: 'smooth' });
		}
	};

	// Treat scenario of user reloading the page when image is loading
	useEffect(() => {
		if (pendingPrompt && !isPendingSendMessage && !isErrorSendMessage) {
			setPendingPrompt('');
			setPrompt(pendingPrompt);
		}
	}, [pendingPrompt, isPendingSendMessage, setPendingPrompt, isErrorSendMessage, setPrompt]);

	// Route to bottom when a message is sent by user or by bot
	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (data?.data?.length) {
				const interaction = data.data.slice(-1)[0];
				const index = data.data.length - 1;

				scrollToMessage(interaction, index);
			}
		}
	}, [data?.data]);

	return (
		<ChatUi
			chatId={chatId}
			isSuccessSendMessage={isSuccessSendMessage}
			isPendingSendMessage={isPendingSendMessage}
			isErrorSendMessage={isErrorSendMessage}
			isPendingInteractions={isPendingInteractions}
			data={data?.data ?? []}
			errorSendMessage={errorSendMessage}
			handleSendMessage={(prompt, chatId) => handleSendMessage(prompt, chatId)}
			handleRegenerate={() => null}
			prompt={prompt}
			setPrompt={setPrompt}
		/>
	);
};

export default ChatContainer;

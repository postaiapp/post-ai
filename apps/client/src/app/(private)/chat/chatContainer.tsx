'use client';
import { useEffect } from 'react';

import { Interaction } from '@common/interfaces/chat';
import { getChatInteractions, regenerateMessage, sendMessage } from '@processes/chat';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { errorToast } from '@utils/toast';
import { useRouter, useSearchParams } from 'next/navigation';

import { ChatUi } from './chatUi';
import useChatStore from './store/useChatStore';
import { getErrorMessage, NOT_TRY_AGAIN_ERROR_MESSAGES } from './utils';
import { getInteractionId } from './utils/getInteractionId';

const scrollToMessage = (id: string) => {
	const lastMessage = document.querySelector(`#${id}`);

	if (lastMessage) {
		lastMessage.scrollIntoView({
			behavior: 'smooth',
			block: 'end'
		});
	}
};

const ChatContainer = () => {
	const router = useRouter();
	const { prompt, setPrompt } = useChatStore('chat-prompt');
	const { prompt: pendingPrompt, setPrompt: setPendingPrompt } = useChatStore('pending-prompt');

	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const chatId = searchParams.get('chatId') ?? undefined;

	const {
		mutate: mutateSendMessage,
		isPending: isPendingSendMessage,
		isError: isErrorSendMessage,
		isSuccess: isSuccessSendMessage,
		error: errorSendMessage,
	} = useMutation({
		mutationKey: ['sendMessage'],
		mutationFn: ({ message, chatId }: { message: string; chatId?: string }) => {
			return sendMessage({ message, chatId });
		},
		onSuccess: (data) => {
			if (!chatId) {
				router.push(`/chat?chatId=${data?.data.chat.id}`);
			}

			queryClient.invalidateQueries({ queryKey: ['chats', chatId] });
			queryClient.invalidateQueries({ queryKey: ['userChats'] });
			setPendingPrompt('');
		},
		onError: (error: Error) => {
			const finalError = getErrorMessage(error.message);
			if (NOT_TRY_AGAIN_ERROR_MESSAGES.includes(finalError)) {
				setPendingPrompt('');
			}
		},
	});

	const { mutate: mutateRegenerateMessage, isPending: isPendingRegenerateMessage } = useMutation({
		mutationKey: ['regenerateMessage'],
		mutationFn: ({
			message,
			chatId,
			interactionId,
		}: {
			message: string;
			chatId: string;
			interactionId: string;
		}) => {
			return regenerateMessage({ message, chatId, interactionId });
		},
		onError: () => {
			errorToast('Não foi possível gerar novamente a imagem!');
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['chats', chatId] });
		},
	});

	const { data, isPending: isPendingInteractions } = useQuery({
		queryKey: ['chats', chatId],
		queryFn: () => getChatInteractions({ chatId: chatId || '' }),
		enabled: !!chatId,
	});

	const handleSendMessage = (prompt: string, chatId?: string) => {
		mutateSendMessage({ message: prompt, chatId });
		setPrompt('');
		setPendingPrompt(prompt);

		queryClient.setQueryData(['chats', chatId], (old: { data?: Interaction[] }) => {
			const oldDataWithoutRequestsWithNoResponse = old?.data?.filter((item) => !!item.response) ?? [];

			return {
				...old,
				data: [
					...oldDataWithoutRequestsWithNoResponse,
					{ _id: 'temporary-id', request: prompt, response: null, isRegenerated: false },
				],
			};
		});
	};

	const handleRegenerate = (message: string, chatId: string, interactionId: string) => {
		mutateRegenerateMessage({ message, chatId, interactionId });
		queryClient.setQueryData(['chats', chatId], (old: { data?: Interaction[] }) => {
			const oldDataWithoutRequestsWithNoResponse = old?.data?.filter((item) => !!item.response) ?? [];


			return {
				...old,
				data: oldDataWithoutRequestsWithNoResponse.map((item) =>
					item._id === interactionId ? { ...item, response: undefined } : item
				),
			};
		});
	};

	useEffect(() => {
		if (pendingPrompt && !isPendingSendMessage && !isErrorSendMessage) {
			setPendingPrompt('');
			setPrompt(pendingPrompt);
		}
	}, [pendingPrompt, isPendingSendMessage, setPendingPrompt, isErrorSendMessage, setPrompt]);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (data?.data?.length) {
				const interaction = data.data.slice(-1)[0];
				const id = getInteractionId(interaction);
				scrollToMessage(id);
			}
		}
	}, [data?.data]);

	return (
		<ChatUi
			chatId={chatId}
			data={data?.data ?? []}
			prompt={prompt}
			setPrompt={setPrompt}
			sendMessage={{
				isPendingInteractions,
				isPendingSendMessage,
				isErrorSendMessage,
				isSuccessSendMessage,
				errorSendMessage,
				handleSendMessage,
			}}
			regenerate={{
				isPendingRegenerateMessage,
				handleRegenerate,
			}}
		/>
	);
};

export default ChatContainer;

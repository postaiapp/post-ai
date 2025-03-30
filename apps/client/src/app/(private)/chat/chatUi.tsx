import { defaultPrompts } from '@common/constants/chat';
import { Interaction } from '@common/interfaces/chat';
import { Button } from '@components/button';
import Image from 'next/image';

import ChatTextArea from './components/ChatTextArea/ChatTextArea';
import { RequestMessageComponent } from './components/RequestMessageComponent/RequestMessageComponent';
import {
	ResponseMessageComponent,
	ResponseMessageErrorComponent,
	ResponseMessageLoadingComponent,
} from './components/ResponseMessageComponent/ResponseMessageComponent';
import { getInteractionId } from './utils/getInteractionId';

interface ChatUiProps {
	chatId?: string;
	data: Interaction[];
	prompt: string;
	setPrompt: (prompt: string) => void;
	sendMessage: {
		isPendingInteractions: boolean;
		isPendingSendMessage: boolean;
		isErrorSendMessage: boolean;
		isSuccessSendMessage: boolean;
		errorSendMessage: Error | null;
		handleSendMessage: (prompt: string, chatId?: string) => void;
	};
	regenerate: {
		isPendingRegenerateMessage: boolean;
		handleRegenerate: (message: string, chatId: string, interactionId: string) => void;
	};
}

export const ChatUi = ({ chatId, sendMessage, regenerate, data, prompt, setPrompt }: ChatUiProps) => {
	const {
		isPendingSendMessage,
		isSuccessSendMessage,
		isErrorSendMessage,
		isPendingInteractions,
		errorSendMessage,
		handleSendMessage,
	} = sendMessage;
	const { isPendingRegenerateMessage, handleRegenerate } = regenerate;

	return (
		<div className="relative bg-gray-100 flex flex-col justify-between items-center w-full h-screen overflow-hidden">
			<div className="w-full h-full overflow-auto mt-6 mb-4 thin-scrollbar">
				<div className="mx-auto max-w-4xl w-full">
					{!chatId && !isPendingSendMessage && !isSuccessSendMessage && !isErrorSendMessage && (
						<div className="flex flex-col items-center">
							<div className="p-3 mx-auto rounded-md border-[1.5px] border-gray-200 w-fit mb-4 shadow-sm">
								<Image src="/logo.png" alt="Logo" width={48} height={48} />
							</div>
							<p className="text-3xl text-center font-semibold bg-gradient-to-r from-purple-500 to-purple-400 text-transparent bg-clip-text mb-2">
								Gere posts com o Post AI
							</p>
							<p className="text-[12px] font-medium text-center mx-auto text-gray-700">
								Escolha seu prompt abaixo ou escreva seu próprio texto para gerar um post incrível!
							</p>
							<div className="flex flex-wrap justify-center items-center lg:px-28 gap-4 w-full mt-8 min-[1460px]:grid min-[1460px]:grid-cols-3">
								{defaultPrompts.map((prompt, index) => (
									<Button
										key={index}
										onClick={() => setPrompt(prompt.message)}
										className="bg-white border-[1px] border-gray-200 hover:bg-gray-50 shadow-sm rounded-2xl w-52 flex items-center justify-center text-gray-500 font-regular p-3"
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
							{data?.map((interaction, index) => {
								const id = getInteractionId(interaction);
								return (
									<div
										key={interaction._id + index}
										id={id}
										className={'flex flex-col gap-6 w-full px-4'}
									>
										<RequestMessageComponent request={interaction.request} />
										{interaction.response ? (
											<ResponseMessageComponent
												response={interaction.response}
												isLastMessage={index === data.length - 1}
												onRegenerate={async () => {
													handleRegenerate(
														interaction.request,
														chatId || '',
														interaction._id
													);
												}}
												onRegenerateDisabled={isPendingRegenerateMessage}
											/>
										) : !isPendingSendMessage && isErrorSendMessage ? (
											<ResponseMessageErrorComponent
												onTryAgain={() => {
													if (chatId) {
														handleRegenerate(
															interaction.request,
															chatId || '',
															interaction._id
														);
													} else {
														handleSendMessage(interaction.request, chatId);
													}
												}}
												errorMessage={errorSendMessage?.message}
											/>
										) : (
											<ResponseMessageLoadingComponent />
										)}
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>

			<div className="w-full max-w-4xl mb-2">
				<ChatTextArea
					placeholder="Descreva seu post aqui..."
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					onEnter={() => {
						if (prompt.length === 0) {
							return;
						}

						handleSendMessage(prompt, chatId);
					}}
					disabled={(!!chatId && isPendingInteractions) || isPendingSendMessage || isPendingRegenerateMessage}
					showCount
					maxLength={200}
				/>
			</div>
		</div>
	);
};

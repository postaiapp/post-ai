'use client';
import { useEffect, useState } from 'react';

import { Interaction } from '@common/interfaces/chat';
import { Button } from '@components/button';
import { Dialog, DialogContent, DialogTitle } from '@components/ui/dialog';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { getErrorMessage } from '../../utils';

export const ResponseMessageComponent = ({
	response,
	onRegenerate,
	onRegenerateDisabled,
	isLastMessage,
	chatId,
}: {
	response: Interaction['response'];
	onRegenerate: () => void;
	onRegenerateDisabled: boolean;
	isLastMessage: boolean;
	chatId: string;
}) => {
	const router = useRouter();
	const [isImageModalOpen, setIsImageModalOpen] = useState(false);

	return (
		<div className="flex flex-col gap-2">
			<div className="bg-purple-200 shadow-sm rounded-bl-none p-4 rounded-lg w-fit">
				<div className="cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
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
				</div>

				<Button
					className="w-full p-4 mt-4 bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-400 hover:to-purple-500 transition-all duration-500"
					onClick={() => router.push(`/post-details?image=${encodeURIComponent(response)}&chatId=${chatId}`)}
				>
					Postar imagem
				</Button>
			</div>
			<div className="flex gap-2">
				{isLastMessage && (
					<Button
						variant="outline"
						className="w-8 h-8 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
						onClick={onRegenerate}
						disabled={onRegenerateDisabled}
					>
						<RefreshCw size={16} />
					</Button>
				)}
			</div>

			<Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
				<DialogTitle></DialogTitle>
				<DialogContent
					className="max-w-[80vh] max-h-[95vh] p-4 overflow-hidden flex items-center justify-center bg-purple-200 rounded-xl border-0"
					hideClose
				>
					<Image
						src={response}
						alt="Generated post"
						className="max-h-[90vh] w-[1400px] object-contain rounded-md shadow-xl"
						width={1400}
						height={1400}
						objectFit="cover"
						priority
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export const ResponseMessageErrorComponent = ({
	onTryAgain,
	errorMessage,
}: {
	onTryAgain: () => void;
	errorMessage?: string;
}) => {
	const finalErrorMessage = getErrorMessage(errorMessage);

	return (
		<div className="flex flex-col gap-4">
			<div className="w-[400px] h-[400px] bg-red-100 rounded-md shadow-sm rounded-bl-none relative overflow-hidden flex flex-col items-center justify-center">
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

export const ResponseMessageLoadingComponent = () => {
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
			<div className="w-[400px] h-[400px] animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 rounded-md rounded-bl-none shadow-sm relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
			</div>
			<p className="text-sm text-gray-500 animate-pulse">Gerando resposta... ({timeString})</p>
		</div>
	);
};

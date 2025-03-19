import { useEffect, useState } from 'react';

import { Interaction } from '@common/interfaces/chat';
import { Button } from '@components/button';
import { AlertCircle, RefreshCw, Send } from 'lucide-react';
import Image from 'next/image';

import { getErrorMessage } from '../../utils';

export const ResponseMessageComponent = ({
	response,
	onRegenerate,
}: {
	response: Interaction['response'];
	onRegenerate: () => void;
}) => {
	return (
		<div className="flex flex-col gap-2">
			<div className="bg-purple-100 p-4 rounded-lg w-fit">
				<Image
					onContextMenu={(e) => e.preventDefault()}
					draggable={false}
					src={response}
					alt="Generated post"
					className="max-w-full h-auto rounded-md"
					width={350}
					height={350}
					priority
				/>
			</div>
			<div className="flex gap-2">
				<Button variant="outline" className="w-8 h-8 p-0" onClick={onRegenerate}>
					<RefreshCw size={16} />
				</Button>
				<Button variant="outline" className="w-8 h-8 p-0">
					<Send size={16} />
				</Button>
			</div>
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
			<div className="w-[400px] h-[400px] animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 rounded-md relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
			</div>
			<p className="text-sm text-gray-500 animate-pulse">Gerando resposta... ({timeString})</p>
		</div>
	);
};

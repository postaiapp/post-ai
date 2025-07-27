import { useCallback, useEffect, useRef, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@components/ui/dialog';
import InstagramLogo from '@public/instagram-logo.png';
import TiktokLogo from '@public/tiktok-logo.png';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import Image from 'next/image';

import { PLATFORMS } from '@/common/constants/platforms';
import { useCreatePlatformMutation } from '@/hooks/usePlatformMutation';

import { Button } from '../ui/button';

import { errorToast } from '@/utils/toast';

interface PlatformConnectionModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const INSTAGRAM_OAUTH_URL =
	'https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=4336613326583916&redirect_uri=https://e3d910dd9c42.ngrok-free.app/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights';

const platforms = [
	{
		key: 'instagram',
		label: 'Instagram',
		description: 'Conecte sua conta do Instagram.',
		logo: InstagramLogo,
		disabled: false,
	},
	{
		key: 'tiktok',
		label: 'TikTok',
		description: 'Conecte sua conta do TikTok.',
		logo: TiktokLogo,
		disabled: true,
	},
] as const;

type PlatformKey = (typeof platforms)[number]['key'];

export default function PlatformConnectionModal({ isOpen, onClose }: PlatformConnectionModalProps) {
	const [selected, setSelected] = useState<PlatformKey | null>(null);
	const hasReceivedCodeRef = useRef(false);

	const platformMutation = useCreatePlatformMutation(() => {
		handleClose();
	});

	const handleClose = () => {
		setSelected(null);
		hasReceivedCodeRef.current = false;
		onClose();
	};

	const handleMessage = useCallback(
		(event: MessageEvent) => {
			if (event.origin !== window.location.origin) return;

			const { type, code } = event.data;

			const shouldCreatePlatform =
				type === 'instagram-auth' &&
				code &&
				!hasReceivedCodeRef.current &&
				!platformMutation.isPending &&
				!platformMutation.isSuccess;

			if (shouldCreatePlatform) {
				hasReceivedCodeRef.current = true;
				platformMutation.mutate({ code, platformId: PLATFORMS.INSTAGRAM });
			}
		},
		[platformMutation]
	);

	useEffect(() => {
		window.addEventListener('message', handleMessage);
		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, [handleMessage]);

	const onSelectPlatform = (platform: 'instagram' | 'tiktok') => {
		if (platform === 'instagram') {
			window.open(INSTAGRAM_OAUTH_URL, '_blank', 'width=500,height=600');
		}
		if (platform === 'tiktok') {
			errorToast('A conexão com o TikTok estará disponível em breve.');
		}
	};

	const handleAdvance = () => {
		if (selected) {
			onSelectPlatform(selected);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="w-full max-w-2xl bg-white rounded-2xl p-6 shadow-xl border border-[var(--modal-border)]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold">Adicionar nova plataforma</DialogTitle>
					<DialogDescription className="text-base text-gray-500 mt-1">
						Escolha uma das plataformas abaixo para conectar à sua conta.
					</DialogDescription>
				</DialogHeader>

				{platformMutation.isPending && (
					<div className="flex flex-col items-center justify-center py-8">
						<LoaderCircle className="w-8 h-8 text-purple-600 mb-4 animate-spin" />
						<span className="text-lg font-medium text-gray-700">Conectando plataforma...</span>
					</div>
				)}

				{!platformMutation.isPending && (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{platforms.map(platform => {
								const isSelected = selected === platform.key;
								return (
									<label
										key={platform.key}
										className={
											`relative flex flex-col items-start cursor-pointer border transition-all rounded-2xl p-6 min-h-[170px] ` +
											(platform.disabled
												? 'opacity-60 cursor-not-allowed bg-gray-50 border-gray-200'
												: isSelected
													? 'bg-purple-50 border-purple-500 shadow-[0_0_0_2px_#a855f7]'
													: 'bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50/40')
										}
									>
										<input
											type="radio"
											name="platform"
											value={platform.key}
											checked={isSelected}
											disabled={platform.disabled}
											onChange={() => setSelected(platform.key)}
											className="peer sr-only"
											tabIndex={-1}
										/>
										<span
											className={
												'absolute right-6 top-6 w-5 h-5 flex items-center justify-center rounded-full border-2 ' +
												(isSelected ? 'border-purple-500 bg-white' : 'border-gray-300 bg-white')
											}
										>
											{isSelected && (
												<span className="block w-3 h-3 rounded-full bg-purple-500" />
											)}
										</span>
										<Image
											src={platform.logo}
											alt={platform.label}
											width={48}
											height={48}
											className="mb-4"
										/>
										<span className="font-semibold text-lg text-gray-800 mb-1">
											{platform.label}
										</span>
										<span className="text-gray-500 text-sm">{platform.description}</span>

										{platform.disabled && (
											<span className="absolute right-12 top-6 bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
												Disponível em breve
											</span>
										)}
									</label>
								);
							})}
						</div>
						<div className="flex justify-end gap-3">
							<Button
								type="button"
								variant="secondary"
								className="px-5 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
								onClick={handleClose}
							>
								Cancelar
							</Button>
							<Button
								variant="primary"
								type="button"
								icon={<ArrowRight size={20} />}
								iconPosition="right"
								onClick={handleAdvance}
								disabled={!selected}
							>
								Avançar
							</Button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}

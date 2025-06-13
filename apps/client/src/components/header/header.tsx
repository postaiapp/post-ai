import { Fragment } from 'react';

import { HeaderProps } from '@common/interfaces/header';
import { Button } from '@components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import { Separator } from '@components/ui/separator';
import { PLATFORMS } from '@constants/platforms';
import InstagramLogo from '@public/instagram-logo.png';
import TiktokLogo from '@public/tiktok-logo.png';
import { userStore } from '@stores/index';
import { getColorByInitials, getInitials } from '@utils/avatar';
import { LogOut, ChevronDown, Settings, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';

const INSTAGRAM_OAUTH_URL =
	'https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=4336613326583916&redirect_uri=https://b89b-2804-351c-dd01-a1e0-c18a-46a1-69ca-de59.ngrok-free.app/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights';

export default function Header({
	accounts,
	handleLogout,
	selectedAccount,
	handleSelectPlatform,
	goToEditProfile,
}: HeaderProps) {
	const { user } = userStore();
	const initials = getInitials(user?.name || '');
	const backgroundColor = getColorByInitials(initials || '');
	const hasPlatforms = accounts && accounts.length > 0;

	return (
		<div className="flex justify-between items-center w-full px-10 py-3 border-b-2">
			<div className="flex items-center space-x-4">
				<Image src="/logo.png" alt="Logo" width={40} height={40} />
			</div>

			<div className="flex items-center space-x-4">
				{/* Dropdown de plataformas */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="flex items-center justify-between rounded-lg h-9 px-3 gap-2 border border-gray-200 hover:bg-gray-50"
						>
							{selectedAccount?.platform_id === PLATFORMS.INSTAGRAM && (
								<Image src={InstagramLogo.src} alt="Instagram Logo" width={18} height={18} />
							)}

							{selectedAccount?.platform_id === PLATFORMS.TIKTOK && (
								<Image src={TiktokLogo.src} alt="Tiktok Logo" width={18} height={18} />
							)}

							{selectedAccount ? (
								<span className="font-medium text-sm">{selectedAccount.display_name}</span>
							) : (
								<span className="text-sm text-gray-500">Selecione uma plataforma</span>
							)}
							<ChevronDown size={14} className="text-gray-400" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-72 p-2 shadow-lg rounded-xl">
						{!hasPlatforms && (
							<DropdownMenuItem disabled className="text-sm text-gray-500 px-4 py-2.5">
								Nenhuma plataforma encontrada
							</DropdownMenuItem>
						)}
						{hasPlatforms &&
							accounts.map((account) => (
								<Fragment key={account.id}>
									<DropdownMenuItem
										onClick={() => handleSelectPlatform(account)}
										className="flex justify-between items-center px-2 hover:bg-gray-50 cursor-pointer rounded-lg"
									>
										<div className="flex items-center gap-2 w-full">
											<Image
												src={account.avatar_url || ''}
												alt="Avatar"
												width={32}
												height={32}
												className="rounded-full"
											/>
											<div className="flex flex-col">
												<span className="flex-1 text-sm">{account.display_name}</span>
												<span className="flex-1 text-xs text-gray-500">
													@{account.profile_data?.username}
												</span>
											</div>
										</div>

										<div>
											{account?.platform_id === PLATFORMS.INSTAGRAM && (
												<Image
													src={InstagramLogo.src}
													alt="Instagram Logo"
													width={16}
													height={16}
												/>
											)}

											{account?.platform_id === PLATFORMS.TIKTOK && (
												<Image src={TiktokLogo.src} alt="Tiktok Logo" width={18} height={18} />
											)}
										</div>
									</DropdownMenuItem>
								</Fragment>
							))}
						<Separator className="my-2" />
						<DropdownMenuItem
							className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer rounded-lg"
							onClick={() => {
								window.open(INSTAGRAM_OAUTH_URL, '_blank', 'width=500,height=600');
							}}
						>
							<div className="flex items-center gap-2 text-purple-600">
								<SquareArrowOutUpRight size={18} />
								<span className="text-sm font-medium">Adicionar nova plataforma</span>
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* Dropdown de Configurações */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button
							className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-medium hover:opacity-90 transition-opacity"
							style={{ backgroundColor }}
						>
							{initials}
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent side="bottom" align="end" className="w-56 p-2 shadow-lg rounded-xl">
						<DropdownMenuItem
							onClick={goToEditProfile}
							className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer rounded-lg"
						>
							<div className="flex items-center gap-2 w-full text-gray-700">
								<Settings size={18} />
								<span className="text-sm">Editar perfil</span>
							</div>
						</DropdownMenuItem>
						<Separator className="my-2" />
						<DropdownMenuItem
							onClick={handleLogout}
							className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer rounded-lg"
						>
							<div className="flex items-center gap-2 w-full text-red-500">
								<LogOut size={18} />
								<span className="text-sm">Sair</span>
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

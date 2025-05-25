import { Fragment } from 'react';

import { HeaderProps } from '@common/interfaces/header';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import { Separator } from '@components/ui/separator';
import { userStore } from '@stores/index';
import { getColorByInitials, getInitials } from '@utils/avatar';
import { Instagram, LogOut, ChevronDown, Link, Settings } from 'lucide-react';
import Image from 'next/image';

const INSTAGRAM_OAUTH_URL =
	'https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=4336613326583916&redirect_uri=https://7ddb-2804-351c-dd01-a1e0-34a0-ab8f-a36a-a7a5.ngrok-free.app/instagram/callback&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish%2Cinstagram_business_manage_insights';

export default function Header({
	accounts,
	selectedAccount,
	handleAccountChange,
	handleLogout,
	handleNavigateUserDetails,
}: HeaderProps) {
	const { user } = userStore();
	const initials = getInitials(user?.name || '');
	const backgroundColor = getColorByInitials(initials || '');
	const hasInstagramAccounts = accounts && accounts.length > 0;

	return (
		<div className="flex justify-between items-center w-full px-5 py-3 border-b-2">
			<div className="flex items-center space-x-4">
				<Image src="/logo.png" alt="Logo" width={40} height={40} />
			</div>

			<div className="flex items-center space-x-4">
				{/* Dropdown de Contas do Instagram */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="flex items-center justify-between rounded-lg h-9 px-3 gap-2 border border-gray-200 hover:bg-gray-50"
						>
							<Instagram size={18} className="text-purple-500" />
							{selectedAccount ? (
								<span className="font-medium text-sm">{selectedAccount.username}</span>
							) : (
								<span className="text-sm text-gray-500">Selecione uma conta</span>
							)}
							<ChevronDown size={14} className="text-gray-400" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-64 p-2 shadow-lg rounded-xl">
						{!hasInstagramAccounts && (
							<DropdownMenuItem disabled className="text-sm text-gray-500 px-4 py-2.5">
								Nenhuma conta Instagram encontrada
							</DropdownMenuItem>
						)}
						{hasInstagramAccounts &&
							accounts.map((account) => (
								<Fragment key={account.id}>
									<DropdownMenuItem
										onClick={() => handleAccountChange(account)}
										className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer rounded-lg"
									>
										<div className="flex items-center gap-2 w-full">
											<Instagram size={18} className="text-purple-500" />
											<span className="flex-1 text-sm">{account.username}</span>
											{selectedAccount?.id === account.id && (
												<Badge
													variant="outline"
													className="bg-green-50 text-green-600 border-green-200"
												>
													<Link size={12} className="mr-1" />
													Ativa
												</Badge>
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
								<Instagram size={18} />
								<span className="text-sm font-medium">Adicionar nova conta</span>
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
							onClick={handleNavigateUserDetails}
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

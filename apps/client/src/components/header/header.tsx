import { HeaderProps } from '@common/interfaces/header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import { Separator } from '@components/ui/separator';
import { userStore } from '@stores/index';
import { getColorByInitials, getInitials } from '@utils/avatar';
import { LogOut, Settings } from 'lucide-react';
import Image from 'next/image';

export default function Header({
	handleLogout,
	goToEditProfile,
}: HeaderProps) {
	const { user } = userStore();
	const initials = getInitials(user?.name || '');
	const backgroundColor = getColorByInitials(initials || '');

	return (
		<div className="flex justify-between items-center w-full px-10 py-3 border-b-2">
			<div className="flex items-center space-x-4">
				<Image src="/logo.png" alt="Logo" width={40} height={40} />
			</div>

			<div className="flex items-center space-x-4">
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

import { Fragment } from 'react';

import { Button } from '@components/ui/button';
import InstagramLogo from '@public/instagram-logo.png';
import TiktokLogo from '@public/tiktok-logo.png';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	Separator,
} from '@radix-ui/react-dropdown-menu';
import { Link, ChevronDown, LoaderCircle, Trash, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';

import { PLATFORMS } from '@/common/constants/platforms';
import { PlatformSelectProps } from '@/common/interfaces/PlatformSelect';

const PlatformSelectUI = ({
	userPlatforms,
	handleDisconnectPlatform,
	openPlatformModal,
	onSelectPlatform,
	selectedPlatform,
}: PlatformSelectProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="flex items-center justify-between rounded-lg h-9 px-3 gap-2 border border-gray-200 hover:bg-gray-50"
				>
					{!selectedPlatform && (
						<div className="flex items-center gap-2">
							<Link size={16} className="text-purple-500" />
							<span className="text-sm text-gray-500">Ver plataformas</span>
						</div>
					)}

					{selectedPlatform && (
						<div className="flex items-center gap-1">
							<Image
								src={selectedPlatform.avatar_url || ''}
								alt="Avatar"
								width={20}
								height={20}
								className="rounded-full"
							/>

							<span className="text-sm text-gray-500">
								{selectedPlatform.display_name || selectedPlatform.name}
							</span>
						</div>
					)}

					<ChevronDown size={14} className="text-gray-400" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-72 p-2 shadow-lg rounded-xl bg-white border border-gray-200">
				{!userPlatforms || userPlatforms.length === 0 ? (
					<DropdownMenuItem disabled className="text-sm text-gray-500 px-4 py-2.5">
						Nenhuma plataforma encontrada
					</DropdownMenuItem>
				) : (
					userPlatforms.map(userPlatform => (
						<Fragment key={userPlatform.id}>
							<DropdownMenuItem
								className="flex justify-between items-center px-4 py-2.5 hover:bg-gray-100 hover:outline-none cursor-pointer rounded-lg"
								onClick={() => onSelectPlatform(userPlatform)}
							>
								<div className="flex items-center gap-2 w-full">
									<Image
										src={userPlatform.avatar_url || ''}
										alt="Avatar"
										width={32}
										height={32}
										className="rounded-full"
									/>
									<div className="flex flex-col">
										<div className="flex items-center gap-2">
											<span className="text-sm text-gray-700 max-w-[120px] truncate">
												{userPlatform.display_name}
											</span>

											{userPlatform?.platform_id === PLATFORMS.INSTAGRAM && (
												<Image
													src={InstagramLogo.src}
													alt="Instagram Logo"
													width={16}
													height={16}
												/>
											)}

											{userPlatform?.platform_id === PLATFORMS.TIKTOK && (
												<Image src={TiktokLogo.src} alt="Tiktok Logo" width={18} height={18} />
											)}
										</div>
										<span className="flex-1 text-xs text-gray-500">
											@{userPlatform.profile_data?.username}
										</span>
									</div>
								</div>

								{handleDisconnectPlatform && (
									<Button
										variant="tertiary"
										disabled={userPlatform.loading}
										size="sm"
										onClick={e => {
											e.stopPropagation();
											handleDisconnectPlatform(userPlatform);
										}}
									>
										{userPlatform.loading && <LoaderCircle size={16} className="animate-spin" />}
										{!userPlatform.loading && <Trash size={16} className="text-red-500" />}
									</Button>
								)}
							</DropdownMenuItem>
						</Fragment>
					))
				)}
				<Separator className="my-2" />
				{openPlatformModal && (
					<DropdownMenuItem
						className="px-4 py-2.5 hover:bg-gray-100 cursor-pointer hover:outline-none rounded-lg"
						onClick={openPlatformModal}
					>
						<div className="flex items-center gap-2 text-purple-600">
							<SquareArrowOutUpRight size={18} />
							<span className="text-sm font-medium">Adicionar nova plataforma</span>
						</div>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default PlatformSelectUI;

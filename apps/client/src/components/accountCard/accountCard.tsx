'use client';

import { useMemo } from 'react';

import { AccountCardProps, InstagramAccountStore } from '@common/interfaces/instagramAccount';
import { Button } from '@components/button';
import { DropdownMenuItem } from '@components/ui/dropdown-menu';
import { BadgeCheck, LockKeyhole, LockOpen, RefreshCcw, Trash } from 'lucide-react';
import Image from 'next/image';

export function AccountCardCore({
	fullName,
	username,
	profilePicUrl,
	isPrivate,
	isVerified,
}: Partial<InstagramAccountStore>) {
	const icon = useMemo(() => {
		if (isVerified) {
			return <BadgeCheck className="h-3 w-3 text-blue-500" />;
		}

		if (isPrivate) {
			return <LockKeyhole className="h-3 w-3 text-zinc-600" />;
		}

		return <LockOpen className="h-3 w-3 text-zinc-600" />;
	}, [isPrivate, isVerified]);

	return (
		<div className="flex items-center gap-3 cursor-pointer">
			{profilePicUrl ? (
				<Image src={profilePicUrl} width={32} height={32} alt="profile instagram picture" className="rounded-full" />
			) : (
				<div className="h-8 w-8 bg-zinc-200 rounded-full"></div>
			)}

			<div className="flex flex-col">
				<div className="flex items-center gap-2">
					<span className="text-xs font-medium truncate max-w-[100px]">{fullName}</span>
					{icon}
				</div>
				<span className="text-xs text-zinc-600">@{username}</span>
			</div>
		</div>
	)
}

export default function AccountCard({
	fullName,
	username,
	profilePicUrl,
	isPrivate,
	isVerified,
	setModalOpen,
	handleLogout,
	setIsLogin,
}: AccountCardProps) {

	return (
		<DropdownMenuItem className="flex flex-col items-start gap-2 focus:bg-transparent">
			<AccountCardCore
				fullName={fullName}
				username={username}
				profilePicUrl={profilePicUrl}
				isPrivate={isPrivate}
				isVerified={isVerified}
			/>
			<div className="flex gap-2 w-full items-center">
				<Button
					className="text-xs w-1/2"
					variant="outline"
					onClick={() => {
						setModalOpen((prev) => !prev);
						setIsLogin(true);
					}}
				>
					Login
					<RefreshCcw className="h-3 w-3 text-zinc-600" />
				</Button>
				<Button className="text-xs w-1/2" onClick={() => handleLogout(username!)}>
					Remove
					<Trash className="h-3 w-3 text-zinc-200" />
				</Button>
			</div>
		</DropdownMenuItem>
	);
}

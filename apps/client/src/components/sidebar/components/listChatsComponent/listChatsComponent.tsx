'use client';

import { Chat } from '@common/interfaces/chat';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@components/ui/sidebar';
import { MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export const ListChatsComponent = ({ label, chats }: { label: string; chats: Chat[] }) => {
	const searchParams = useSearchParams();
	const chatId = searchParams.get('chatId');

	return (
		<div>
			<SidebarMenu className="sticky top-0 bg-[#fafafa] z-10 p-2 text-xs font-bold">{label}</SidebarMenu>
			<div>
				{chats.map((chat) => (
					<SidebarMenuItem key={chat.id}>
						<SidebarMenuButton asChild isActive={chatId === chat.id}>
							<Link href={`/chat?chatId=${chat.id}`}>
								<MessageSquare size={16} />
								<span className="text-sm">{chat.firstMessage || 'Nova conversa'}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</div>
		</div>
	);
};

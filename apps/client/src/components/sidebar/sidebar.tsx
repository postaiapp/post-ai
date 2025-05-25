'use client';

import { itemsSideBar } from '@common/constants/chat';
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	Sidebar as UiSideBar,
} from '@components/ui/sidebar';
import { getUserChats } from '@processes/chat';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { ListChatsComponent } from './components/listChatsComponent/listChatsComponent';
import { filterChatsByDate } from './utils/filterChatsByDate';

export default function Sidebar() {
	const searchParams = useSearchParams();
	const chatId = searchParams.get('chatId');
	const pathname = usePathname();

	const pageSize = 5;
	const { data, fetchNextPage, hasNextPage, isPending, isFetchingNextPage } = useInfiniteQuery({
		queryKey: ['userChats'],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await getUserChats({
				page: pageParam as number,
				limit: pageSize,
			});

			return response;
		},
		initialPageParam: 1,
		staleTime: 60000 * 5,
		gcTime: 60000 * 24,
		getNextPageParam: (lastPage) => {
			const { limit, page, total } = lastPage.meta;

			if (!limit || !page) return undefined;

			const totalPages = Math.ceil(total / limit);

			if (page < totalPages) {
				return page + 1;
			}

			return undefined;
		},
	});

	const allPagesData = data?.pages.flatMap((page) => page.results) || [];
	const filteredChats = filterChatsByDate(allPagesData);

	return (
		<UiSideBar collapsible="icon" className="bg-white">
			<SidebarContent className="overflow-hidden">
				<SidebarGroup>
					<SidebarGroupLabel className="pb-2 text-gray-900">Post AI</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{itemsSideBar.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={
											pathname === '/chat'
												? pathname === item.url && !chatId
												: pathname === item.url
										}
									>
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}

							<div className="group-data-[collapsible=icon]:hidden overflow-y-auto h-[calc(100vh-140px)] -mr-2 thin-scrollbar">
								{isPending ? (
									<div className="flex justify-center items-center h-[200px]">
										<Loader2 className="h-4 w-4 animate-spin" />
									</div>
								) : (
									allPagesData.length > 0 && (
										<div className="space-y-2 my-2 relative">
											{filteredChats.today.length > 0 && (
												<ListChatsComponent label="Hoje" chats={filteredChats.today} />
											)}

											{filteredChats.yesterday.length > 0 && (
												<ListChatsComponent label="Ontem" chats={filteredChats.yesterday} />
											)}

											{filteredChats.last7Days.length > 0 && (
												<ListChatsComponent
													label="Últimos 7 dias"
													chats={filteredChats.last7Days}
												/>
											)}

											{filteredChats.last30Days.length > 0 && (
												<ListChatsComponent
													label="Últimos 30 dias"
													chats={filteredChats.last30Days}
												/>
											)}
										</div>
									)
								)}

								<div
									ref={(el) => {
										if (el) {
											const observer = new IntersectionObserver(
												(entries) => {
													if (
														entries[0].isIntersecting &&
														hasNextPage &&
														!isFetchingNextPage
													) {
														fetchNextPage();
													}
												},
												{ threshold: 1.0 }
											);
											observer.observe(el);
											return () => observer.disconnect();
										}
									}}
									className="w-full flex justify-center py-2"
								>
									{isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />}
								</div>
							</div>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</UiSideBar>
	);
}

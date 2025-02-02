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
import { usePathname } from 'next/navigation';

import { SidebarFooter } from './sidebarFooter';

export default function Sidebar() {
	const pathname = usePathname();

	return (
		<UiSideBar collapsible="icon">
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Post AI</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{itemsSideBar.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild isActive={pathname === item.url}>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter />
		</UiSideBar>
	);
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@components/ui/sidebar";
import {
  Calendar,
  ChevronUp,
  Cog,
  DoorOpen,
  History,
  Home,
  Search,
  User2
} from "lucide-react";

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home
  },
  {
    title: "History Posts",
    url: "#",
    icon: History
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar
  },
  {
    title: "Search",
    url: "#",
    icon: Search
  }
];

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Post-ai</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={true}>
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <Cog /> Settings
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem className="flex items-center gap-4 mb-2">
                  <User2 size={20} />
                  <span className="text-sm">Change your account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-4 mb-2">
                  <DoorOpen size={20} color="red" />
                  <span className="text-red-500 text-sm">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

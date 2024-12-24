import Header from "@components/header";
import { Sidebar } from "@components/index";
import { SidebarProvider } from "@components/ui/sidebar";

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar />
      <div className="flex flex-col w-full h-screen">
        <Header />
        {children}
      </div>
    </SidebarProvider>
  );
}

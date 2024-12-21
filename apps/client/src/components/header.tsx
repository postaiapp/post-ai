import { CircleUserRound } from "lucide-react";
import Image from "next/image";

import { SidebarTrigger } from "./ui/sidebar";

export default function Header() {
  return (
    <div className="flex justify-between items-center w-full px-5 pt-5 border-b-2">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <Image src="/logo.png" alt="Logo" width={40} height={40} />
      </div>

      <div className="flex items-center space-x-4">
        <CircleUserRound size={24} />
      </div>
    </div>
  );
}

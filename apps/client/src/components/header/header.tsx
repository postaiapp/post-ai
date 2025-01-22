import { CircleUserRound, Instagram, User2 } from 'lucide-react';
import Image from 'next/image';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { SidebarTrigger } from '../ui/sidebar';

export default function Header() {
    return (
        <div className="flex justify-between items-center w-full px-5 pt-3 border-b-2">
            <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <Image src="/logo.png" alt="Logo" width={40} height={40} />
            </div>

            <div className="flex items-center space-x-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <CircleUserRound size={24} className="cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" className="mr-5">
                        <DropdownMenuItem className="flex items-center gap-4">
                            <User2 size={20} />
                            <span className="text-sm">Profile data</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-4">
                            <Instagram size={20} color="purple" />
                            <span className="text-purple-800 text-sm">Add your Instagram</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

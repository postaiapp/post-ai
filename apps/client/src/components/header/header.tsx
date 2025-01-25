import { InstagramAccountType } from '@common/interfaces/instagramAccount';
import { Button } from '@components/button';
import { DialogHeader, Dialog, DialogContent, DialogTitle, DialogTrigger, DialogFooter } from '@components/ui/dialog';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { DialogDescription } from '@radix-ui/react-dialog';
import { CircleUserRound, Instagram, User2 } from 'lucide-react';
import Image from 'next/image';
import { SubmitHandler, useForm } from 'react-hook-form';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { SidebarTrigger } from '../ui/sidebar';

type HeaderProps = {
    onSubmit: SubmitHandler<InstagramAccountType>;
    handleSubmit: (callback: SubmitHandler<InstagramAccountType>) => (e?: React.BaseSyntheticEvent) => Promise<void>;
    register: ReturnType<typeof useForm>['register'];
    errors: ReturnType<typeof useForm>['formState']['errors'];
    isLoading: boolean;
};

export default function Header({ onSubmit, handleSubmit, register, errors, isLoading }: HeaderProps) {
    return (
        <div className="flex justify-between items-center w-full px-5 pt-3 border-b-2">
            <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <Image src="/logo.png" alt="Logo" width={40} height={40} />
            </div>

            <div className="flex items-center space-x-4">
                <Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <CircleUserRound size={24} className="cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="top" className="mr-5">
                            <DropdownMenuItem className="flex items-center gap-4">
                                <User2 size={20} />
                                <span className="text-sm">Profile data</span>
                            </DropdownMenuItem>
                            <DialogTrigger asChild>
                                <DropdownMenuItem className="flex items-center gap-4">
                                    <Instagram size={20} color="purple" />
                                    <span className="text-sm">Add instagram account</span>
                                </DropdownMenuItem>
                            </DialogTrigger>
                        </DropdownMenuContent>
                        <DialogContent className="sm:max-w-[425px] bg-slate-50">
                            <DialogHeader>
                                <DialogTitle>Instagram Account</DialogTitle>
                                <DialogDescription>
                                    Add your Instagram account to get more followers and likes.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Username</Label>
                                    <Input className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label className="text-right">Password</Label>
                                    <Input className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" isLoading={isLoading}>
                                    Add Instagram Account
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </DropdownMenu>
                </Dialog>
            </div>
        </div>
    );
}

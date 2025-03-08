import { Fragment } from 'react';

import { HeaderProps } from '@common/interfaces/header';
import { InstagramAccountType } from '@common/interfaces/instagramAccount';
import { AccountCard } from '@components/accountCard';
import { Button } from '@components/button';
import { PasswordInput } from '@components/passwordInput/passwordInput';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Separator } from '@components/ui/separator';
import { DialogDescription } from '@radix-ui/react-dialog';
import { CircleUserRound, Instagram } from 'lucide-react';
import Image from 'next/image';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { SidebarTrigger } from '../ui/sidebar';

export default function Header({
	onSubmit,
	handleSubmit,
	register,
	errors,
	isLoading,
	accounts,
	reset,
	handleLogout,
	modalOpen,
	setModalOpen,
	isLoginPending,
	setIsLogin,
}: HeaderProps) {
	return (
		<div className="flex justify-between items-center w-full px-5 pt-1 border-b-2 h-16 fixed top-0 left-0 right-0 bg-white z-50">
			<div className="flex items-center space-x-4">
				{/* <SidebarTrigger /> */}
				<Image src="/logo.png" alt="Logo" width={40} height={40} />
			</div>

			<div className="flex items-center space-x-4">
				<Dialog
					open={modalOpen}
					onOpenChange={(isOpen) => {
						setModalOpen(isOpen);
						if (!isOpen) {
							setIsLogin(false);
							reset();
						}
					}}
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<CircleUserRound size={24} className="cursor-pointer" />
						</DropdownMenuTrigger>
						<DropdownMenuContent side="top" className="mr-5 p-2">
							{accounts?.map((account) => (
								<Fragment key={account.id}>
									<AccountCard
										{...account}
										setIsLogin={setIsLogin}
										setModalOpen={setModalOpen}
										handleLogout={() => handleLogout(account.username)}
									/>

									<Separator className="my-2" />
								</Fragment>
							))}

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
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="py-4">
									<div className="flex w-full items-center gap-4">
										<Label className="text-right">Username</Label>
										<Input
											className=""
											{...register('username')}
											placeholder="Digite seu username ou email"
										/>
									</div>

									{errors.username && (
										<span className="text-red-500 text-sm">{errors.username.message}</span>
									)}

									<div className="flex w-full mt-3 items-center gap-4">
										<Label className="text-right mr-1">Password</Label>
										<PasswordInput<InstagramAccountType>
											register={register}
											textValue="password"
											containerClassName="w-full"
										/>
									</div>

									{errors.password && (
										<span className="col-span-4 text-red-500 text-sm">
											{errors.password.message}
										</span>
									)}
								</div>
								<DialogFooter>
									<Button type="submit" isLoading={isLoading || isLoginPending}>
										Add account
									</Button>
								</DialogFooter>
							</form>
						</DialogContent>
					</DropdownMenu>
				</Dialog>
			</div>
		</div>
	);
}

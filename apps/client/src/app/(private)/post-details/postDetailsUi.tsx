'use client';
import { useEffect, useRef } from 'react';

import { InstagramAccountStore } from '@common/interfaces/instagramAccount';
import { PostDetailsUIProps } from '@common/interfaces/post';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Calendar as ShadCalendar } from '@components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import { Input } from '@components/ui/input';
import { Separator } from '@components/ui/separator';
import { Textarea } from '@components/ui/textarea';
import { getUserInstagramAccounts } from '@processes/instagramAccount';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
	ArrowLeft,
	Calendar,
	ChevronDown,
	Heart,
	Instagram,
	Link,
	LoaderCircle,
	MessageCircle,
	Send,
	Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Controller } from 'react-hook-form';

export default function PostDetailsUI({
	control,
	handleSubmit,
	onSubmit,
	showCalendar,
	toggleCalendar,
	selectedDate,
	handleDateChange,
	selectedTime,
	handleTimeChange,
	loadingSubmit,
	selectedAccount,
	handleAccountChange,
	user,
	caption,
	image,
	generateCaption,
	loadingCaption,
}: PostDetailsUIProps) {
	const router = useRouter();
	const calendarRef = useRef<HTMLDivElement>(null);

	const { data: instagramAccounts, isPending } = useQuery<{ data: InstagramAccountStore[] }>({
		queryKey: ['instagram-accounts', user?.email],
		queryFn: () => getUserInstagramAccounts(),
	});

	useEffect(() => {
		if (showCalendar && calendarRef.current) {
			calendarRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [showCalendar]);

	const handleToggleCalendar = () => {
		toggleCalendar();

		setTimeout(() => {
			if (calendarRef.current) {
				calendarRef.current.scrollIntoView({ behavior: 'smooth' });
			}
		}, 100);
	};

	const imageUrl =
		isPending || !selectedAccount?.profilePicUrl ? '/default-profile.jpg' : selectedAccount.profilePicUrl;

	const hasInstagramAccounts = !isPending && instagramAccounts?.data && instagramAccounts.data.length > 0;
	const noAccountsSelected = !isPending && !selectedAccount;

	return (
		<div className="flex flex-col w-full h-screen bg-gray-100 overflow-hidden">
			<div className="p-4">
				<Button
					variant="ghost"
					className="flex items-center gap-2 text-gray-600 hover:text-purple-500 transition-colors"
					onClick={() => router.back()}
				>
					<ArrowLeft size={18} />
					Voltar
				</Button>
			</div>

			<div className="flex gap-6 items-center w-full flex-1 px-6 pb-6">
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="w-[60%] bg-white rounded-lg h-full shadow-md flex flex-col"
				>
					<div className="p-6">
						<p className="text-xl font-semibold text-gray-900">Novo post</p>
						<p className="text-sm text-gray-500">
							Preencha os detalhes do seu post, escolha a conta, defina a legenda e, se desejar, agende a
							data e horário da publicação.
						</p>
					</div>

					<Separator />

					<div className="flex flex-col gap-6 p-6 overflow-y-auto max-h-[calc(100vh-170px)] thin-scrollbar">
						<div className="p-6 border-[1px] shadow-xs rounded-xl border-gray-200 flex justify-between items-center">
							<div className="flex items-center gap-4">
								{isPending ? (
									<div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
								) : (
									<Image
										alt="Foto de perfil"
										className="rounded-full"
										width={48}
										height={48}
										src={imageUrl}
									/>
								)}

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="outline"
											className="flex items-center justify-between rounded-lg h-8"
										>
											<div className="flex items-center gap-2">
												<Instagram size={18} className="text-purple-500" />
												{!isPending && selectedAccount && (
													<p className="font-semibold">{selectedAccount.username}</p>
												)}
												{!isPending && noAccountsSelected && (
													<p className="text-gray-500">Selecione uma conta</p>
												)}
												{isPending && (
													<div className="w-28 h-4 bg-gray-200 animate-pulse rounded-md" />
												)}
											</div>
											<ChevronDown size={24} className="text-black" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="w-56 mt-2">
										{!hasInstagramAccounts && !isPending && (
											<DropdownMenuItem disabled>
												Nenhuma conta Instagram encontrada
											</DropdownMenuItem>
										)}
										{hasInstagramAccounts &&
											instagramAccounts.data.map((account) => (
												<DropdownMenuItem
													key={account.username}
													onClick={() => handleAccountChange(account)}
												>
													<Instagram size={18} className="mr-2 text-purple-500" />
													{account.username}
												</DropdownMenuItem>
											))}
									</DropdownMenuContent>
								</DropdownMenu>
							</div>

							<div>
								{isPending && <div className="w-40 h-4 bg-gray-200 animate-pulse rounded-md" />}
								{!isPending && selectedAccount && (
									<Badge className="bg-green-500 hover:bg-green-400 transition-all duration-500">
										<Link size={14} className="mr-1" />
										Conta conectada
									</Badge>
								)}
								{!isPending && noAccountsSelected && (
									<Badge className="bg-yellow-500 hover:bg-yellow-400 transition-all duration-500">
										Selecione uma conta Instagram
									</Badge>
								)}
							</div>
						</div>

						<div className="p-6 border-[1px] shadow-xs rounded-xl border-gray-200 flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<p className="font-semibold text-base">Descrição</p>
								<Button
									type="button"
									variant="ghost"
									onClick={generateCaption}
									disabled={loadingCaption}
								>
									Gerar com o Post AI Intelligence
									{!loadingCaption && (
										<Sparkles className="text-purple-500" size={18} fill="currentColor" />
									)}
									{loadingCaption && <LoaderCircle className="text-purple-500 animate-spin" />}
								</Button>
							</div>
							<Controller
								name="caption"
								control={control}
								render={({ field }) => (
									<Textarea
										className="h-32"
										placeholder="Escreva a legenda do seu post ou gere com o Post AI Intelligence..."
										{...field}
									/>
								)}
							/>
						</div>

						<div className="flex flex-col gap-4">
							<Button
								type="submit"
								disabled={showCalendar || noAccountsSelected}
								className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-400 hover:to-purple-500 transition-all duration-500"
							>
								{noAccountsSelected ? "Selecione uma conta para postar" : "Postar agora"}
								{loadingSubmit && <LoaderCircle className="animate-spin" />}
							</Button>

							<Button
								type="button"
								variant="outline"
								className="w-full p-4 flex items-center justify-center gap-2"
								onClick={handleToggleCalendar}
								disabled={noAccountsSelected}
							>
								<Calendar size={18} /> Postar depois
							</Button>

							{showCalendar && (
								<div
									ref={calendarRef}
									className="p-6 mt-3 border rounded-lg shadow-sm flex flex-col items-center w-full bg-gray-50"
									id="calendario-agendamento"
								>
									<p className="text-sm text-gray-700 text-center mb-2">
										📅 Escolha uma <span className="font-semibold">data</span> e um ⏰{' '}
										<span className="font-semibold">horário</span> para o agendamento do post.
									</p>

									<ShadCalendar
										mode="single"
										selected={selectedDate}
										onSelect={handleDateChange}
										disabled={{ before: dayjs().toDate() }}
										defaultMonth={dayjs().toDate()}
									/>

									<div className="w-full mt-4 flex flex-col">
										<p className="text-sm text-gray-700 mb-1">Escolha o horário:</p>
										<Input type="time" value={selectedTime} onChange={handleTimeChange} />
									</div>

									<Button
										type="submit"
										disabled={!selectedDate || !selectedTime || noAccountsSelected}
										className="w-full p-4 mt-4 bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-400 hover:to-purple-500 transition-all duration-500"
									>
										Agendar Post para {selectedDate ? selectedDate.toLocaleDateString() : ' - '} às{' '}
										{selectedTime || ' - '}
										{loadingSubmit && <LoaderCircle className="animate-spin" />}
									</Button>
								</div>
							)}
						</div>
					</div>
				</form>

				<div className="w-[40%] bg-white rounded-lg h-full shadow-md flex flex-col">
					<div className="p-6">
						<p className="text-xl font-semibold text-gray-900">Pré-visualização</p>
						<p className="text-sm text-gray-500">
							Aqui está uma prévia de como seu post aparecerá no Instagram.
						</p>
					</div>

					<Separator />

					<div className="py-6 px-12 flex-1 overflow-y-auto thin-scrollbar">
						<div className="p-6 border-[1px] shadow-sm rounded-xl border-gray-200 max-w-[500px] mx-auto">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<Image
										alt="Foto de perfil"
										className="rounded-full"
										width={40}
										height={40}
										src={imageUrl}
									/>
									<div>
										{isPending && <div className="w-28 h-4 bg-gray-200 animate-pulse rounded-md" />}
										{!isPending && selectedAccount && (
											<p className="font-semibold text-base">{selectedAccount.username}</p>
										)}
										{!isPending && noAccountsSelected && (
											<p className="text-gray-500 text-base">Selecione uma conta</p>
										)}
										<p className="text-xs text-gray-500">Agora mesmo</p>
									</div>
								</div>
								<Instagram size={20} color="gray" />
							</div>

							<div className="relative w-full aspect-square overflow-hidden rounded-lg">
								<Image
									fill
									alt="Imagem do post"
									src={image || '/default-profile.jpg'}
									sizes="(max-width: 768px) 100vw, 50vw"
									className="object-cover"
									draggable={false}
								/>
							</div>

							<div className="flex items-center justify-between py-3">
								<div className="flex gap-4">
									<Heart fill="currentColor" size={24} className="cursor-pointer text-red-500" />
									<MessageCircle
										size={24}
										className="cursor-pointer text-gray-600 hover:text-blue-500"
									/>
									<Send size={24} className="cursor-pointer text-gray-600 hover:text-green-500" />
								</div>
							</div>

							<div className="text-sm min-h-[120px]">
								{isPending && (
									<div>
										<div className="w-full h-4 bg-gray-200 animate-pulse rounded-md" />
										<div className="w-28 h-4 mt-1 bg-gray-200 animate-pulse rounded-md" />
									</div>
								)}
								{!isPending && selectedAccount && (
									<div className="flex flex-col gap-1">
										<span className="font-semibold">@{selectedAccount.username}</span>
										<p className="text-gray-500 whitespace-pre-wrap break-words">
											{caption || 'Aqui vai a legenda do post.'}
										</p>
									</div>
								)}
								{!isPending && noAccountsSelected && (
									<div className="flex flex-col gap-1">
										<span className="font-semibold text-gray-500">Selecione uma conta Instagram</span>
										<p className="text-gray-500 whitespace-pre-wrap break-words">
											{caption || 'Aqui vai a legenda do post.'}
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

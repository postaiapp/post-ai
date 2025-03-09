'use client';
import { useEffect, useState } from 'react';

import { InstagramAccountStore } from '@common/interfaces/instagramAccount';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Calendar as ShadCalendar } from '@components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import { Input } from '@components/ui/input';
import { Separator } from '@components/ui/separator';
import { Textarea } from '@components/ui/textarea';
import userStore from '@stores/userStore';
import { Instagram, Heart, MessageCircle, Send, Calendar, ChevronDown, Link } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

export default function PostDetails() {
	const [showCalendar, setShowCalendar] = useState(false);
	const [loading, setLoading] = useState(true);
	const searchParams = useSearchParams();
	const image = decodeURIComponent(searchParams.get('image') || '');
	const user = userStore((state) => state.user);
	const [selectedAccount, setSelectedAccount] = useState(user?.InstagramAccounts[0]);
	console.log(selectedAccount, 'selectedAccount');

	const { control, handleSubmit, setValue, watch } = useForm({
		defaultValues: {
			username: user?.InstagramAccounts[0]?.username || '',
			caption: '',
			img: image || '',
			post_date: '',
		},
	});

	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedTime, setSelectedTime] = useState<string>('');

	const caption = watch('caption');

	useEffect(() => {
		if (user?.InstagramAccounts?.length) {
			setSelectedAccount(user.InstagramAccounts[0]);
			setLoading(false);
		}
	}, [user]);

	const generateISODate = (date?: Date, time?: string) => {
		if (!date || !time) return '';
		const [hours, minutes] = time.split(':').map(Number);
		const isoDate = new Date(date);
		isoDate.setHours(hours, minutes, 0, 0);
		return isoDate.toISOString();
	};

	const handleDateChange = (date: Date | undefined) => {
		setSelectedDate(date);
		setValue('post_date', generateISODate(date, selectedTime));
	};

	const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const time = e.target.value;
		setSelectedTime(time);
		setValue('post_date', generateISODate(selectedDate, time));
	};

	const handleAccountChange = (account: InstagramAccountStore) => {
		setSelectedAccount(account);

		setValue('username', account.username);
	};

	const onSubmit = async (data: unknown) => {
		console.log('Dados enviados:', data);
	};

	const toggleCalendar = () => setShowCalendar(!showCalendar);

	return (
		<div className="flex gap-6 items-center w-full h-screen bg-gray-100 p-6 overflow-y-hidden">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-[60%] bg-white rounded-lg h-full shadow-md flex flex-col"
			>
				<div className="p-6">
					<p className="text-xl font-semibold text-gray-900">Novo post</p>
					<p className="text-sm text-gray-500">
						Preencha os detalhes do seu post, escolha a conta, defina a legenda e, se desejar, agende a data
						e horário da publicação.
					</p>
				</div>

				<Separator />

				<div className="flex flex-col gap-6 p-6 overflow-y-auto max-h-[calc(100vh-170px)]">
					<div className="p-6 border-[1px] shadow-xs rounded-xl border-gray-200 flex justify-between items-center">
						<div className="flex items-center gap-4">
							<Image
								alt="Foto de perfil"
								className="rounded-full"
								width={48}
								height={48}
								src="/default-profile.jpg"
							/>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="flex items-center justify-between rounded-lg h-8"
									>
										<div className="flex items-center gap-2">
											<Instagram size={18} className="text-purple-500" />
											{!loading && <p className="font-semibold">{selectedAccount?.username}</p>}
											{loading && (
												<div className="w-28 h-4 bg-gray-200 animate-pulse rounded-md" />
											)}
										</div>
										<ChevronDown size={24} className="text-black" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56 mt-2">
									{user?.InstagramAccounts.map((account) => (
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
							<Badge className="bg-green-500 hover:bg-green-400 transition-all duration-500">
								<Link size={14} className="mr-1" />
								Conta conectada
							</Badge>
						</div>
					</div>

					<div className="p-6 border-[1px] shadow-xs rounded-xl border-gray-200 flex flex-col gap-2">
						<p className="font-semibold text-base">Descrição</p>
						<Controller
							name="caption"
							control={control}
							render={({ field }) => (
								<Textarea className="h-32" placeholder="Escreva a legenda do seu post..." {...field} />
							)}
						/>
					</div>

					<div className="flex flex-col gap-4">
						<Button
							type="submit"
							disabled={showCalendar}
							className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-400 hover:to-purple-500 transition-all duration-500"
						>
							Postar agora
						</Button>

						<Button
							type="button"
							variant="outline"
							className="w-full p-4 flex items-center justify-center gap-2"
							onClick={toggleCalendar}
						>
							<Calendar size={18} /> Postar depois
						</Button>

						{showCalendar && (
							<div className="p-6 mt-3 border rounded-lg shadow-sm flex flex-col items-center w-full bg-gray-50">
								<p className="text-sm text-gray-700 text-center mb-2">
									📅 Escolha uma <span className="font-semibold">data</span> e um ⏰{' '}
									<span className="font-semibold">horário</span> para o agendamento do post.
								</p>

								<ShadCalendar mode="single" selected={selectedDate} onSelect={handleDateChange} />

								<div className="w-full mt-4 flex flex-col">
									<p className="text-sm text-gray-700 mb-1">Escolha o horário:</p>
									<Input type="time" value={selectedTime} onChange={handleTimeChange} />
								</div>

								<Button
									type="submit"
									className="w-full p-4 mt-4 bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-400 hover:to-purple-500 transition-all duration-500"
								>
									Agendar Post
								</Button>
							</div>
						)}
					</div>
				</div>
			</form>

			<div className="w-[40%] bg-white rounded-lg h-full shadow-md">
				<div className="p-6">
					<p className="text-xl font-semibold text-gray-900">Pré-visualização</p>
					<p className="text-sm text-gray-500">
						Aqui está uma prévia de como seu post aparecerá no Instagram.
					</p>
				</div>

				<Separator />

				<div className="p-6 overflow-y-auto max-h-[calc(100vh-170px)]">
					<div className="p-6 border-[1px] shadow-sm rounded-xl border-gray-200">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<Image
									alt="Foto de perfil"
									className="rounded-full"
									width={40}
									height={40}
									src="/default-profile.jpg"
								/>
								<div>
									{loading && <div className="w-28 h-4 bg-gray-200 animate-pulse rounded-md" />}
									{!loading && (
										<p className="font-semibold text-base">@{selectedAccount?.username}</p>
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
							/>
						</div>

						<div className="flex items-center justify-between py-3">
							<div className="flex gap-4">
								<Heart fill="currentColor" size={24} className="cursor-pointer text-red-500" />
								<MessageCircle size={24} className="cursor-pointer text-gray-600 hover:text-blue-500" />
								<Send size={24} className="cursor-pointer text-gray-600 hover:text-green-500" />
							</div>
						</div>

						<div className="text-sm">
							{loading && <div className="w-28 h-4 bg-gray-200 animate-pulse rounded-md" />}
							{!loading && (
								<p className="text-gray-500 mt-4">
									<span className="font-semibold">@{selectedAccount?.username}</span> {caption}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

'use client';
import { useState } from 'react';
import { Separator } from '@components/ui/separator';
import { Textarea } from '@components/ui/textarea';
import { Instagram, Heart, MessageCircle, Send, Calendar, ChevronDown, Link } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@components/ui/button";
import { Calendar as ShadCalendar } from '@components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu';
import { Input } from '@components/ui/input';
import { Badge } from "@components/ui/badge"

export default function PostDetails() {
	const [showCalendar, setShowCalendar] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedTime, setSelectedTime] = useState<string>('');
	const [selectedAccount, setSelectedAccount] = useState('@ericlbarreto');

	const accounts = ['@ericlbarreto', '@meunegocio', '@outraconta'];

	const toggleCalendar = () => {
		setShowCalendar(!showCalendar);
	};

	return (
		<div className="flex gap-6 items-center w-full h-screen bg-gray-100 p-6 overflow-y-hidden">
			<div className="w-[60%] bg-white rounded-lg h-full shadow-md flex flex-col">
				<div className="p-6">
					<p className="text-xl font-semibold text-gray-900">Novo post</p>
					<p className="text-sm text-gray-500">
						Preencha os detalhes do seu post, escolha a conta, defina a legenda e, se desejar, agende a data e horário da publicação.
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
									<Button variant={'outline'} className="flex items-center justify-between rounded-lg h-8">
										<div className="flex items-center gap-2">
											<Instagram size={18} className="text-purple-500" />
											<p className="font-semibold">{selectedAccount}</p>
										</div>
										<ChevronDown size={24} className="text-black" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="w-56 mt-2">
									{accounts.map((account) => (
										<DropdownMenuItem key={account} onClick={() => setSelectedAccount(account)}>
											<Image
												alt="Foto de perfil"
												className="rounded-full"
												width={24}
												height={24}
												src="/default-profile.jpg"
											/>
											{account}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<div>
							<Badge className='bg-green-500 hover:bg-green-400 transition-all duration-500'>
								<Link size={14} className='mr-1'/>
								Conta conectada
							</Badge>
						</div>
					</div>

					<div className="p-6 border-[1px] shadow-xs rounded-xl border-gray-200 flex flex-col gap-2">
						<p className="font-semibold text-base">Descrição</p>
						<Textarea className="h-32" placeholder="Escreva a legenda do seu post..." />
					</div>

					<div className="flex flex-col gap-4">
						<Button className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-400 hover:to-purple-500 transition-all duration-500" disabled={showCalendar}>
							Postar agora
						</Button>

						<Button
							variant="outline"
							className="w-full p-4 flex items-center justify-center gap-2"
							onClick={toggleCalendar}
						>
							<Calendar size={18} /> Postar depois
						</Button>

						{showCalendar && (
							<div className="p-6 mt-3 border rounded-lg shadow-sm flex flex-col items-center w-full bg-gray-50">
								<p className="text-sm text-gray-700 text-center mb-2">
									📅 Escolha uma <span className='font-semibold'>data</span> e um ⏰ <span className='font-semibold'>horário</span> para o agendamento do post.
								</p>

								<ShadCalendar
									mode="single"
									selected={selectedDate}
									onSelect={setSelectedDate}
								/>

								<div className="w-full mt-4 flex flex-col">
									<p className="text-sm text-gray-700 mb-1">Escolha o horário:</p>
									<Input
										type="time"
										value={selectedTime}
										onChange={(e) => setSelectedTime(e.target.value)}
									/>
								</div>

								<Button disabled={!selectedDate || !selectedTime} className="w-full p-4 mt-4 bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-400 hover:to-purple-500 transition-all duration-500">
										Agendar Post para {selectedDate ? selectedDate.toLocaleDateString() : ' - '} às {selectedTime || ' - '}
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="w-[40%] bg-white rounded-lg h-full shadow-md">
				<div className="p-6">
					<p className="text-xl font-semibold text-gray-900">Pré-visualização</p>
					<p className="text-sm text-gray-500">
						Aqui está uma prévia de como seu post aparecerá no Instagram.
					</p>
				</div>

				<Separator />

				<div className='p-6'>
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
									<p className="font-semibold text-base">@ericlbarreto</p>
									<p className="text-xs text-gray-500">Agora mesmo</p>
								</div>
							</div>
							<Instagram size={20} color="gray" />
						</div>

						<div className="w-full h-64 relative rounded-lg overflow-hidden">
							<Image
								alt="Imagem do post"
								layout="fill"
								objectFit="cover"
								src="/default-profile.jpg"
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
							<p className='text-gray-500'><span className="text-gray-950 font-semibold">@ericlbarreto</span> Aqui está a legenda do seu post...</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

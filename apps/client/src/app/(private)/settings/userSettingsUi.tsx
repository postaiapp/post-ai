'use client';

import { ItemSideBarUserSettings, itemsSideBarUserSettings } from "@common/constants/user";
import { User } from "@common/interfaces/user";
import { DeleteModal } from "@components/dataTable/deleteModal";
import { Separator } from "@components/ui/separator";
import { cn } from "@lib/utils";
import { JSX, useMemo } from "react";
import UserDetailsContainer from "./components/userDetails";

export default function UserSettingsUi({
	user,
	activeItem,
	setActiveItem,
	handleDeleteAccount,
}: {
	user: User | null;
	handleDeleteAccount: () => Promise<void>;
	activeItem: string;
	setActiveItem: (item: string) => void;
}) {
	const renderContent = useMemo(() => {
		const contentMap: Record<string, JSX.Element> = {
			profile: <UserDetailsContainer user={user} />,
			security: <div>Security Settings</div>,
			delete: <div>Delete Account Confirmation</div>,
		};

		return contentMap[activeItem] || <UserDetailsContainer user={user} />;
	}, [activeItem]);

	const itemSideBar = useMemo(() => (item: ItemSideBarUserSettings) => (
		item.value === "delete" ? (
			<DeleteModal
				key={item.value}
				textButton="Excluir Conta"
				icon={item.icon}
				modalTitle="Você tem certeza?"
				modalDescription="Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e removerá seus dados de nossos servidores."
				onClick={handleDeleteAccount}
			/>
		) : (
			<div
				key={item.value}
				onClick={() => setActiveItem(item.value)}
				className={cn(
					"flex items-center justify-between p-4 cursor-pointer transition-all duration-200 rounded-lg mx-2",
					{
						"bg-purple-100 border-l-4 border-purple-500": activeItem === item.value,
						"hover:bg-gray-100 hover:text-gray-900": activeItem !== item.value,
					}
				)}
			>
				<div className="flex items-center gap-4">
					<item.icon
						className={cn("text-gray-900 font-medium text-lg", {
							"text-red-500": item.value === "delete",
						})}
					/>
					<p
						className={cn("text-gray-900", {
							"text-red-500": item.value === "delete",
							"font-semibold": activeItem === item.value,
						})}
					>
						{item.title}
					</p>
				</div>
			</div>
		)
	), [activeItem]);

	return (
		<div className="flex gap-6 items-center w-full h-screen bg-gray-100 p-6 overflow-hidden">
			<div className="flex flex-col gap-4 w-full h-full">
				<div className="flex flex-col mb-4">
					<p className="text-xl font-semibold text-gray-900">Configurações da Conta</p>
				</div>

				<div className="bg-white shadow-md rounded-lg py-6 flex w-full h-[80%] justify-around items-start">
					<div className="flex flex-col h-full w-1/5 py-4 px-2 gap-3">
						{itemsSideBarUserSettings.map((item) => itemSideBar(item))}
					</div>

					<Separator className="my-4" orientation="vertical" />

					<div className="flex flex-col h-full w-4/5 bg-white p-6">
						{renderContent}
					</div>
				</div>
			</div>
		</div>
	);
}
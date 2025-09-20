import { Sparkles, Trash, UserCheck2 } from "lucide-react";

export interface ItemSideBarUserSettings {
    title: string;
    value: string;
    icon: React.ComponentType<any>;
    action?: string;
}

const itemsSideBarUserSettings = [
	{
		title: 'Perfil',
		value: 'profile',
		icon: UserCheck2,
	},
	{
		title: 'Personalização',
		value: 'ai-training',
		icon: Sparkles,
	},
	{
		title: 'Deletar conta',
		value: 'delete',
        action: 'logout',
		icon: Trash,
	},
];

export { itemsSideBarUserSettings };

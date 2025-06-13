import { UserPlatform } from './user-platforms';

export interface HeaderProps {
	accounts?: UserPlatform[];
	selectedAccount?: UserPlatform;
	goToEditProfile: () => void;
	handleLogout: () => void;
	handleSelectPlatform: (platform: UserPlatform) => void;
}

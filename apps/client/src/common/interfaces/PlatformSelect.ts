import { UserPlatform } from './user-platforms';

export interface PlatformSelectProps {
	userPlatforms: UserPlatform[];
	handleDisconnectPlatform: (platform: UserPlatform) => void;
	openPlatformModal: () => void;
	onSelectPlatform: (platform: UserPlatform) => void;
	selectedPlatform: UserPlatform | null;
}

import { PLATFORMS_ICONS } from '@/common/constants/platforms';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HomePlatformFilterProps {
	selectedPlatform: number;
	onPlatformChange: (platform: number) => void;
	isLoading: boolean;
}

export const HomePlatformFilter = ({ selectedPlatform, onPlatformChange, isLoading }: HomePlatformFilterProps) => {
	return (
		<div className="flex items-center gap-2">
			<Select
				disabled={isLoading}
				value={selectedPlatform.toString()}
				defaultValue={PLATFORMS_ICONS[0]?.id.toString() || '-1'}
				onValueChange={value => onPlatformChange(value === '-1' ? -1 : parseInt(value, 10))}
			>
				<SelectTrigger className="w-48 bg-white border-slate-200">
					<SelectValue placeholder="Selecionar plataforma" />
				</SelectTrigger>
				<SelectContent className="bg-white border-slate-200 shadow-lg z-50">
					{PLATFORMS_ICONS?.map(platform => (
						<SelectItem
							key={platform.id}
							disabled={!platform.enabled}
							value={platform.id.toString()}
							className="hover:bg-slate-50"
						>
							<div className="flex items-center gap-2">
								{platform.icon}
								{platform.label}
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
};

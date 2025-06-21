import { Platform } from '@models/platform.model';

export class PlatformUtils {
	public static getTokenName(platform: Platform): string {
		return `${platform.name}_token`;
	}
}

export default PlatformUtils;

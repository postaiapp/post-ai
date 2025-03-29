export class FileUtils {
	public static getUnsignedUrl(url: string): string {
		const parts = url.split('?');
		return parts[0];
	}

	public static getFileExtension(filename: string): string {
		return filename.substring(filename.lastIndexOf('.'));
	}

	public static isImage(mimeType: string): boolean {
		return mimeType.startsWith('image/');
	}
}

export default FileUtils;

export interface GenerateImageOptions {
	prompt: string;
	n?: number;
	size?: string;
	style?: string;
}

export interface GeneratedImage {
	url: string;
}

export abstract class ImageGenerationService {
	abstract generateImage(options: GenerateImageOptions): Promise<GeneratedImage>;
}

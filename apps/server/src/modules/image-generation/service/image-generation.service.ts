import { GeneratedImage, GenerateImageOptions } from '@type/post';

export abstract class ImageGenerationService {
	abstract generateImage(options: GenerateImageOptions): Promise<GeneratedImage>;
}

export { GenerateImageOptions, GeneratedImage };

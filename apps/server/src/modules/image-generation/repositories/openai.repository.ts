import { DEFAULT_PROMPT } from '@constants/ai';
import { ImageGenerationService } from '@modules/image-generation/service/image-generation.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { R2Storage } from '@storages/r2-storage';
import { GenerateImageOptions, GeneratedImage } from '@type/post';
import OpenAI from 'openai';

@Injectable()
export class OpenAIRepository implements ImageGenerationService {
	private openai: OpenAI;

	constructor(
		private configService: ConfigService,
		private storageService: R2Storage,
	) {
		const apiKey = this.configService.get<string>('OPENAI_API_KEY');
		this.openai = new OpenAI({ apiKey });
	}

	generatePrompt(prompt: string): string {
		return `${DEFAULT_PROMPT}\n${prompt}`;
	}

	async generateImage(options: GenerateImageOptions): Promise<GeneratedImage> {
		const mountedPrompt = this.generatePrompt(options.prompt);

		const response = await this.openai.images.generate({
			model: 'gpt-image-1',
			prompt: mountedPrompt,
			n: options.n || 1,
			quality: 'medium',
			size: '1024x1024',
			output_format: 'jpeg',
		});

		const base64 = response.data[0].b64_json;

		const image = Buffer.from(base64, 'base64');

		const { key } = await this.storageService.upload({
			fileName: 'image.png',
			fileType: 'image/png',
			body: image,
		});

		const signedUrl = await this.storageService.getSignedImageUrlByPath(key);

		return {
			url: signedUrl,
		};
	}
}

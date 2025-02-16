import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
	ImageGenerationService,
	GenerateImageOptions,
	GeneratedImage,
} from '@modules/image-generation/service/image-generation.service';
import { DEFAULT_PROMPT } from '@constants/ai';
import { R2Storage } from '@storages/r2-storage';

@Injectable()
export class IdeogramRepository implements ImageGenerationService {
	private readonly apiKey: string;
	private readonly baseUrl = 'https://api.ideogram.ai';

	constructor(
		private configService: ConfigService,
		private storageService: R2Storage
	) {
		this.apiKey = this.configService.get<string>('IDEOGRAM_API_KEY');
	}

	generatePrompt(prompt: string): string {
		return `${DEFAULT_PROMPT}\n${prompt}`;
	}

	async generateImage(options: GenerateImageOptions): Promise<GeneratedImage> {
		const mountedPrompt = this.generatePrompt(options.prompt);

		const mountedGenerateImagePayload = {
			image_request: {
				prompt: mountedPrompt,
				model: 'V_2',
				magic_prompt_option: 'AUTO',
				num_images: options.n || 1,
				resolution: 'RESOLUTION_1024_1024',
			},
		};

		const response = await axios.post(`${this.baseUrl}/generate`, mountedGenerateImagePayload, {
			headers: {
				'Api-Key': this.apiKey,
				'Content-Type': 'application/json',
			},
		});

		const url = response.data.data[0].url;

		const uploadedImage = await this.storageService.downloadAndUploadImage(url);

		return {
			url: uploadedImage.url,
		};
	}
}

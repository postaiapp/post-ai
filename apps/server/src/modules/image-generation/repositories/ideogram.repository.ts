import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import {
	ImageGenerationService,
	GenerateImageOptions,
	GeneratedImage,
} from '@modules/image-generation/service/image-generation.service';
import { DEFAULT_PROMPT } from '@constants/ai';

@Injectable()
export class IdeogramRepository implements ImageGenerationService {
	private readonly apiKey: string;
	private readonly baseUrl = 'https://api.ideogram.ai/api/v1';

	constructor(private configService: ConfigService) {
		this.apiKey = this.configService.get<string>('IDEOGRAM_API_KEY');
	}

	generatePrompt(prompt: string): string {
		return `${DEFAULT_PROMPT}\n${prompt}`;
	}

	async generateImage(options: GenerateImageOptions): Promise<GeneratedImage> {
		const mountedPrompt = this.generatePrompt(options.prompt);

		const response = await axios.post(
			`${this.baseUrl}/generate`,
			{
				prompt: mountedPrompt,
				style: options.style,
				n: options.n || 1,
			},
			{
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
					'Content-Type': 'application/json',
				},
			}
		);

		const url = response.data.images[0].url;

		return {
			url,
		};
	}
}

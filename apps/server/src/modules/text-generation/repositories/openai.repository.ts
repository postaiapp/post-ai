import { CAPTION_PROMPT } from '@constants/ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateTextOptions, GeneratedText } from '@type/text-generation';
import OpenAI from 'openai';
import { TextGenerationService } from '@modules/text-generation/service/text-generation.service';

@Injectable()
export class OpenAIRepository implements TextGenerationService {
	private openai: OpenAI;

	constructor(private configService: ConfigService) {
		const apiKey = this.configService.get<string>('OPENAI_API_KEY');
		this.openai = new OpenAI({ apiKey });
	}

	generatePrompt(prompt: string): string {
		return `${CAPTION_PROMPT}\n${prompt}`;
	}

	async generateText({ prompt }: GenerateTextOptions): Promise<GeneratedText> {
		const mountedPrompt = this.generatePrompt(prompt);

		const response = await this.openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'user',
					content: mountedPrompt,
				},
			],
		});

		const text = response.choices[0].message.content;

		return {
			text,
		};
	}
}

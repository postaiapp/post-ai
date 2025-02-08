import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';
import { CreateOpenaiDto } from './dto/create-openai.dto';
import { DEFAULT_PROMPT } from '@constants/ai';
import { R2Storage } from '@storages/r2-storage';

@Injectable()
export class OpenaiService {
    private readonly openai: OpenAI;

    constructor(
        private configService: ConfigService,
        private storageService: R2Storage
    ) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        this.openai = new OpenAI({ apiKey });
    }

    generatePrompt(prompt: string): string {
        return `${DEFAULT_PROMPT}\n${prompt}`;
    }

    async generateImage(createOpenaiDto: CreateOpenaiDto): Promise<{ url: string }> {
        const { prompt } = createOpenaiDto;

        const mountedPrompt = this.generatePrompt(prompt);

        const response = await this.openai.images.generate({
            model: 'dall-e-3',
            prompt: mountedPrompt,
            n: 1,
            quality: 'standard',
            size: '1024x1024',
        });

        const url = response.data[0].url;

        const uploadedImage = await this.storageService.downloadAndUploadImage(url);

        return {
            url: uploadedImage.url,
        };
    }
}

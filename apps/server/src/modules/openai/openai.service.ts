import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { ConfigService } from '@nestjs/config';
import { CreateOpenaiDto } from './dto/create-openai.dto';
import { DEFAULT_PROMPT } from '@constants/ai';
import { R2Storage } from '@storages/r2-storage';
import axios from 'axios';

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
        console.log(mountedPrompt, 'mountedPrompt')
        // const response = await this.openai.images.generate({
        //     model: 'dall-e-3',
        //     prompt: mountedPrompt,
        //     n: 1,
        //     quality: 'standard',
        //     size: '1024x1024',
        // });

        // const url = response.data[0].url;
        const url = 'https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg';

        const generatedImageBuffer = await axios.get(url, { responseType: 'arraybuffer' });

        const mimeType = generatedImageBuffer.headers['content-type'];
        console.log(mimeType, 'mimeType')
        const uploadedFileKey = await this.storageService.upload({
            fileType: mimeType,
            fileName: 'generated-image.jpg',
            body: generatedImageBuffer.data,
        });
        console.log(uploadedFileKey, 'uploadedFileKey');

        const signedUrl = await this.storageService.getSignedUrl(uploadedFileKey.url);
        console.log(signedUrl, 'signedUrl');
        return {
            url,
        };
    }
}

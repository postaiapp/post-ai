import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { CreateOpenaiDto } from './dto/create-openai.dto';

@Controller('openai')
export class OpenaiController {
    constructor(private readonly openaiService: OpenaiService) {}

    @Post()
    async generateImage(@Body() createOpenaiDto: CreateOpenaiDto) {
        try {
            const response = await this.openaiService.generateImage(createOpenaiDto);

            return response;
        } catch (error) {
            console.error(error);

            return error;
        }
    }
}

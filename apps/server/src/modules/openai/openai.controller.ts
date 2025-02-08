import { Controller, Post, Body, Request, Response, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@guards/auth.guard';
import { OpenaiService } from './openai.service';
import { CreateOpenaiDto } from './dto/create-openai.dto';
import BaseController from '@utils/base-controller';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

@UseGuards(AuthGuard)
@Controller('openai')
export class OpenaiController extends BaseController {
    constructor(private readonly openaiService: OpenaiService) {
        super();
    }

    @Post()
    async generateImage(
        @Body() createOpenaiDto: CreateOpenaiDto,
        @Request() req: ExpressRequest,
        @Response() res: ExpressResponse
    ) {
        try {
            const response = await this.openaiService.generateImage(createOpenaiDto);

            return this.sendSuccess({ data: response, res });
        } catch (error) {
            return this.sendError({ error, res });
        }
    }
}

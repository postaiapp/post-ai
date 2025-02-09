import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Post, Response, UseGuards } from '@nestjs/common';
import BaseController from '@utils/base-controller';
import { Response as ExpressResponse } from 'express';
import { CreateOpenaiDto } from '../dto/openai.dto';
import { OpenaiService } from '../service/openai.service';

@UseGuards(AuthGuard)
@Controller('openai')
export class OpenaiController extends BaseController {
	constructor(private readonly openaiService: OpenaiService) {
		super();
	}

	@Post()
	async generateImage(@Body() createOpenaiDto: CreateOpenaiDto, @Response() res: ExpressResponse) {
		try {
			const response = await this.openaiService.generateImage(createOpenaiDto);

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}
}

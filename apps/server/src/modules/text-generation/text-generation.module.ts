import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAIRepository } from '@modules/text-generation/repositories/openai.repository';
import { TextGenerationService } from '@modules/text-generation/service/text-generation.service';

@Module({
	imports: [ConfigModule],
	providers: [
		OpenAIRepository,
		{
			provide: TextGenerationService,
			useClass: OpenAIRepository,
		},
	],
	exports: [TextGenerationService],
})
export class TextGenerationModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ImageGenerationService } from '@modules/image-generation/service/image-generation.service';
import { OpenAIRepository } from '@modules/image-generation/repositories/openai.repository';
import { R2Storage } from '@storages/r2-storage';
import { IdeogramRepository } from '@modules/image-generation/repositories/ideogram.repository';

@Module({
	imports: [ConfigModule],
	providers: [
		OpenAIRepository,
		IdeogramRepository,
		R2Storage,
		{
			provide: ImageGenerationService,
			useClass: OpenAIRepository,
		},
	],
	exports: [ImageGenerationService],
})
export class ImageGenerationModule {}

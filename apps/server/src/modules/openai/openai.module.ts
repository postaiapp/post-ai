import { Module } from '@nestjs/common';
import { OpenaiController } from './controller/openai.controller';
import { OpenaiService } from './service/openai.service';
import { ImageGenerationModule } from '@modules/image-generation/image-generation.module';

@Module({
	imports: [ImageGenerationModule],
	controllers: [OpenaiController],
	providers: [OpenaiService],
	exports: [OpenaiService],
})
export class OpenaiModule {}

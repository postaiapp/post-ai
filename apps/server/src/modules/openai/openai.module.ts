import { Module } from '@nestjs/common';
import { R2Storage } from '@storages/r2-storage';
import { OpenaiController } from './controller/openai.controller';
import { OpenaiService } from './service/openai.service';
import { ImageGenerationModule } from '@modules/image-generation/image-generation.module';

@Module({
	imports: [ImageGenerationModule],
	controllers: [OpenaiController],
	providers: [OpenaiService, R2Storage],
})
export class OpenaiModule {}

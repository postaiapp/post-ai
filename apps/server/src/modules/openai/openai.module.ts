import { Module } from '@nestjs/common';
import { R2Storage } from '@storages/r2-storage';
import { OpenaiController } from './controller/openai.controller';
import { OpenaiService } from './service/openai.service';

@Module({
	controllers: [OpenaiController],
	providers: [OpenaiService, R2Storage],
})
export class OpenaiModule {}

import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { R2Storage } from '@storages/r2-storage';

@Module({
    controllers: [OpenaiController],
    providers: [OpenaiService, R2Storage],
})
export class OpenaiModule {}

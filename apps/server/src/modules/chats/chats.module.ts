import { OpenaiModule } from '@modules/openai/openai.module';
import { OpenaiService } from '@modules/openai/service/openai.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '@schemas/chat.schema';
import { ImageGenerationModule } from '../image-generation/image-generation.module';
import { ChatsController } from './controller/chats.controller';
import { ChatsService } from './services/chats.service';
import { StorageModule } from '@storages/storage.module';
import { TextGenerationModule } from '@modules/text-generation/text-generation.module';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
		OpenaiModule,
		ImageGenerationModule,
		TextGenerationModule,
		StorageModule,
	],
	controllers: [ChatsController],
	providers: [ChatsService, OpenaiService],
})
export class ChatsModule {}

import { TextGenerationModule } from '@modules/text-generation/text-generation.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '@schemas/chat.schema';
import { StorageModule } from '@storages/storage.module';
import { ImageGenerationModule } from '../image-generation/image-generation.module';
import { ChatsController } from './controller/chats.controller';
import { ChatsService } from './services/chats.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
		ImageGenerationModule,
		TextGenerationModule,
		StorageModule,
	],
	controllers: [ChatsController],
	providers: [ChatsService, ],
})
export class ChatsModule {}

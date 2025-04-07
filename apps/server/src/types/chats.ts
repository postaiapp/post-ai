import { CreateChatDto, GenerateCaptionParamsDto, ListChatInteractionsParamsDto, RegenerateMessageDto } from '@modules/chats/dto/chats.dto';
import { Meta } from './meta';
interface SendMessageData {
	data: CreateChatDto;
	meta: Meta;
}

interface RegenerateMessageData {
	data: RegenerateMessageDto;
	meta: Meta;
}
interface ListChatInteractionsOptions {
	params: ListChatInteractionsParamsDto;
	meta: Meta;
}

interface GenerateCaptionOptions {
	filter: GenerateCaptionParamsDto;
	meta: Meta;
}

export type { ListChatInteractionsOptions, RegenerateMessageData, SendMessageData, GenerateCaptionOptions };

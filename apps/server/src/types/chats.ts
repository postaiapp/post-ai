import { CreateChatDto, ListChatInteractionsParamsDto } from '@modules/chats/dto/chats.dto';
import { Meta } from './meta';

interface SendMessageData {
	data: CreateChatDto;
	meta: Meta;
}

interface ListChatInteractionsOptions {
	params: ListChatInteractionsParamsDto;
	meta: Meta;
}

export type { ListChatInteractionsOptions, SendMessageData };

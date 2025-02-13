import { CreateChatDto } from '@modules/chats/dto/chats.dto';
import { Meta } from './meta';

interface SendMessageData {
	data: CreateChatDto;
	meta: Meta;
}

export type { SendMessageData };

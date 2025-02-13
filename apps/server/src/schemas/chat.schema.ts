import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Interaction, InteractionSchema } from './interaction.schema';

@Schema({ timestamps: true })
export class Chat {
	@Prop({ required: true })
	user_id: number;

	@Prop()
	finished_at: Date;

	@Prop({ type: [InteractionSchema], default: [] })
	interactions: Interaction[];
}

export type ChatDocument = HydratedDocument<Chat>;

export const ChatSchema = SchemaFactory.createForClass(Chat);

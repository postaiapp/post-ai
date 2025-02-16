import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Interaction, InteractionSchema } from './interaction.schema';

@Schema({ timestamps: true, versionKey: false })
export class Chat {
	@Prop({ required: true })
	user_id: string;

	@Prop()
	finished_at: Date;

	@Prop({ type: [InteractionSchema], default: [] })
	interactions: Interaction[];

	@Prop({ required: true })
	first_message: string;

	@Prop({ default: new Date(), required: false })
	created_at: Date;
}

export type ChatDocument = HydratedDocument<Chat>;

export const ChatSchema = SchemaFactory.createForClass(Chat);

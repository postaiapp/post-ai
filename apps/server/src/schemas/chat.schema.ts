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

	@Prop({ required: true })
	createdAt: Date;

	@Prop({ required: true })
	updatedAt: Date;
}

export type ChatDocument = HydratedDocument<Chat>;

export const ChatSchema = SchemaFactory.createForClass(Chat);

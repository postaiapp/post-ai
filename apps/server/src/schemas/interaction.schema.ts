import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class Interaction {
	@Prop({ required: true })
	user_id: number;

	@Prop({ required: true })
	request: string;

	@Prop({ required: true })
	response: string;

	@Prop({ default: false })
	is_regenerated: boolean;

	@Prop({ required: false })
	created_at?: Date;
}

export type InteractionDocument = HydratedDocument<Interaction>;

export const InteractionSchema = SchemaFactory.createForClass(Interaction);

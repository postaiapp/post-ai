import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Interaction {
	@Prop({ required: true })
	user_id: string;

	@Prop({ required: true })
	request: string;

	@Prop({ required: true })
	response: string;

	@Prop({ default: false })
	is_regenerated: boolean;

	@Prop({ required: false })
	createdAt: Date;

	@Prop({ required: false })
	updatedAt: Date;
}

export type InteractionDocument = HydratedDocument<Interaction>;

export const InteractionSchema = SchemaFactory.createForClass(Interaction);

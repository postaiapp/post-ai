import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { InstagramAccount, InstagramAccountSchema } from './instagram-account.schema';

@Schema({ versionKey: false })
export class User {
	@Prop({ required: true, type: String })
	name: string;

	@Prop({ required: false, type: String, default: '' })
	cpf?: string;

	@Prop({ required: false, type: String, default: '' })
	phone?: string;

	@Prop({ required: false, type: String, default: '' })
	city?: string;

	@Prop({ required: false, type: String, default: '' })
	country?: string;

	@Prop({ required: true, unique: true, type: String })
	email: string;

	@Prop({ required: true })
	password: string;

	@Prop({ type: [InstagramAccountSchema], default: [] })
	InstagramAccounts: InstagramAccount[];
}

export const UserSchema = SchemaFactory.createForClass(User);

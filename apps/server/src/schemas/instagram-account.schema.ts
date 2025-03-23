import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Session } from './token';
@Schema({ versionKey: false })
export class InstagramAccount {
	@Prop({ required: true, type: String })
	accountId: string;

	@Prop({ required: true, type: String })
	username: string;

	@Prop({ required: false, type: String, default: '' })
	fullName: string;

	@Prop({ required: false, type: String, default: '' })
	biography: string;

	@Prop({ required: true, type: Number, default: 0 })
	followerCount: number;

	@Prop({ required: true, type: Number, default: 0 })
	followingCount: number;

	@Prop({ required: true, type: Number, default: 0 })
	postCount: number;

	@Prop({ required: true, type: String })
	profilePicUrl: string;

	@Prop({ required: true, type: Date })
	lastLogin: Date;

	@Prop({ required: false, type: Boolean, default: false })
	isPrivate?: boolean;

	@Prop({ required: false, type: Boolean, default: false })
	isVerified?: boolean;

	@Prop({ type: Session, required: true })
	session: Session;
}

export type InstagramAccountDocument = InstagramAccount & Document;

export const InstagramAccountSchema = SchemaFactory.createForClass(InstagramAccount);

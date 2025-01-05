import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { InstagramAccount, InstagramAccountSchema } from './instagramAccount.schema';

@Schema({ versionKey: false })
export class User {
    @Prop({ type: SchemaTypes.ObjectId, default: new Types.ObjectId() })
    _id: Types.ObjectId;

    @Prop({ required: true, type: String })
    name: string;

    @Prop({ required: true, unique: true, type: String })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: [InstagramAccountSchema], default: [] })
    InstagramAccounts: InstagramAccount[];
}

export const UserSchema = SchemaFactory.createForClass(User);

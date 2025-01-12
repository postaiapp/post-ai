import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';
import { InstagramAccount, InstagramAccountSchema } from './instagramAccount.schema';

@Schema({ versionKey: false })
export class User extends BaseSchema {
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

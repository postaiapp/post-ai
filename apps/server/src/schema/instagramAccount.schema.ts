import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

@Schema({ versionKey: false })
export class InstagramAccount extends BaseSchema {
    @Prop({ required: true, type: String })
    username: string;

    @Prop({ required: true, type: String })
    instagramId: string;

    @Prop({ required: true, type: String })
    profile_pic_url: string;
}

export const InstagramAccountSchema = SchemaFactory.createForClass(InstagramAccount);

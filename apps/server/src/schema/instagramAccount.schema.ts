import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class InstagramAccount {
    @Prop({ required: true, type: String })
    username: string;

    @Prop({ required: true, type: String })
    instagramId: string;

    @Prop({ required: true, type: String })
    profile_pic_url: string;
}

export const InstagramAccountSchema = SchemaFactory.createForClass(InstagramAccount);

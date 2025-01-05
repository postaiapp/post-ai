import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class InstagramAccount {
    @Prop({ required: true, type: String })
    username: string;

    @Prop({ type: String })
    instagramId: string;

    @Prop({ type: Date })
    linkedAt?: Date;
}

export const InstagramAccountSchema =
    SchemaFactory.createForClass(InstagramAccount);

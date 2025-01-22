import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Post {
    @Prop({ required: true, type: String })
    caption: string;

    @Prop({ required: true, type: String })
    imageUrl: string;

    @Prop({ required: true, type: Date })
    publishedAt: Date;

    @Prop({ required: true, type: String })
    userId: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

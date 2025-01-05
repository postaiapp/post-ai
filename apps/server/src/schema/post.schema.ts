import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Post {
    @Prop({ required: true, type: String })
    caption: string;

    @Prop({ required: true, type: String })
    imageUrl: string;

    @Prop({ required: true, type: Date, default: () => new Date() })
    publishedAt: Date;
}

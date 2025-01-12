import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

@Schema({ versionKey: false })
export class Post extends BaseSchema {
    @Prop({ required: true, type: String })
    caption: string;

    @Prop({ required: true, type: String })
    imageUrl: string;

    @Prop({ required: true, type: Date, default: () => new Date() })
    publishedAt: Date;
}

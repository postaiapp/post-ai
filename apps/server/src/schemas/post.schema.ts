import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ versionKey: false })
export class Post {
	@Prop({ required: true, type: String })
	caption: string;

	@Prop({ required: true, type: String })
	imageUrl: string;

	@Prop({ required: false, type: Date })
	publishedAt: Date;

	@Prop({ required: false, type: Date })
	scheduledAt: Date;

	@Prop({ required: false, type: Date })
	canceledAt: Date;

	@Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

	@Prop({ required: true, type: String })
	accountId: string;

	@Prop({ required: false, type: String })
	postId: string;

	@Prop({ required: false, type: String })
	code: string;

	@Prop({ required: false, type: Boolean })
	failedToPost: boolean;

	@Prop({ required: false, type: String })
	jobId: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

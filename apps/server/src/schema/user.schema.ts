import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password_hash: string;

  @Prop()
  instagramId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

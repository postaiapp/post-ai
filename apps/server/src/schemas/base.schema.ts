import { Prop } from '@nestjs/mongoose';

export class BaseSchema {
	@Prop({
		type: Date,
		default: new Date(),
		required: false,
	})
	created_at: Date;

	@Prop({
		type: Date,
		default: null,
		required: false,
	})
	updated_at: Date;
}

import { Prop } from '@nestjs/mongoose';

export class Session {
	@Prop({ required: true, type: String })
	state: string;

	@Prop({ required: true, type: Boolean, default: false })
	isValid: boolean;

	@Prop({ required: true, type: Date, default: () => new Date() })
	lastChecked: Date;

	@Prop({ required: true, type: Date, default: () => new Date() })
	lastRefreshed: Date;
}

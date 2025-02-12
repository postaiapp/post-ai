import { Prop } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

export class BaseSchema {
    @Prop({
        type: String,
        default: () => uuidv4(),
        unique: true,
    })
    id: string;
}

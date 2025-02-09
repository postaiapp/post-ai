import { LoginDto } from '@modules/auth/dto/auth.dto';
import { Response } from 'express';

type AuthenticateType = LoginDto & {
	res: Response;
};

export type { AuthenticateType };

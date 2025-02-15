import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schemas/user.schema';
import { AuthenticateType } from '@type/auth';
import * as bcryptjs from 'bcryptjs';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { RegisterDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name)
		private readonly userModel: Model<User>,
		private readonly jwtService: JwtService,
		private readonly config: ConfigService
	) {}

	async authenticate({ email, password, res }: AuthenticateType) {
		const user = await this.userModel.findOne({ email }, { email: 1, password: 1, name: 1, _id: 1 }).lean();

		if (!user) {
			const FAKE_PASSWORD = '$2a$12$4NNIgYdnWkr4B30pT5i3feDEzWivfxyOK.oNSxk7G3GzGAVfB6vEC';
			await bcryptjs.compare(password, FAKE_PASSWORD);
			throw new UnauthorizedException('Invalid credentials');
		}

		const doesPasswordMatch = await bcryptjs.compare(password, user.password);

		if (!doesPasswordMatch) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const accessToken = await this.generateToken({ user, expiresIn: '15m' });

		const refreshToken = await this.generateToken({ user, expiresIn: '1d' });

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			maxAge: 24 * 60 * 60 * 1000, // 1 day
			path: '/',
		});

		return {
			user: {
				name: user.name,
				email: user.email,
			},
			token: accessToken,
		};
	}

	async refreshToken(req: Request) {
		const refreshToken = req.cookies['refreshToken'];

		if (!refreshToken) {
			throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
		}

		const payload = await this.jwtService.verifyAsync(refreshToken, {
			secret: this.config.get('JWT_SECRET'),
		});

		const user = await this.userModel.findById(payload.userId).lean();

		if (!user) {
			throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
		}

		const accessToken = await this.generateToken({ user, expiresIn: '15m' });

		return {
			token: accessToken,
		};
	}

	async logout(res: Response) {
		res.clearCookie('refreshToken');
	}

	async register({ name, email, password }: RegisterDto) {
		const alreadyUser = await this.userModel.findOne({ email });

		if (alreadyUser) {
			throw new UnauthorizedException('REGISTRATION_FAILED');
		}

		const password_hash = await bcryptjs.hash(password, 12);

		const newUser = await this.userModel.create({
			name,
			email,
			password: password_hash,
		});

		return {
			user: {
				name: newUser?.name,
				email: newUser?.email,
				id: newUser?._id.toString(),
			},
		};
	}

	async generateToken({ user, expiresIn }) {
		const payload = { userId: user._id, email: user.email };

		return await this.jwtService.signAsync(payload, {
			secret: this.config.get('JWT_SECRET'),
			expiresIn,
		});
	}
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import { User } from '@models/user.model';
import { RegisterDto } from '../dto/auth.dto';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User)
		private userModel: typeof User,
		private readonly jwtService: JwtService,
		private readonly config: ConfigService,
	) {}

	async authenticate({ email, password }: { email: string; password: string }) {
		const user = await this.userModel.findOne({ where: { email } });

		if (!user) {
			const FAKE_PASSWORD = '$2a$12$4NNIgYdnWkr4B30pT5i3feDEzWivfxyOK.oNSxk7G3GzGAVfB6vEC';

			await bcrypt.compare(password, FAKE_PASSWORD);

			throw new UnauthorizedException('Invalid credentials');
		}

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const accessToken = await this.generateToken({ user, expiresIn: '1d' });

		return {
			user: {
				...omit(user.toJSON(), 'password'),
				id: user.id,
			},
			token: accessToken,
		};
	}

	async register({ name, email, password }: RegisterDto) {
		const existsUser = await this.userModel.count({ where: { email } });

		if (existsUser) {
			throw new UnauthorizedException('REGISTRATION_FAILED');
		}

		const passwordHash = await bcrypt.hash(password, 12);

		const newUser = await this.userModel.create({
			name,
			email,
			password: passwordHash,
		});

		return {
			user: {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
			},
		};
	}

	generateToken({ user, expiresIn }) {
		const payload = { userId: user.id, email: user.email };

		return this.jwtService.signAsync(payload, {
			secret: this.config.get('JWT_SECRET'),
			expiresIn,
		});
	}
}

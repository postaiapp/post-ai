import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { omit } from 'lodash';
import { RegisterDto } from '../dto/auth.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UserPlatform } from '@models/user-platform.model';
import { Uploader } from '@type/storage';
import { User } from '@models/user.model';
import { StripeService } from '../../stripe/services/stripe.service';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User)
		private userModel: typeof User,
		private readonly jwtService: JwtService,
		private readonly config: ConfigService,
		@Inject(Uploader) private readonly storageService: Uploader,
		private readonly stripeService: StripeService,
	) {}

	async signAvatarFiles(user_platforms: UserPlatform[]) {
		return Promise.all(
			user_platforms.map(async platform => {
				if (platform.avatar_url) {
					platform.avatar_url = await this.storageService.getSignedImageUrl(
						platform.avatar_url,
					);
				}
			}),
		);
	}

	async authenticate({
		email,
		password,
		planKey,
	}: {
		email: string;
		password: string;
		planKey?: string;
	}) {
		let user = await this.userModel
			.scope(['withAccounts', 'withSubscription'])
			.findOne({ where: { email }, raw: false });

		console.log(user);

		if (!user) {
			const FAKE_PASSWORD = '$2a$12$4NNIgYdnWkr4B30pT5i3feDEzWivfxyOK.oNSxk7G3GzGAVfB6vEC';

			await bcrypt.compare(password, FAKE_PASSWORD);

			throw new UnauthorizedException('Invalid credentials');
		}

		user = user.toJSON();

		if (user.user_platforms?.length) {
			await this.signAvatarFiles(user.user_platforms);
		}

		const isValidPassword = await bcrypt.compare(password, user.password);

		if (!isValidPassword) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const hasActiveSubscription = this.hasActiveSubscription(user);

		console.log(hasActiveSubscription, 'hasActiveSubscription');

		console.log(planKey, 'planKey');

		if (!hasActiveSubscription && planKey) {
			const priceId = await this.stripeService.getPriceId(planKey);

			console.log(priceId, 'priceId');

			const checkoutSession = await this.stripeService.createCheckoutSession({
				userEmail: user.email,
				userId: user.id,
				planKey,
				priceId,
			});

			return {
				hasActiveSubscription: false,
				checkoutUrl: checkoutSession.url,
				token: null,
				user: {
					...omit(user, 'password'),
					id: user.id,
				},
			};
		}

		if (!hasActiveSubscription && !planKey) {
			const FAKE_PASSWORD = '$2a$12$4NNIgYdnWkr4B30pT5i3feDEzWivfxyOK.oNSxk7G3GzGAVfB6vEC';

			await bcrypt.compare(password, FAKE_PASSWORD);

			throw new UnauthorizedException('Invalid credentials');
		}

		const accessToken = await this.generateToken({ user, expiresIn: '1d' });

		return {
			hasActiveSubscription: true,
			checkoutUrl: null,
			token: accessToken,
			user: {
				...omit(user, 'password'),
				id: user.id,
			},
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

	hasActiveSubscription(user: User): boolean {
		return user.subscription?.status === 'active';
	}

	generateToken({ user, expiresIn }) {
		const payload = { userId: user.id, email: user.email };

		return this.jwtService.signAsync(payload, {
			secret: this.config.get('JWT_SECRET'),
			expiresIn,
		});
	}
}

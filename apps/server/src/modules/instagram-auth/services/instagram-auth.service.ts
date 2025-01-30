import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schemas/user.schema';
import { InstagramAccount } from '@type/instagram-account';
import { Meta } from '@type/meta';
import { AccountRepositoryLoginResponseLogged_in_user, IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { DeleteInstagramAuthDto, InstagramAuthDto } from '../dto/instagram-auth.dto';
import { mappingIntegrationsErrors } from '@constants/errors';
import { Session } from '@schemas/token';

@Injectable()
export class InstagramAuthService {
	private readonly logger = new Logger(InstagramAuthService.name);

	constructor(
		private readonly ig: IgApiClient,
		@InjectModel(User.name) private readonly userModel: Model<User>
	) {}

	async hasInstagramAccount(meta: Meta, username: string) {
		const user = await this.userModel.findOne({
			_id: meta?.userId,
		});

		if (!user) {
			throw new BadRequestException('User not found');
		}

		const existingAccount = await this.userModel
			.findOne(
				{
					_id: user?._id,
					'InstagramAccounts.username': username,
				},
				{
					_id: 0,
					InstagramAccounts: 1,
				}
			)
			.lean();

		if (!!existingAccount) {
			return {
				userId: existingAccount.InstagramAccounts[0].userId,
				session: existingAccount.InstagramAccounts[0].session,
			};
		}

		return null;
	}

	async createAccount(body: InstagramAuthDto, meta: Meta) {
		const { username } = body;

		const existingThisAccount = await this.hasInstagramAccount(meta, username);

		if (!existingThisAccount) {
			return this.addAccount(body, meta);
		}

		throw new BadRequestException('Account already exists');
	}

	async getToken(): Promise<Session> {
		try {
			const serializedState = await this.ig.state.serialize();

			const compressedState = Buffer.from(JSON.stringify(serializedState)).toString('base64');

			return {
				state: compressedState,
				lastChecked: new Date(),
				isValid: true,
				lastRefreshed: new Date(),
			};
		} catch (error) {
			this.logger.error('Failed to serialize session state', error);
			throw new BadRequestException('Failed to save session state');
		}
	}

	async restoreSession(username: string, session: Session) {
		try {
			const decompressed = Buffer.from(session.state, 'base64').toString('utf-8');
			const state = JSON.parse(decompressed);

			this.ig.state.generateDevice(username);

			await this.ig.state.deserialize(state);
			return true;
		} catch (error) {
			this.logger.error('Failed to restore session', error);
			return false;
		}
	}

	async login(body: InstagramAuthDto, meta: Meta) {
		const { password, username } = body;

		this.ig.state.generateDevice(username);

		let user: AccountRepositoryLoginResponseLogged_in_user;

		try {
			user = await this.ig.account.login(username, password);
		} catch (error) {
			this.logger.error(`Login failed for user ${username}:`, error);
			throw new BadRequestException('Invalid credentials');
		}

		const account = await this.ig.user.info(user.pk);

		const session = await this.getToken();

		const accountData: InstagramAccount = {
			userId: user.pk.toString(),
			username: account.username,
			fullName: account.full_name,
			biography: account.biography,
			followerCount: account.follower_count,
			followingCount: account.following_count,
			postCount: account.media_count,
			profilePicUrl: account.profile_pic_url,
			lastLogin: new Date(),
			isPrivate: account.is_private,
			isVerified: account.is_verified,
			session,
		};

		await this.userModel
			.findOneAndUpdate(
				{
					_id: meta?.userId,
					InstagramAccounts: {
						$elemMatch: { userId: user.pk.toString() },
					},
				},
				{
					$set: {
						'InstagramAccounts.$': accountData,
					},
				},
				{
					new: true,
				}
			)
			.lean();

		return {
			username: account.username,
			fullName: account.full_name,
			biography: account.biography,
			followerCount: account.follower_count,
			followingCount: account.following_count,
			postCount: account.media_count,
			profilePicUrl: account.profile_pic_url,
			lastLogin: new Date(),
			userid: user.pk.toString(),
			isPrivate: account.is_private,
			isVerified: account.is_verified,
		};
	}

	async addAccount(body: InstagramAuthDto, meta: Meta) {
		const { username, password } = body;

		this.ig.state.generateDevice(username);

		try {
			const user = await this.ig.account.login(username, password);

			const userInfo = await this.ig.user.info(user.pk);

			const session = await this.getToken();

			const userData: InstagramAccount = {
				userId: user.pk.toString(),
				username: user.username,
				fullName: userInfo.full_name,
				biography: userInfo.biography,
				followerCount: userInfo.follower_count,
				followingCount: userInfo.following_count,
				postCount: userInfo.media_count,
				profilePicUrl: userInfo.profile_pic_url,
				lastLogin: new Date(),
				isPrivate: userInfo.is_private,
				isVerified: userInfo.is_verified,
				session,
			};

			const newUser = await this.userModel
				.findOneAndUpdate(
					{ email: meta.email },
					{ $push: { InstagramAccounts: userData } },
					{
						_id: 0,
						new: true,
						select: {
							email: 1,
							'InstagramAccounts.username': 1,
							'InstagramAccounts.userId': 1,
							_id: 0,
						},
					}
				)
				.lean();

			if (!newUser) {
				throw new BadRequestException('Error adding account');
			}

			return {
				message: 'Login successful',
				newUser,
			};
		} catch (error) {
			const { logger, exception } = mappingIntegrationsErrors(error.message, username);

			this.logger.error(logger);
			throw new BadRequestException(exception);
		}
	}

	async getAccounts(meta: Meta) {
		const user = await this.userModel.findOne({ _id: meta.userId }, { InstagramAccounts: 1, _id: 0 }).lean();

		const accounts =
			user?.InstagramAccounts?.map((account: InstagramAccount) => ({
				...account,
				id: account._id.toString(),
				_id: undefined,
			})) || [];

		return {
			accounts,
		};
	}

	async delete(body: DeleteInstagramAuthDto, meta: Meta) {
		const { username } = body;

		const newUser = await this.userModel
			.findOneAndUpdate(
				{ _id: meta.userId },
				{
					$pull: {
						InstagramAccounts: { username: username },
					},
				},
				{ new: true }
			)
			.lean();

		if (!newUser) {
			throw new BadRequestException('User not found');
		}

		return {
			message: 'Account deleted successfully',
			instagramAccounts: newUser.InstagramAccounts,
		};
	}
}

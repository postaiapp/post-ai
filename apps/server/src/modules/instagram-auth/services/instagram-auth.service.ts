import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schemas/user.schema';
import { InstagramAccount } from '@type/instagram-account';
import { Meta } from '@type/meta';
import * as crypto from 'crypto';
import { scrypt } from 'crypto';
import { AccountRepositoryLoginResponseLogged_in_user, IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import { promisify } from 'util';
import { DeleteInstagramAuthDto, InstagramAuthDto } from '../dto/instagram-auth.dto';

const scryptAsync = promisify(scrypt);

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

		const existingAccount = await this.userModel.countDocuments({
			_id: user?._id,
			'InstagramAccounts.username': username,
		});

		if (existingAccount > 0) {
			return true;
		}

		return false;
	}

	async createAccount(body: InstagramAuthDto, meta: Meta) {
		const { username } = body;

		const existingThisAccount = await this.hasInstagramAccount(meta, username);

		if (!existingThisAccount) {
			return this.addAccount(body, meta);
		}

		throw new BadRequestException('Account already exists');
	}

	async login(body: InstagramAuthDto, meta: Meta) {
		const { password, username } = body;

		let user = {} as AccountRepositoryLoginResponseLogged_in_user;

		this.ig.state.generateDevice(username);

		try {
			user = await this.ig.account.login(username, password);
		} catch (error) {
			this.logger.error(`Login failed for user ${username}:`, error);
			throw new BadRequestException('Invalid credentials');
		}

		const account = await this.ig.user.info(user.pk);

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
						'InstagramAccounts.$.username': account.username,
						'InstagramAccounts.$.fullName': account.full_name,
						'InstagramAccounts.$.biography': account.biography,
						'InstagramAccounts.$.followerCount': account.follower_count,
						'InstagramAccounts.$.followingCount': account.following_count,
						'InstagramAccounts.$.postCount': account.media_count,
						'InstagramAccounts.$.profilePicUrl': account.profile_pic_url,
						'InstagramAccounts.$.lastLogin': new Date(),
						'InstagramAccounts.$.isPrivate': account.is_private,
						'InstagramAccounts.$.isVerified': account.is_verified,
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

			const hashedPassword = await this.generatePasswordHash(password);

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
				password: hashedPassword,
				isPrivate: userInfo.is_private,
				isVerified: userInfo.is_verified,
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
			this.logger.error(`Login failed for user ${username}:`, error);
			throw new BadRequestException('Invalid Credentials');
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

	async generatePasswordHash(password: string) {
		const salt = crypto.randomBytes(8).toString('hex');
		const hash = (await scryptAsync(password, salt, 32)) as Buffer;

		return `${hash.toString('hex')}.${salt}`;
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

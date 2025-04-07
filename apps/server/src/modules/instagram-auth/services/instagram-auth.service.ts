import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from '@schemas/token';
import { User } from '@schemas/user.schema';
import { InstagramAccount } from '@type/instagram-account';
import { Meta } from '@type/meta';
import axios from 'axios';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';
import * as dayjs from 'dayjs';
import { DeleteInstagramAuthDto, InstagramAuthDto } from '../dto/instagram-auth.dto';
import FileUtils from '@utils/file';
import { Uploader } from '@type/storage';
import { Inject } from '@nestjs/common';

@Injectable()
export class InstagramAuthService {
	private readonly logger = new Logger(InstagramAuthService.name);

	constructor(
		private readonly ig: IgApiClient,
		@Inject(Uploader) private readonly storageService: Uploader,
		@InjectModel(User.name) private readonly userModel: Model<User>
	) {}

	async hasInstagramAccount(meta: Meta, username: string) {
		const user = await this.userModel.findOne({
			_id: meta?.userId,
		});

		if (!user) {
			throw new NotFoundException('USER_NOT_FOUND');
		}

		const existingAccount = await this.userModel
			.findOne(
				{
					_id: user._id,
					'InstagramAccounts.username': username,
				},
				{
					_id: 0,
					InstagramAccounts: 1,
				}
			)
			.lean();

		if (!existingAccount) {
			return null;
		}

		return {
			accountId: existingAccount.InstagramAccounts[0].accountId,
			session: existingAccount.InstagramAccounts[0].session,
		};
	}

	async createAccount(data: InstagramAuthDto, meta: Meta) {
		const { username } = data;

		const existingThisAccount = await this.hasInstagramAccount(meta, username);

		if (!existingThisAccount) {
			return this.addAccount(data, meta);
		}

		throw new BadRequestException('ACCOUNT_ALREADY_EXISTS');
	}

	async getToken(): Promise<Session> {
		const serializedState = await this.ig.state.serialize();

		const compressedState = Buffer.from(JSON.stringify(serializedState)).toString('base64');

		return {
			state: compressedState,
			lastChecked: dayjs().toDate(),
			isValid: true,
			lastRefreshed: dayjs().toDate(),
		};
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

	async login(data: InstagramAuthDto, meta: Meta) {
		const { password, username } = data;

		this.ig.state.generateDevice(username);

		const user = await this.ig.account.login(username, password);

		const [account, session] = await Promise.all([this.ig.user.info(user.pk), this.getToken()]);

		const { url } = await this.storageService.downloadAndUploadImage(account.profile_pic_url);

		const accountData: InstagramAccount = {
			accountId: user.pk.toString(),
			username: account.username,
			fullName: account.full_name,
			biography: account.biography,
			followerCount: account.follower_count,
			followingCount: account.following_count,
			postCount: account.media_count,
			profilePicUrl: FileUtils.getUnsignedUrl(url),
			lastLogin: dayjs().toDate(),
			isPrivate: account.is_private,
			isVerified: account.is_verified,
			session,
		};

		await this.userModel
			.findOneAndUpdate(
				{
					_id: meta?.userId,
					InstagramAccounts: {
						$elemMatch: { accountId: user.pk.toString() },
					},
				},
				{
					$set: {
						'InstagramAccounts.$': accountData,
					},
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
			profilePicUrl: url,
			lastLogin: dayjs().toDate(),
			accountId: user.pk.toString(),
			isPrivate: account.is_private,
			isVerified: account.is_verified,
		};
	}

	async addAccount(data: InstagramAuthDto, meta: Meta) {
		const { username, password } = data;

		this.ig.state.generateDevice(username);

		const user = await this.ig.account.login(username, password);

		const [userInfo, session] = await Promise.all([
			this.ig.user.info(user.pk),
			this.getToken()
		]);

		const { url } = await this.storageService.downloadAndUploadImage(userInfo.profile_pic_url);

		const userData: InstagramAccount = {
			accountId: user.pk.toString(),
			username: user.username,
			fullName: userInfo.full_name,
			biography: userInfo.biography,
			followerCount: userInfo.follower_count,
			followingCount: userInfo.following_count,
			postCount: userInfo.media_count,
			profilePicUrl: FileUtils.getUnsignedUrl(url),
			lastLogin: dayjs().toDate(),
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
						'InstagramAccounts.accountId': 1,
						_id: 0,
					},
				}
			)
			.lean();

		if (!newUser) {
			throw new BadRequestException('ERROR_ADDING_ACCOUNT');
		}

		return {
			newUser,
		};
	}

	async validateProfilePicUrl(url: string): Promise<string | null> {
		try {
			await axios.get(url);
			return url;
		} catch {
			return null;
		}
	}

	async getAccounts(meta: Meta) {
		const user = await this.userModel.findOne(
			{ _id: meta.userId },
			{ InstagramAccounts: 1, _id: 0 }
		).lean();

		const accounts = await Promise.all(
			user?.InstagramAccounts.map(async (account: InstagramAccount) => {
				const profilePicUrl = await this.storageService.getSignedImageUrl(account.profilePicUrl);

				return {
					...account,
					id: account._id.toString(),
					_id: undefined,
					profilePicUrl: await this.validateProfilePicUrl(profilePicUrl),
				};
			})
		);

		return {
			accounts,
		};
	}

	async delete(data: DeleteInstagramAuthDto, meta: Meta) {
		const { username } = data;

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
			throw new BadRequestException('USER_NOT_FOUND');
		}

		return {
			instagramAccounts: newUser.InstagramAccounts,
		};
	}
}

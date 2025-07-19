import { UserPlatform } from '@models/user-platform.model';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/post.dto';
import { MetaProvider } from '../providers/meta.provider';

@Injectable()
export class MetaPostStrategy extends MetaProvider {
	constructor() {
		super();
	}

	async create(data: CreatePostDto, userPlatform: UserPlatform) {
		const profileData = userPlatform.profile_data;
		const authToken = userPlatform.auth_token;

		const { id: containerId } = await this.createMediaContainer({
			userId: profileData.instagram_user_id,
			imageUrl: data.media_url,
			caption: data.caption,
			accessToken: authToken.access_token,
		});

		const { id: postId } = await this.publishMedia({
			userId: profileData.instagram_user_id,
			creationId: containerId,
			accessToken: authToken.access_token,
		});

		return { id: postId, container_id: containerId };
	}
}

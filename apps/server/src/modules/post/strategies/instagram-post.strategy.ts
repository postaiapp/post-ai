import { Injectable } from '@nestjs/common';
import { CreatePostDto } from '../dto/post.dto';
import { UserPlatform } from '@models/user-platform.model';
import { InstagramClient } from '@clients';

@Injectable()
export class InstagramPostStrategy {
	async create(data: CreatePostDto, userPlatform: UserPlatform) {
		const containerResponse = await InstagramClient({
			method: 'POST',
			url: `/${userPlatform.profile_data.instagram_user_id}/media`,
			data: {
				image_url: data.media_url,
				caption: data.caption,
			},
			headers: {
				Authorization: `Bearer ${userPlatform.auth_token.access_token}`,
			},
		});

		const containerId = containerResponse.data.id;

		console.log(containerId, 'containerId');

		const publishResponse = await InstagramClient({
			method: 'POST',
			url: `/${userPlatform.profile_data.instagram_user_id}/media_publish`,
			data: {
				creation_id: containerId,
			},
			headers: {
				Authorization: `Bearer ${userPlatform.auth_token.access_token}`,
			},
		});

		return {
			id: publishResponse.data.id,
			container_id: containerId,
		};
	}
}

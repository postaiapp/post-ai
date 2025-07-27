import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class MetaProvider {
	private readonly api: AxiosInstance;
	private readonly logger = new Logger(MetaProvider.name);

	constructor() {
		this.api = axios.create({
			baseURL: 'https://graph.instagram.com/v21.0',
			headers: { 'Content-Type': 'application/json' },
		});

		this.api.interceptors.response.use(
			response => {
				return response;
			},
			error => {
				const status = error.response?.status;
				const url = error.config?.url;
				const method = error.config?.method?.toUpperCase();
				const details = error.response?.data?.error || error.message || 'Unknown error';

				this.logger.error(`[${status ?? '---'}] ${method} ${url} — ${details}`);

				return Promise.reject(details);
			},
		);
	}

	// --- Create Media Container ---
	// https://developers.facebook.com/docs/instagram-platform/content-publishing/
	// - Create Media Container Meta

	async createMediaContainer({
		userId,
		imageUrl,
		caption,
		accessToken,
	}: {
		userId: string;
		imageUrl: string;
		caption?: string;
		accessToken: string;
	}) {
		const res = await this.api.post(`/${userId}/media`, {
			image_url: imageUrl,
			caption,
			access_token: accessToken,
		});

		return res.data;
	}

	// --- Publish Media ---
	// https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media_publish/
	// - Publish Media Meta

	async publishMedia({
		userId,
		creationId,
		accessToken,
	}: {
		userId: string;
		creationId: string;
		accessToken: string;
	}) {
		const res = await this.api.post(`/${userId}/media_publish`, {
			creation_id: creationId,
			access_token: accessToken,
		});

		return res.data;
	}

	// --- Media Insights ---
	// https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/
	// - Get Media Insights Meta

	async getMediaInsights({
		mediaId,
		metric,
		accessToken,
	}: {
		mediaId: string;
		metric: string | string[];
		accessToken: string;
	}) {
		const res = await this.api.get(`/${mediaId}/insights`, {
			params: {
				metric: Array.isArray(metric) ? metric.join(',') : metric,
				access_token: accessToken,
			},
		});

		console.log(JSON.stringify(res.data, null, 4), 'RES DATA MEDIA INSIGHTS');

		return res.data;
	}

	// --- Get User Media (Total de Posts) ---
	// https://developers.facebook.com/docs/instagram-platform/reference/instagram-user/media
	async getMetaUserMedia({
		userId,
		params,
	}: {
		userId: string;
		params: Record<string, unknown>;
	}) {
		const res = await this.api.get(`/${userId}/media`, { params });

		console.log(JSON.stringify(res.data, null, 4), 'RES DATA USER MEDIA');

		return res.data;
	}

	// --- Get User Insights (Alcance, Engajamento, etc.) ---
	// https://developers.facebook.com/docs/instagram-platform/api-reference/instagram-user/insights
	async getMetaUserInsights({
		params,
		userId,
	}: {
		params: Record<string, unknown>;
		userId: string;
	}) {
		const res = await this.api.get(`/${userId}/insights`, { params });

		console.log(JSON.stringify(res.data, null, 4), 'RES DATA USER INSIGHTS');

		return res.data;
	}
}

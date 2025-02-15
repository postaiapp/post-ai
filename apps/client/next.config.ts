import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				hostname: 'post-ai.e1cbcbbff75a52d32302f26ed7d8eb5b.r2.cloudflarestorage.com',
			},
		],
	},
};

export default nextConfig;

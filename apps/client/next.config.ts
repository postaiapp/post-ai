import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: { 
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.fna.fbcdn.net',
        pathname: '/**',
      },
      {
        hostname: 'post-ai.e1cbcbbff75a52d32302f26ed7d8eb5b.r2.cloudflarestorage.com',
      },
    ],
    domains: ['i.imgur.com', 'randomuser.me'],
  },
};

export default nextConfig;

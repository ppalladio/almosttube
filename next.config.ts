import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    experimental: { typedRoutes: true },
    /* config options here */
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'image.mux.com' },

            {
                protocol: 'https',
                hostname: 'yn3tukkbin.ufs.sh',
            },
        ],
    },
    allowedDevOrigins: ['http://localhost:3000'],
};

export default nextConfig;

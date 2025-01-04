import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {protocol: "https", hostname: "placehold.co"},
            {
                protocol: "http",
                hostname: "res.cloudinary.com",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
            allowedOrigins: ['dr9d6z4ym.cloudinary.com'],
        },
    },
};

export default nextConfig;

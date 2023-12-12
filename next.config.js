/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["res.cloudinary.com", "www.paypal.com"],
    },
    webpack: (config) => {
        config.experiments = {...config.experiments, topLevelAwait: true };
        return config;
    },
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    },
    session: {
        jwt: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
};

module.exports = nextConfig;
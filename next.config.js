/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Experimental features
  experimental: {
    // serverActions: true,
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "", // Leave empty for default port (HTTPS uses 443)
        pathname: "/images/**", // Allow all paths under /images/
      },
    ],
  },
};

module.exports = nextConfig;
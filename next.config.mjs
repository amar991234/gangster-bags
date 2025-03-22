/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
// next.config.js
module.exports = {
  basePath: "",
  // Add this to resolve imports starting with @
  webpack(config) {
    config.resolve.alias["@"] = __dirname;
    return config;
  },
};
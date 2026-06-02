/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  generateBuildId: async () => {
    return `${new Date().getTime()}`;
  },
};

module.exports = nextConfig;

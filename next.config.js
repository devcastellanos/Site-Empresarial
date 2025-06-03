/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: ["api-img-tara.192.168.29.40.sslip.io"],
  },
};

module.exports = nextConfig;

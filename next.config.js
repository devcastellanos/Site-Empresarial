/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: ["api-img.172.16.15.30.sslip.io"],
  },
  output: 'standalone', // ✅ Agrega esta línea
};

module.exports = nextConfig;

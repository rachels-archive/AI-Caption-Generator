/** @type {import('next').NextConfig} */
//const nextConfig = {};

//export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" }, // Adjust this to your frontend's origin if needed
          { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  }, // Extend Webpack configuration
  webpack(config) {
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      type: "asset/resource",
    });

    return config;
  },
};

export default nextConfig;

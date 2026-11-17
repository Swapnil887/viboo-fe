import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: false,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;

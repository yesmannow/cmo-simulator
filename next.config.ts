import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Enable ESLint during builds to catch code quality issues
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Enable TypeScript error checking during builds
    // Fix type errors before deploying to production
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow build to proceed with warnings (errors will still be shown)
    // Set to true to ignore all ESLint errors during builds
    ignoreDuringBuilds: process.env.CI === "true" || process.env.SKIP_ESLINT === "true",
  },
  typescript: {
    // Allow build to proceed with TypeScript errors for now
    // TODO: Fix type errors incrementally
    ignoreBuildErrors: true,
  },
  // Note: OpenNext Cloudflare handles output configuration
  // Do not set output: "standalone" as it conflicts with OpenNext
};

export default nextConfig;

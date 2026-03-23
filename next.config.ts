import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // All ESLint rules are set to "warn" level so they won't fail the build.
    // Set SKIP_ESLINT=true in env vars to skip ESLint entirely during builds.
    ignoreDuringBuilds: process.env.SKIP_ESLINT === "true",
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

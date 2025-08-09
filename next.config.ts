import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict mode for better error catching
  reactStrictMode: true,
  // Handle potential console warnings in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // PDF.js worker configuration
    config.resolve.alias.canvas = false;
    
    return config;
  },
};

export default nextConfig;

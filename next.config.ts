import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
  // Image optimization
  images: {
    domains: [],
  },
  // SEO optimizations
  poweredByHeader: false,
  generateEtags: true,
  // Compression
  compress: true,
};

export default nextConfig;
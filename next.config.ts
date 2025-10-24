import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  // Image optimization
  images: {
    domains: [],
    loader: 'default',
  },
  // SEO optimizations
  poweredByHeader: false,
  generateEtags: true,
  // Compression
  compress: true,
  // Enable automatic static optimization
  trailingSlash: false,
};

export default nextConfig;
/** @type {import("next").NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  eslint: {
    dirs: ["src"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: isDev, // speed up local dev
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

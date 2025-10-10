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
    unoptimized: isDev, // speed up local dev; Next will not optimize remote images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "scontent.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;

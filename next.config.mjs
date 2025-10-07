/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
  eslint: {
    dirs: ["src"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
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
    ],
  },
};

export default nextConfig;

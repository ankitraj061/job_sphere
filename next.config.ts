import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['ik.imagekit.io', 'res.cloudinary.com'],
  },
  reactStrictMode:false
};

export default nextConfig;

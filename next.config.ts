import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["www.mirotakampus.com", "res.cloudinary.com"], // allowed domains in one array
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_KEY: process.env.API_KEY,
    REGION: process.env.REGION,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS: process.env.SECRET_ACCESS,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    API_KEY: process.env.API_KEY,
    REGION: process.env.REGION,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY,
    SQS_REGION: process.env.SQS_REGION,
    SQS_URL: process.env.SQS_URL,
    DYNAMO_DB_REGION: process.env.DYNAMO_DB_REGION,
  },
};

export default nextConfig;

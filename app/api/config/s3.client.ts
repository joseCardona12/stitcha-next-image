import { S3Client } from "@aws-sdk/client-s3";
import { ENVS } from "./getEnv";

export const S3: S3Client = new S3Client({
  region: ENVS.AWS_REGION,
  credentials: {
    accessKeyId: ENVS.AWS_ACCESS_KEY,
    secretAccessKey: ENVS.AWS_SECRET_ACCESS,
  },
});

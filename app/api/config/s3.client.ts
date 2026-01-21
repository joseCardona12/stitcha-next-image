import { S3Client } from "@aws-sdk/client-s3";
import { ENVS } from "./getEnv";

export const S3: S3Client = new S3Client({
  region: ENVS.REGION,
  credentials: {
    accessKeyId: ENVS.ACCESS_KEY,
    secretAccessKey: ENVS.SECRET_ACCESS,
  },
});

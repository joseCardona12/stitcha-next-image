import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3 } from "../config/s3.client";

export class ImageService {
  private client: S3Client;
  constructor() {
    this.client = S3;
    console.log("this client", this.client);
  }

  public async uploadImage(file: Buffer, fileName: string, fileType: string) {
    const key: string = `images/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: "stitcha-images",
      Key: key,
      Body: file,
      ContentType: fileType,
    });
    try {
      await this.client.send(command);
      return {
        key,
        url: `https://stitcha-images.s3.amazonaws.com/${key}`,
      };
    } catch (error) {
      throw new Error(`ERROR: ${error}`);
    }
  }
}

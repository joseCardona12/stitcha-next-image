import { base64ToFile } from "@/utils/base64ToFile";

export class S3ImageService {
  public async uploadImage(base64Image: string) {
    const file = base64ToFile(base64Image);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/images", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`ERROR: ${text}`);
      }
      return await response.json();
    } catch (error) {
      console.log("error", error);
      throw new Error(`${error}`);
    }
  }
}

export const s3ImageService = new S3ImageService();

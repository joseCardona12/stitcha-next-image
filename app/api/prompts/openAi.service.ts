import { base64ToFile } from "@/utils/base64ToFile";
import { bufferToFile } from "@/utils/bufferToFile";
import OpenAI from "openai";
import { ImageService } from "../images/image.service";

export class OpenAIService {
  private client: OpenAI;
  private imageService: ImageService;

  constructor() {
    const API_KEY: string = process.env.API_KEY ?? "";
    this.client = new OpenAI({
      apiKey: API_KEY,
    });
    this.imageService = new ImageService();
  }

  public async urlToFile(url: string): Promise<File> {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch image");
    const arrayBuffer = await res.arrayBuffer();
    const file = new File([arrayBuffer], "reference.png", {
      type: "image/png",
    });
    return file;
  }

  public async generateMockup(prompt: string, urlImage: string) {
    console.log("prompt", prompt, urlImage);
    try {
      const file = await this.urlToFile(urlImage);
      const result = await this.client.images.edit({
        model: "gpt-image-1",
        image: file,
        prompt,
        size: "1024x1024",
      });
      if (!result.data || !result.data[0].b64_json)
        throw new Error("No Image returned from OpenAI");
      const base64Image = result.data[0].b64_json;
      const buffer = Buffer.from(base64Image, "base64");
      const responseImageService = await this.imageService.uploadImage(
        buffer,
        `mockup-${Date.now()}.png`,
        "image/png",
      );
      return responseImageService;
    } catch (error) {
      console.log("error", error);
    }
  }
}

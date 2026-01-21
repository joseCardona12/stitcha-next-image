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

  public async urlToBuffer(url: string): Promise<Buffer> {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch image");
    return Buffer.from(await res.arrayBuffer());
  }

  public async generateMockup(file: File, prompt: string) {
    try {
      const result = await this.client.images.edit({
        model: "gpt-image-1",
        prompt,
        image: file,
        size: "1024x1024",
      });
      if (!result.data || !result.data[0].b64_json)
        throw new Error("No image returned from OpenAI");
      const base64Image = result.data[0].b64_json;
      const buffer = Buffer.from(base64Image, "base64");
      const responseIMageService = await this.imageService.uploadImage(
        buffer,
        `mockup-${Date.now()}.png`,
        "image/png",
      );
      return responseIMageService;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
}

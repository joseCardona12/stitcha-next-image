import { base64ToFile } from "@/utils/base64ToFile";
import OpenAI from "openai";

export class OpenAIService {
  private client: OpenAI;

  constructor() {
    const API_KEY: string = process.env.API_KEY ?? "";
    this.client = new OpenAI({
      apiKey: API_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  public async generateMockup(
    base64Image: string,
    prompt: string,
  ): Promise<string> {
    const file = base64ToFile(base64Image);
    try {
      const result = await this.client.images.edit({
        model: "gpt-image-1",
        prompt,
        image: file,
        size: "1024x1024",
      });
      return `data:image/png;base64,${result.data[0].b64_json}`;
    } catch (error) {
      throw new Error(`Error: ${error}`);
    }
  }
}

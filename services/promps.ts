export class PromptService {
  public async createPrompt(prompt: string, urlImage: string) {
    try {
      const result = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          urlImage,
        }),
      });
      if (!result.ok) {
        const text = await result.text();
        throw new Error(`API error ${result.status}: ${text}`);
      }
      return await result.json();
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
}

export const promptOpenAiService = new PromptService();

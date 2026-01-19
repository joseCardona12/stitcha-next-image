export class Prompt {
  public async createPrompt(prompt: string, base64Image: string) {
    try {
      const result = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          base: base64Image,
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

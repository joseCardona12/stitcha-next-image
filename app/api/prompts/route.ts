import { NextResponse } from "next/server";
import { OpenAIService } from "./services/openAi";
export async function POST(req: Request) {
  const { prompt, base } = await req.json();
  const openAiService = new OpenAIService();
  try {
    const result = await openAiService.generateMockup(base, prompt);
    console.log("result", result);
    return NextResponse.json({
      message: "oK",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message,
      },
      { status: 500 },
    );
  }
}

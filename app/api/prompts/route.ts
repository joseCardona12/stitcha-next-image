import { NextResponse } from "next/server";
import { OpenAIService } from "./services/openAi";
export async function POST(req: Request) {
  const { prompt, base } = await req.json();
  const openAiService = new OpenAIService();
  try {
    const result = await openAiService.generateMockup(base, prompt);
    return NextResponse.json({
      message: "oK",
      status: 200,
      data: result,
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

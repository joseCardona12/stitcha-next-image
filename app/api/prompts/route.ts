import { NextResponse } from "next/server";
import { OpenAIService } from "./openAi.service";
export async function POST(req: Request) {
  const { prompt, urlImage } = await req.json();
  if (!prompt || !urlImage) {
    return NextResponse.json(
      {
        error: "Invalid paylod",
      },
      {
        status: 400,
      },
    );
  }
  const openAiService = new OpenAIService();
  try {
    const result = await openAiService.generateMockup(prompt, urlImage);
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

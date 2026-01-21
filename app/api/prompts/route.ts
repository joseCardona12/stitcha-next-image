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
    const imageBuffer = await openAiService.urlToBuffer(urlImage);
    const file = new File([Buffer.from(imageBuffer)], "image.png", {
      type: "image/png",
    });
    const result = await openAiService.generateMockup(file, prompt);
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

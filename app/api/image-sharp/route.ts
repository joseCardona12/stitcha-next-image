import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url).searchParams.get("urlImage");
  if (!url) {
    return NextResponse.json(
      {
        message: "URLIMAGE is required",
      },
      { status: 400 },
    );
  }

  try {
    const result = await fetch(url);
    if (!result.ok) {
      return NextResponse.json(
        {
          message: "Error to get image",
        },
        {
          status: 400,
        },
      );
    }
    const contentType = result.headers.get("content-type") || "image/png";
    return new NextResponse(result.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "",
      },
      { status: 500 },
    );
  }
}

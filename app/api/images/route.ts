import { NextResponse } from "next/server";
import { ImageService } from "./image.service";

export const runtime = "nodejs";
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return NextResponse.json({ message: "No File Provided" }, { status: 400 });
  }
  console.log("file", file);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  try {
    const service = new ImageService();
    const serviceResponse = await service.uploadImage(
      buffer,
      file.name,
      file.type,
    );
    return NextResponse.json(
      { message: "ok", data: serviceResponse },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}

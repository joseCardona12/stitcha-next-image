import { NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import { ImageService } from "../images/image.service";

export async function POST(req: Request) {
  try {
    const { mockupId, logoData, coords } = await req.json();
    const mockupDir = path.join(process.cwd(), "public", "images", mockupId);

    //Layers
    const baseImagePath = path.join(mockupDir, "base.png");
    const shadowPath = path.join(mockupDir, "shadow.png");
    const highlightPath = path.join(mockupDir, "highlight.png");

    // get mockup dimentions
    const baseImgMetadata = await sharp(baseImagePath).metadata();
    const bW = baseImgMetadata.width;
    const bH = baseImgMetadata.height;

    if (!bW || !bH)
      throw new Error("No se pudo obtener dimensiones de la base");

    // Original logo - rezise - rotation
    const logoBuffer = Buffer.from(logoData.split(",")[1], "base64");
    const logoResized = await sharp(logoBuffer)
      .resize(Math.round(coords.width), Math.round(coords.height))
      .rotate(coords.angle || 0)
      .toBuffer();

    // Generate relief map
    const alphaMask = await sharp(logoResized)
      .extractChannel("alpha")
      .blur(1.5) //bezel management
      .toBuffer();

    // Generate layers with light and internal shadow
    const lightMap = await sharp(alphaMask).negate().linear(2.9, 0).toBuffer(); // shine
    const shadowMap = await sharp(alphaMask).linear(0.9, 0).toBuffer(); // Shadow

    // 3. Relief to logo
    const logoWithRelief = await sharp(logoResized)
      .composite([
        { input: shadowMap, blend: "multiply", top: 2, left: 2 }, // moved down
        { input: lightMap, blend: "screen", top: -1, left: -1 }, // moved up
        { input: logoResized, blend: "dest-in" }, //mask
      ])
      .png()
      .toBuffer();

    // 4. Create global layer
    const logoLayer = await sharp({
      create: {
        width: bW,
        height: bH,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: logoWithRelief,
          top: Math.round(coords.top - coords.height / 2),
          left: Math.round(coords.left - coords.width / 2),
        },
      ])
      .png()
      .toBuffer();

    //Strict mask
    const garmentMask = await sharp(shadowPath)
      .resize(bW, bH)
      .extractChannel("alpha")
      .toBuffer();

    const maskedLogoLayer = await sharp(logoLayer)
      .composite([{ input: garmentMask, blend: "dest-in" }])
      .toBuffer();

    //Final composition: BASE + LOGO + REAL SHADOW
    const finalImage = await sharp(baseImagePath)
      .composite([
        // Layer 1: Logo with relief
        { input: maskedLogoLayer, blend: "over" },
        // Layer 2: Shodow and wrinkles
        {
          input: await sharp(shadowPath).resize(bW, bH).toBuffer(),
          blend: "multiply",
        },
      ])
      .png()
      .toBuffer();

    const imageService = new ImageService();
    const generateUrl = await imageService.uploadImage(
      finalImage,
      "test",
      "image/png",
    );
    return NextResponse.json({
      message: "Generated correctly",
      data: generateUrl,
    });
  } catch (error: any) {
    console.error("Render Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

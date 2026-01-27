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

    // 0. get mockup dimentions
    const baseImgMetadata = await sharp(baseImagePath).metadata();
    const bW = baseImgMetadata.width;
    const bH = baseImgMetadata.height;

    if (!bW || !bH)
      throw new Error("No se pudo obtener dimensiones de la base");

    // 1. PROCESAR LOGO ORIGINAL (Resize y Rotación)
    const logoBuffer = Buffer.from(logoData.split(",")[1], "base64");
    const logoResized = await sharp(logoBuffer)
      .resize(Math.round(coords.width), Math.round(coords.height))
      .rotate(coords.angle || 0)
      .toBuffer();

    // 2. GENERAR EL MAPA DE RELIEVE (BUMP MAP)
    // Extraemos el canal alfa y aplicamos blur para crear la "rampa" del relieve
    const alphaMask = await sharp(logoResized)
      .extractChannel("alpha")
      .blur(1.5) // Controla qué tan suave es el bisel
      .toBuffer();

    // Generamos las capas de luz y sombra internas
    const lightMap = await sharp(alphaMask).negate().linear(2.9, 0).toBuffer(); // Brillo
    const shadowMap = await sharp(alphaMask).linear(0.9, 0).toBuffer(); // Sombra

    // 3. APLICAR RELIEVE AL LOGO (Composición Interna)
    // Esto hace que el relieve sea parte de la textura del logo
    const logoWithRelief = await sharp(logoResized)
      .composite([
        { input: shadowMap, blend: "multiply", top: 2, left: 2 }, // Desplazado hacia abajo
        { input: lightMap, blend: "screen", top: -1, left: -1 }, // Desplazado hacia arriba
        { input: logoResized, blend: "dest-in" }, // Máscara: Solo dentro del logo
      ])
      .png()
      .toBuffer();

    // 4. CREAR CAPA GLOBAL (Logo ya con relieve puesto en su posición final)
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
          // Ajuste de coordenadas centrado (como en tu código original)
          top: Math.round(coords.top - coords.height / 2),
          left: Math.round(coords.left - coords.width / 2),
        },
      ])
      .png()
      .toBuffer();

    // 5. RECORTE ESTRICTO CON LA SILUETA DE LA PRENDA
    // Usamos el alfa de shadow.png para asegurar que el logo no "flote" fuera de la tela
    const garmentMask = await sharp(shadowPath)
      .resize(bW, bH)
      .extractChannel("alpha")
      .toBuffer();

    const maskedLogoLayer = await sharp(logoLayer)
      .composite([{ input: garmentMask, blend: "dest-in" }])
      .toBuffer();

    // 6. COMPOSICIÓN FINAL: BASE + LOGO + SOMBRAS REALES
    const finalImage = await sharp(baseImagePath)
      .composite([
        // Capa 1: El logo con relieve recortado a la prenda
        { input: maskedLogoLayer, blend: "over" },
        // Capa 2: Sombras y arrugas de la tela (Multiply para realismo extremo)
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

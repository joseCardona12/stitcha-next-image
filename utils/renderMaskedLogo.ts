/**
 * Renders a logo image with a mask applied to it
 * Used to create a pre-masked logo before sending to backend
 */

interface RenderMaskedLogoParams {
  logoDataURL: string;
  logoWidth: number;
  logoHeight: number;
  logoAngle: number | undefined;
  maskCanvas: HTMLCanvasElement;
  logoPositionLeft: number;
  logoPositionTop: number;
}

interface MaskApplicationResult {
  croppedLogoDataURL: string;
  success: boolean;
}

/**
 * Draw the logo on a temporary canvas with rotation applied
 */
function drawLogoOnCanvas(
  ctx: CanvasRenderingContext2D,
  logoImg: HTMLImageElement,
  logoWidth: number,
  logoHeight: number,
  angle: number | undefined,
  offsetX: number,
  offsetY: number,
): void {
  ctx.save();
  ctx.translate(offsetX + logoWidth / 2, offsetY + logoHeight / 2);
  if (angle) {
    ctx.rotate((angle * Math.PI) / 180);
  }
  ctx.drawImage(
    logoImg,
    -logoWidth / 2,
    -logoHeight / 2,
    logoWidth,
    logoHeight,
  );
  ctx.restore();
}

/**
 * Apply mask to logo using pixel-by-pixel transparency
 */
function applyMaskToCanvasPixels(
  canvasCtx: CanvasRenderingContext2D,
  maskCtx: CanvasRenderingContext2D,
  tempCanvas: HTMLCanvasElement,
  maskCanvas: HTMLCanvasElement,
  logoWidth: number,
  logoHeight: number,
  logoPositionLeft: number,
  logoPositionTop: number,
  offsetX: number,
  offsetY: number,
): void {
  const logoImageData = canvasCtx.getImageData(
    0,
    0,
    tempCanvas.width,
    tempCanvas.height,
  );

  const logoData = logoImageData.data;
  for (let i = 0; i < logoData.length; i += 4) {
    // Calculate pixel position in canvas
    const pixelIndex = i / 4;
    const pixelX = pixelIndex % tempCanvas.width;
    const pixelY = Math.floor(pixelIndex / tempCanvas.width);

    // Calculate position in original mask
    const maskPixelX = Math.max(0, logoPositionLeft + (pixelX - offsetX));
    const maskPixelY = Math.max(0, logoPositionTop + (pixelY - offsetY));

    // If the mask has no value at this pixel, make it transparent
    const maskCtxData = maskCtx.getImageData(maskPixelX, maskPixelY, 1, 1).data;

    if (maskCtxData[0] < 128) {
      logoData[i + 3] = 0; // Full transparency
    }
  }
  canvasCtx.putImageData(logoImageData, 0, 0);
}

/**
 * Crop the temporary canvas to the exact logo size
 */
function cropCanvasToLogoSize(
  tempCanvas: HTMLCanvasElement,
  logoWidth: number,
  logoHeight: number,
  offsetX: number,
  offsetY: number,
): string {
  const croppedCanvas = document.createElement("canvas");
  croppedCanvas.width = Math.ceil(logoWidth);
  croppedCanvas.height = Math.ceil(logoHeight);
  const croppedCtx = croppedCanvas.getContext("2d");

  if (croppedCtx) {
    croppedCtx.drawImage(
      tempCanvas,
      offsetX,
      offsetY,
      Math.ceil(logoWidth),
      Math.ceil(logoHeight),
      0,
      0,
      Math.ceil(logoWidth),
      Math.ceil(logoHeight),
    );
  }

  return croppedCanvas.toDataURL("image/png");
}

/**
 * Main function to render a logo with mask applied
 * Returns the base64 encoded masked logo
 */
export async function renderMaskedLogo(
  params: RenderMaskedLogoParams,
): Promise<MaskApplicationResult> {
  const {
    logoDataURL,
    logoWidth,
    logoHeight,
    logoAngle,
    maskCanvas,
    logoPositionLeft,
    logoPositionTop,
  } = params;

  return new Promise((resolve) => {
    const tempCanvas = document.createElement("canvas");
    const offsetX = 50;
    const offsetY = 50;

    tempCanvas.width = Math.ceil(logoWidth) + 100;
    tempCanvas.height = Math.ceil(logoHeight) + 100;
    const tempCtx = tempCanvas.getContext("2d");

    if (!tempCtx) {
      resolve({ croppedLogoDataURL: "", success: false });
      return;
    }

    // Load and draw the logo on the temporary canvas
    const logoImg = new Image();
    logoImg.onload = () => {
      try {
        drawLogoOnCanvas(
          tempCtx,
          logoImg,
          logoWidth,
          logoHeight,
          logoAngle,
          offsetX,
          offsetY,
        );

        // Apply mask
        const maskCtx = maskCanvas.getContext("2d");
        if (maskCtx) {
          applyMaskToCanvasPixels(
            tempCtx,
            maskCtx,
            tempCanvas,
            maskCanvas,
            logoWidth,
            logoHeight,
            Math.round(logoPositionLeft - logoWidth / 2),
            Math.round(logoPositionTop - logoHeight / 2),
            offsetX,
            offsetY,
          );
        }

        // Crop and export
        const croppedLogoDataURL = cropCanvasToLogoSize(
          tempCanvas,
          logoWidth,
          logoHeight,
          offsetX,
          offsetY,
        );

        resolve({ croppedLogoDataURL, success: true });
      } catch (error) {
        console.log("Error rendering masked logo:", error);
        resolve({ croppedLogoDataURL: "", success: false });
      }
    };

    logoImg.onerror = () => {
      resolve({ croppedLogoDataURL: "", success: false });
    };

    logoImg.src = logoDataURL;
  });
}

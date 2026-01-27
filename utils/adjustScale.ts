export default function adjustScale(
  shirtImage: HTMLImageElement,
  contW: number,
  contH: number,
) {
  const scale =
    Math.min(contW / shirtImage.width, contH / shirtImage.height) * 0.9;
  const canvasWidth = shirtImage.width * scale;
  const canvasHeight = shirtImage.height * scale;
  return {
    scale,
    canvasHeight,
    canvasWidth,
  };
}

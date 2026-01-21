export function bufferToFile(
  buffer: Buffer,
  fileName: string,
  mime: string,
): File {
  const unint8Array = new Uint8Array(buffer);
  return new File([unint8Array], fileName, { type: mime });
}

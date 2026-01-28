import { FILES_SUPPORTED, MAXIMUN_SIZE } from "./constants/constants";

export const verifyFile = (file: File | undefined) => {
  if (!file) return false;
  const fileType: string = file.type.split("/")[1];
  if (!FILES_SUPPORTED.includes(fileType)) {
    console.log("Unsupported file typ");
    return false;
  }
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAXIMUN_SIZE) {
    console.log(`File exceeds ${MAXIMUN_SIZE}MB`);
    return false;
  }
  return true;
};

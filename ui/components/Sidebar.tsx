import { UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import Card from "./Card";
import { FILES_SUPPORTED, MAXIMUN_SIZE } from "@/utils/constants/constants";

interface ISidebarProps {
  urlImage: string;
  setUrlImage: (value: string) => void;
}
export default function Sidebar({ urlImage, setUrlImage }: ISidebarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleClick = () => {
    inputRef.current?.click();
  };

  const verifyFile = (file: File | undefined) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const isValid = verifyFile(file);
    if (!isValid) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imgData) {
          for (let i = 0; i < imgData.data.length; i += 4) {
            if (
              imgData.data[i] > 240 &&
              imgData.data[i + 1] > 240 &&
              imgData.data[i + 2] > 240
            ) {
              imgData.data[i + 3] = 0;
            }
          }
          ctx?.putImageData(imgData, 0, 0);
        }
        setUrlImage(canvas.toDataURL());
      };
    };
    reader.readAsDataURL(file as File);
  };
  return (
    <div className="border-r border-gray-200 p-6 flex flex-col gap-2">
      <Card className="flex flex-col justify-center items-center">
        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpeg,.jpg,.svg"
          className="hidden"
          onChange={handleChange}
        />
        <button
          onClick={handleClick}
          className="border border-gray-100 p-1 rounded-full cursor-pointer"
        >
          <UploadIcon className="w-4 h-4 text-gray-500" />
        </button>
        <p className="text-sm text-gray-700">Upload image</p>
      </Card>
      {urlImage && (
        <Card className="">
          <div className="flex justify-start">
            <span className="text-sm text-gray-500">Artwork Preview</span>
          </div>
          <div className="w-20 h-20">
            <img
              className="w-full h-full object-contain"
              src={urlImage}
              alt="image-logo"
            />
          </div>
        </Card>
      )}
    </div>
  );
}

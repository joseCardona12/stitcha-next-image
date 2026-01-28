import { useRef, useState } from "react";
import TitleDescription from "./TitleDescription";
import { Check, Upload } from "lucide-react";
import { verifyFile } from "@/utils/verifyFile";
import Button from "./Button";
import { CURRENT_URL_IMAGE, IUrlImage } from "@/app/page";

interface IUploadFileProps {
  setUrlImage: (value: IUrlImage) => void;
  urlImage: IUrlImage;
}
export default function UploadFile({
  setUrlImage,
  urlImage,
}: IUploadFileProps) {
  const [hover, setHover] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
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
        const sizeMB = file!.size / (1024 * 1024);
        setUrlImage({
          urlLogo: canvas.toDataURL(),
          name: file?.name ?? "",
          size: `${sizeMB.toFixed(2)}MB`,
        });
      };
    };
    reader.readAsDataURL(file as File);
  };
  return (
    <div className="flex flex-col gap-6 w-300 h-full">
      <TitleDescription
        title="Sube el Logo"
        description="Sube un archivo para empezar el renderizado."
      />
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleChange}
        accept=".png,.jpeg,.jpg"
      />
      <div
        onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={` relative border border-dashed border-gray-300 w-full h-full rounded-md p-4 flex flex-col gap-2 justify-center items-center cursor-pointer ${urlImage.urlLogo ? "bg-green-50 border-green-300" : "bg-white"}`}
      >
        {urlImage.urlLogo ? (
          <div className="flex flex-col gap-4 justify-center items-center">
            <div className="bg-green-200 w-18 h-18 rounded-full flex justify-center items-center">
              <Check className="text-green-600 w-8 h-8" />
            </div>
            <h3 className="font-bold">Logo Subido</h3>
            <div className="bg-white rounded-xl p-2 shadow-md w-70 text-center">
              {urlImage.name}
            </div>
            <span className="text-sm text-gray-500">{urlImage.size}</span>
            <Button
              variant="outline"
              onClick={() => setUrlImage(CURRENT_URL_IMAGE)}
              disabled={false}
            >
              Cambiar logo
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 justify-center items-center">
            <span className="border border-gray-100 w-15 h-15 rounded-full p-2 flex justify-center items-center ">
              <Upload />
            </span>
            <div className="flex justify-center flex-col gap-1 items-center">
              <h3 className="font-bold">Sube el logo</h3>
              <p className="text-sm text-gray-400">PNG, JPG hasta 5MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

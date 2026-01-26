import { X } from "lucide-react";
import ZoomImage from "./ZoomImage";

interface IModalImageProps {
  urlImage: string;
  setOpenModalPreviewIA: (value: boolean) => void;
}
export default function ModalImage({
  urlImage,
  setOpenModalPreviewIA,
}: IModalImageProps) {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-100">
      <div className="bg-white shadow-sm p-6 rounded-md flex flex-col gap-2 relative">
        <button
          className="bg-red-300 rounded-md absolute top-3 right-3 p-1 cursor-pointer hover:bg-red-500 transition-colors duration-150"
          onClick={() => setOpenModalPreviewIA(false)}
        >
          <X className="w-4 h-4" />
        </button>
        <h4 className="font-medium">Preview IA Generate</h4>
        <div className="border border-gray-100 rounded-md w-210 h-210">
          {urlImage ? (
            <ZoomImage src={urlImage} />
          ) : (
            <span className="">No Image Preview</span>
          )}
        </div>
      </div>
    </div>
  );
}

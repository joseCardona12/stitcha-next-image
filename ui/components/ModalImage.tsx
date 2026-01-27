import { X } from "lucide-react";
import ZoomImage from "./ZoomImage";
import { IModalPreview } from "@/app/page";

interface IModalImageProps {
  urlImage: string;
  openModalPreviewIA: IModalPreview;
  setOpenModalPreviewIA: (value: IModalPreview) => void;
}
export default function ModalImage({
  urlImage,
  openModalPreviewIA,
  setOpenModalPreviewIA,
}: IModalImageProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-50 p-4 overflow-hidden">
      <div className="bg-white shadow-lg p-4 sm:p-6 rounded-md flex flex-col gap-3 relative w-full max-w-2xl max-h-[95vh] overflow-hidden">
        <button
          className="bg-red-300 rounded-md absolute top-3 right-3 p-1.5 cursor-pointer hover:bg-red-500 transition-colors duration-150 shrink-0 z-10"
          onClick={() =>
            setOpenModalPreviewIA({
              state: false,
              url: "",
              title: "",
            })
          }
        >
          <X className="w-4 h-4" />
        </button>
        <h4 className="font-medium text-sm sm:text-base pr-8 shrink-0">
          {openModalPreviewIA.title}
        </h4>
        <div className="flex-1 overflow-auto min-h-0 border border-gray-100 rounded-md bg-gray-50">
          {urlImage ? (
            <ZoomImage src={urlImage} />
          ) : (
            <span className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
              No Image Preview
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

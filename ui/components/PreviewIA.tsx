import { IImage } from "@/app/page";
import { promptOpenAiService } from "@/services/promps";
import { s3ImageService } from "@/services/s3Image";
import { PROMPT_IMAGE } from "@/utils/constants/promptImage";
import { Eye } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface IPreviewIAProps {
  imageBase64: string;
  urlImage: string;
  setOpenModalPreviewIA: (value: boolean) => void;
  setImageEnhanced: (value: string) => void;
  imageEnhanced: string;
  setImages: Dispatch<SetStateAction<IImage[]>>;
  images: IImage[];
}
export default function PreviewIA({
  imageBase64,
  urlImage,
  imageEnhanced,
  setOpenModalPreviewIA,
  setImageEnhanced,
  setImages,
  images,
}: IPreviewIAProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const generateURLImageS3 = async () => {
    try {
      const response = await s3ImageService.uploadImage(imageBase64);
      const url = response?.data?.url ?? "";
      return url;
    } catch (error) {
      setError(`ERROR: ${error}`);
      return ``;
    }
  };

  const generateOpenAIImage = async (propmt: string, url: string) => {
    try {
      const result = await promptOpenAiService.createPrompt(propmt, url);
      const urlImageEnhaced = result?.data?.url ?? "";
      const newImage: IImage = {
        logoUrl: `${urlImage}-01`,
        name: result?.data.key ?? "",
        url: result?.data.url,
      };
      setImageEnhanced(urlImageEnhaced);
      setImages((prev) => [...prev, newImage]);
    } catch (error) {
      setError(`ERROR: ${error}`);
    }
  };

  const handleClick = async () => {
    setLoading(true);
    const url = await generateURLImageS3();
    if (!url) return;
    await generateOpenAIImage(PROMPT_IMAGE, url);
    setLoading(false);
  };
  return (
    <div className="border-l border-gray-200 p-4 flex flex-col gap-2">
      <span>Preview</span>
      <div className="h-40 border border-gray-100 rounded-md p-1 w-full">
        {imageBase64 && (
          <img
            className="w-full h-full object-contain rounded-md"
            src={imageBase64}
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="border border-gray-200 p-2 pl-4 pr-4 rounded-xl text-sm cursor-pointer hover:bg-gray-100 transition-colors duration-150"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? "Loading..." : "Generate with openAI"}
        </button>
        <div className="w-full h-50 border border-gray-100 rounded-md p-1 relative">
          {imageEnhanced && (
            <button
              className="absolute top-o right-1 bg-gray-100 p-2 rounded-md cursor-pointer"
              onClick={() => {
                setOpenModalPreviewIA(true);
              }}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {loading && (
            <div className="flex flex-col gap-1">
              <div className="bg-gray-100 animate-pulse duration-150 w-50 h-10 rounded-md"></div>
              <div className="bg-gray-100 animate-pulse duration-150 w-50 h-10 rounded-md"></div>
              <div className="bg-gray-100 animate-pulse duration-150 w-50 h-10 rounded-md"></div>
            </div>
          )}
          {imageEnhanced && (
            <img
              className="w-full h-full object-contain rounded-md"
              src={imageEnhanced}
              alt="image-by-gemini"
            />
          )}
        </div>
        {error && <span>{error}</span>}
      </div>
    </div>
  );
}

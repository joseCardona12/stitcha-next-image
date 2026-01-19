import { IImage } from "@/app/page";
import { Prompt } from "@/services/promps";
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

const promptService = new Prompt();
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
  const handleClick = async () => {
    setImageEnhanced("");
    if (!urlImage) {
      setError("Logo required");
      return;
    }
    setLoading(true);
    try {
      const response = await promptService.createPrompt(
        `
                      Create a high-resolution, photorealistic apparel mockup.
      Use the provided image as a strict visual reference for logo placement.
      The logo must remain exactly in the same position, relative to the garment seams, folds, and proportions as shown in the reference image.
      Do not recenter, rebalance, align, or correct the logo placement.
      The logo position is intentionally off-center and must be preserved exactly.
      Treat the logo as printed directly onto the fabric at fixed coordinates.
      The logo must not move, scale, rotate, warp, or shift, even if the model pose or camera angle changes.
      Generate variations by changing only:
      – the model pose
      – the camera angle
      – lighting and fabric wrinkles
      Keep the logo locked to the same garment area at all times.
      Neutral studio background, professional fashion lighting, realistic fabric texture, commercial mockup quality.
            `,
        imageBase64,
      );
      setImageEnhanced(response?.data);
      const newImage: IImage = {
        url: response?.data,
        logoUrl: urlImage ?? "",
        name: `image-generate-ia-${response?.data}`,
      };
      setImages((prev) => [...prev, newImage]);
    } catch (error) {
      console.log("....error", error);
      setError(`ERROR: ${error}`);
    } finally {
      setLoading(false);
    }
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

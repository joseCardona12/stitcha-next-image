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

  const uplodToS3 = async () => {
    try {
      const result = await s3ImageService.uploadImage(imageBase64);
      return result?.data?.url;
    } catch (error) {
      throw new Error(`Error to generate url image. ERROR: ${error}`);
    }
  };

  const startJob = async (prompt: string, generatedURLImage: string) => {
    try {
      const result = await fetch("/api/start-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          urlImage: generatedURLImage,
        }),
      });
      const data = await result.json();
      return data?.jobId;
    } catch (error) {
      throw new Error(`ERROR: ${error}`);
    }
  };

  const startPolling = (jobID: string) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/job-status?jobId=${jobID}`);
      const data = await res.json();

      console.log("data", data);
      if (data?.status === "COMPLETED") {
        clearInterval(interval);
        setImageEnhanced(`${data?.imageUrl}`);
        setLoading(false);
        return;
      }

      if (data?.status === "ERROR") {
        clearInterval(interval);
        alert("Error procesando la imagen");
      }
    }, 10000);
  };

  const handleClick = async () => {
    setLoading(true);
    const url = await uplodToS3();
    const getJobID = await startJob(PROMPT_IMAGE, url ?? "");
    startPolling(getJobID);
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

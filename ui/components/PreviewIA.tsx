import { IImage, IModalMessage, IModalPreview } from "@/app/page";
import { jobService } from "@/services/job";
import { promptOpenAiService } from "@/services/promps";
import { s3ImageService } from "@/services/s3Image";
import { PROMPT_IMAGE } from "@/utils/constants/promptImage";
import { Eye } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import Card from "./Card";
import Button from "./Button";

interface IPreviewIAProps {
  imageBase64: string;
  urlImage: string;
  setOpenModalPreviewIA: (value: IModalPreview) => void;
  setImageEnhanced: (value: string) => void;
  imageEnhanced: string;
  setImages: Dispatch<SetStateAction<IImage[]>>;
  images: IImage[];
  setOpenModalMessage: (value: IModalMessage) => void;
  previewSharp: string;
}
export default function PreviewIA({
  imageBase64,
  urlImage,
  imageEnhanced,
  setOpenModalPreviewIA,
  setImageEnhanced,
  setImages,
  setOpenModalMessage,
  images,
  previewSharp,
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
      const response = await jobService.startJob(prompt, generatedURLImage);
      return response?.jobId;
    } catch (error) {
      throw new Error(`ERROR: ${error}`);
    }
  };
  const getJobStatus = async (jobID: string, interval: NodeJS.Timeout) => {
    const data = await jobService.getStatus(jobID);
    if (data?.status === "COMPLETED") {
      clearInterval(interval);
      setImageEnhanced(`${data?.imageUrl}`);
      setOpenModalMessage({
        message: "Success to generate image",
        open: true,
        type: "success",
      });
      setLoading(false);
      return;
    }

    if (data?.status === "ERROR" || data?.status === "FAILED") {
      clearInterval(interval);
      setLoading(false);
      setOpenModalMessage({
        message: "ERROR to generate image",
        open: true,
        type: "error",
      });
      return;
    }
  };

  const startPolling = (jobID: string) => {
    const interval = setInterval(
      async () => getJobStatus(jobID, interval),
      10000,
    );
  };

  const handleClick = async () => {
    setImageEnhanced(""); // Clear image
    setLoading(true);
    const url = await uplodToS3();
    const getJobID = await startJob(PROMPT_IMAGE, url ?? "");
    startPolling(getJobID);
  };
  return (
    <div className="border-t lg:border-t-0 lg:border-l border-gray-200 p-3 sm:p-4 lg:p-4 flex flex-col gap-2 bg-gray-50 w-full lg:w-80 xl:w-96 h-auto overflow-y-auto lg:overflow-visible">
      <span className="text-sm font-medium shrink-0">Preview Sharp</span>
      <Card
        className="h-40 sm:h-48 border border-gray-100 rounded-md w-full bg-white relative shrink-0 overflow-hidden"
        padding={false}
      >
        <button
          className="absolute top-1 right-1 bg-white bg-opacity-80 p-1 rounded-md cursor-pointer hover:bg-opacity-100 transition-colors z-10"
          onClick={() => {
            setOpenModalPreviewIA({
              state: true,
              url: previewSharp,
              title: "Preview by Sharp",
            });
          }}
        >
          <Eye className="w-3 h-3" />
        </button>
        {previewSharp && (
          <img
            className="w-full h-full object-contain"
            src={previewSharp}
            alt="preview-sharp"
          />
        )}
      </Card>

      <Button onClick={handleClick} disabled={loading}>
        {loading ? "Loading..." : "Generate"}
      </Button>

      <div className="text-xs font-medium text-gray-600 shrink-0">
        AI Result
      </div>
      <Card
        className="w-full h-40 sm:h-48 border border-gray-100 rounded-md relative bg-white overflow-hidden shrink-0"
        padding={false}
      >
        {imageEnhanced && (
          <button
            className="absolute top-1 right-1 bg-white bg-opacity-80 p-1 rounded-md cursor-pointer hover:bg-opacity-100 transition-colors z-10"
            onClick={() => {
              setOpenModalPreviewIA({
                state: true,
                url: imageEnhanced,
                title: "Preview by OpenAI",
              });
            }}
          >
            <Eye className="w-3 h-3" />
          </button>
        )}
        {loading && (
          <div className="flex flex-col gap-1 p-2 w-full h-full justify-center">
            <div className="bg-gray-100 animate-pulse duration-150 h-2 rounded-md"></div>
            <div className="bg-gray-100 animate-pulse duration-150 h-2 rounded-md w-4/5"></div>
          </div>
        )}
        {imageEnhanced && !loading && (
          <img
            className="w-full h-full object-contain"
            src={imageEnhanced}
            alt="image-by-ai"
          />
        )}
      </Card>
      {error && <span className="text-xs text-red-500 shrink-0">{error}</span>}
    </div>
  );
}

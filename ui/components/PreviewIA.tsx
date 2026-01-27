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
    <div className="border-l border-gray-200 p-4 flex flex-col gap-2 bg-gray-50 ">
      <span>Preview</span>
      <Card className="h-40 border border-gray-100 rounded-md p-1 w-full bg-white relative">
        <button
          className="absolute top-1 right-1 bg-gray-100 p-2 rounded-md cursor-pointer"
          onClick={() => {
            setOpenModalPreviewIA({
              state: true,
              url: previewSharp,
              title: "Preview by Sharp",
            });
          }}
        >
          <Eye className="w-4 h-4" />
        </button>
        {previewSharp && (
          <img
            className="w-full h-full object-contain rounded-md"
            src={previewSharp}
          />
        )}
      </Card>
      <div className="flex flex-col gap-2">
        <Button onClick={handleClick} disabled={loading}>
          {loading ? "Loading..." : "Generate with openAI"}
        </Button>
        <Card
          className="w-full h-50 border border-gray-100 rounded-md relative bg-white"
          padding={false}
        >
          {imageEnhanced && (
            <button
              className="absolute top-1 right-1 bg-gray-100 p-2 rounded-md cursor-pointer"
              onClick={() => {
                setOpenModalPreviewIA({
                  state: true,
                  url: imageEnhanced,
                  title: "Preview by OpenAI",
                });
              }}
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          {loading && (
            <div className="flex flex-col gap-1 p-2">
              <div className="bg-gray-100 animate-pulse duration-150 w-50 h-10 rounded-md"></div>
              <div className="bg-gray-100 animate-pulse duration-150 w-50 h-10 rounded-md"></div>
              <div className="bg-gray-100 animate-pulse duration-150 w-50 h-10 rounded-md"></div>
            </div>
          )}
          {imageEnhanced && (
            <img
              className="w-full h-full rounded-md object-cover"
              src={imageEnhanced}
              alt="image-by-gemini"
            />
          )}
        </Card>
        {error && <span className="text-red-300">{error}</span>}
      </div>
    </div>
  );
}

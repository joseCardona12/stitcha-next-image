import { ChevronLeft, Download, Loader, Loader2 } from "lucide-react";
import TitleDescription from "./TitleDescription";
import { useEffect, useRef, useState } from "react";
import { jobService } from "@/services/job";
import { PROMPT_IMAGE } from "@/utils/constants/promptImage";
import ModalMessage from "../ModalMessage";
import { IModalMessage, ITab, IUrlImage } from "@/app/page";
import Button from "./Button";
import { IImageLocalMockup } from "@/utils/constants/images";
import { imageFetch } from "@/services/imageFetch";
import { download } from "@/utils/download";

interface IGenerateImageProps {
  urlImageSharp: string;
  openModalMessage: IModalMessage;
  setOpenModalMessage: (value: IModalMessage) => void;
  setImageOpenAI: (value: string) => void;
  imageOpenAI: string;
  imageBaseSelect: IImageLocalMockup;
  urlImageLogo: IUrlImage;
  setTab: (value: ITab) => void;
  setUrlImage: (value: IUrlImage) => void;
  setPreviewSharp: (value: string) => void;
}

export default function GenerateImage({
  urlImageSharp,
  openModalMessage,
  setOpenModalMessage,
  setImageOpenAI,
  imageOpenAI,
  imageBaseSelect,
  urlImageLogo,
  setTab,
  setUrlImage,
  setPreviewSharp,
}: IGenerateImageProps) {
  const [loadingImageOpenAI, setLoadingImageOpenAI] = useState(false);
  const [generateImageAgain, setGenerateImageAgain] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedRef = useRef(false);

  const startJob = async (prompt: string, generatedURLImage: string) => {
    const response = await jobService.startJob(prompt, generatedURLImage);
    return response?.jobId;
  };

  const handleDownload = async () => {
    setLoadingDownload(true);
    try {
      const blob = await imageFetch.getImage(imageOpenAI ?? "");
      download(blob);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingDownload(false);
    }
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getJobStatus = async (jobID: string) => {
    const data = await jobService.getStatus(jobID);

    if (data?.status === "COMPLETED") {
      stopPolling();
      setImageOpenAI(data.imageUrl);
      setLoadingImageOpenAI(false);
      setOpenModalMessage({
        message: "Success to generate image",
        open: true,
        type: "success",
      });
      setIsError(false);
    }

    if (data?.status === "ERROR" || data?.status === "FAILED") {
      stopPolling();
      setLoadingImageOpenAI(false);
      setOpenModalMessage({
        message: "ERROR to generate image",
        open: true,
        type: "error",
      });
      setIsError(true);
    }
  };

  const startPolling = (jobID: string) => {
    stopPolling();
    intervalRef.current = setInterval(() => {
      getJobStatus(jobID);
    }, 10000);
  };

  const generateImageOpenAI = async () => {
    if (!urlImageSharp || hasStartedRef.current) return;

    hasStartedRef.current = true;
    setLoadingImageOpenAI(true);

    const jobID = await startJob(PROMPT_IMAGE, urlImageSharp);
    startPolling(jobID);
  };

  const handleReset = () => {
    setOpenModalMessage({
      message: "",
      open: false,
      type: "",
    });
    setImageOpenAI("");
    setUrlImage({
      name: "",
      size: "",
      urlLogo: "",
    });
    setPreviewSharp("");
    setTab({
      tab: "selection",
    });
  };

  const handleGenerateImageAgain = () => {
    setImageOpenAI("");
    setGenerateImageAgain(!generateImageAgain);
  };

  useEffect(() => {
    if (imageOpenAI) return;
    generateImageOpenAI();

    return () => {
      stopPolling();
    };
  }, [imageBaseSelect, urlImageLogo, generateImageAgain]);

  return (
    <div className="w-300 h-full flex flex-col gap-6 relative">
      <TitleDescription title="Generar con OpenAI" description="Renderizado." />
      <div className="absolute top-0 right-0">
        <Button
          variant="default"
          className="flex items-center gap-2"
          onClick={() => {
            setTab({
              tab: "selection",
            });
          }}
          disabled={false}
        >
          <ChevronLeft />
          Volver al Inicio
        </Button>
      </div>
      <div className="border border-gray-200 rounded-xl w-full h-full flex justify-center items-center relative">
        {loadingImageOpenAI && !imageOpenAI && (
          <Loader2 className="w-6 h-6 animate-spin" />
        )}
        {!loadingImageOpenAI && imageOpenAI && (
          <div className="w-full h-full">
            <img
              src={imageOpenAI}
              alt="image-generated-by-openai"
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        )}
        <div className="absolute top-2 right-2">
          {imageOpenAI && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={false}
                onClick={handleDownload}
              >
                {loadingDownload && urlImageSharp ? (
                  <div className="flex items-center gap-2">
                    Descargando <Loader className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  <Download />
                )}
              </Button>
              <Button variant="outline" disabled={false} onClick={handleReset}>
                Generar una nueva imagen
              </Button>
            </div>
          )}
          {isError && (
            <Button
              variant="outline"
              disabled={false}
              onClick={handleGenerateImageAgain}
            >
              Intentar de nuevo
            </Button>
          )}
        </div>
      </div>

      {openModalMessage.open && (
        <ModalMessage
          openModalMessage={openModalMessage}
          setOpenModalMessage={setOpenModalMessage}
        />
      )}
    </div>
  );
}

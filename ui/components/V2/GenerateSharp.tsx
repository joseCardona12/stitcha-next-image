import { ChevronLeft, Download, Loader } from "lucide-react";
import Button from "./Button";
import TitleDescription from "./TitleDescription";
import { imageFetch } from "@/services/imageFetch";
import { useState } from "react";
import { download } from "@/utils/download";
import { ITab } from "@/app/page";

interface IGenerateSharpProps {
  urlImageSharp: string;
  setTab: (value: ITab) => void;
}
export default function GenerateSharp({
  urlImageSharp,
  setTab,
}: IGenerateSharpProps) {
  const [loadingDownload, setLoadingDownload] = useState<boolean>(false);
  const handleDownload = async () => {
    setLoadingDownload(true);
    try {
      const blob = await imageFetch.getImage(urlImageSharp ?? "");
      download(blob);
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoadingDownload(false);
    }
  };
  return (
    <div className="w-300 h-full flex flex-col gap-6 relative">
      <TitleDescription title="Generate with Sharp" description="Rendering" />
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
          Go to Home
        </Button>
      </div>
      <div className="border border-gray-200 rounded-xl w-full h-full flex justify-center items-center overflow-hidden relative">
        <div className="w-full h-full flex justify-center items-center rounded-md">
          <img
            src={urlImageSharp}
            alt="image-generate-by-sharp"
            className="w-full h-full object-cover translate-y-15"
          />
        </div>
        <div className="absolute top-2 right-2">
          <Button
            className=""
            disabled={false}
            onClick={handleDownload}
            variant="outline"
          >
            {loadingDownload && urlImageSharp ? (
              <div className="flex items-center gap-2">
                Descargando <Loader className="w-4 h-4 animate-spin" />
              </div>
            ) : (
              <Download />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
